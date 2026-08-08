import { addDays, eachDay, entryFor, isSplit, type DayEntry } from "./history"
import { MOOD_SCALE, nearestLabel } from "./moodScale"

/**
 * Calendar construction and the summary figures.
 *
 * Weeks are Sunday-first and month grids pad out to whole weeks, matching the
 * app's month view and the printed export. Padding cells belong to the
 * neighbouring month and render as a filled cell with a lowercase x; a day
 * inside the month with no entry renders as a dashed empty cell. Those two
 * states look different on purpose — one means "not this month", the other
 * means "nothing recorded", and a gap is information.
 */

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const

export const WEEKDAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const
export const WEEKDAYS_PRINT = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] as const
export const WEEKDAY_LONG = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
] as const

export interface CalendarDay {
  date: Date | null
  dayOfMonth: number | null
  entry: DayEntry | null
}

/** Sunday-first cells for a month, padded to whole weeks. */
export function monthCells(year: number, month: number): CalendarDay[] {
  const first = new Date(Date.UTC(year, month - 1, 1))
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const lead = first.getUTCDay()

  const cells: CalendarDay[] = []
  for (let i = 0; i < lead; i++) cells.push({ date: null, dayOfMonth: null, entry: null })
  for (let d = 1; d <= days; d++) {
    const date = new Date(Date.UTC(year, month - 1, d))
    cells.push({ date, dayOfMonth: d, entry: entryFor(date) })
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, dayOfMonth: null, entry: null })
  return cells
}

/** The numeric average the app shows in the month header, or null. */
export function monthAverage(year: number, month: number): number | null {
  const scores: number[] = []
  for (const cell of monthCells(year, month)) {
    const e = cell.entry
    if (e?.am) scores.push(e.am.score)
    if (e?.pm) scores.push(e.pm.score)
  }
  if (scores.length === 0) return null
  return round1(scores.reduce((a, b) => a + b, 0) / scores.length)
}

export interface RangeStats {
  total: number
  logged: number
  notLogged: number
  percentLogged: number
  average: number
  averageLabel: string
  entries: number
  splits: number
  mix: { label: string; cssVar: string; count: number }[]
  lowest: string
  highest: string
  admissions: { from: Date; to: Date; days: number }[]
}

/** Figures for the printed summary. Field names follow export.pdf: "Days in
 *  period", "Days logged", "Not logged", "Average mood", then the mood mix. */
export function rangeStats(from: Date, to: Date): RangeStats {
  const days = eachDay(from, to)
  const scores: number[] = []
  const counts = new Map<number, number>()
  let logged = 0
  let splits = 0

  for (const d of days) {
    const e = entryFor(d)
    if (!e?.am) continue
    logged++
    if (isSplit(e)) splits++
    for (const half of [e.am, e.pm]) {
      if (!half) continue
      scores.push(half.score)
      counts.set(half.score, (counts.get(half.score) ?? 0) + 1)
    }
  }

  const average = round1(scores.reduce((a, b) => a + b, 0) / scores.length)

  return {
    total: days.length,
    logged,
    notLogged: days.length - logged,
    percentLogged: Math.round((100 * logged) / days.length),
    average,
    averageLabel: nearestLabel(average),
    entries: scores.length,
    splits,
    mix: MOOD_SCALE.filter((m) => counts.has(m.score)).map((m) => ({
      label: m.label,
      cssVar: m.cssVar,
      count: counts.get(m.score)!,
    })),
    lowest: labelFor(Math.min(...scores)),
    highest: labelFor(Math.max(...scores)),
    admissions: admissionRuns(days),
  }
}

function admissionRuns(days: Date[]) {
  const runs: { from: Date; to: Date; days: number }[] = []
  for (const d of days) {
    if (!entryFor(d)?.admission) continue
    const last = runs.at(-1)
    if (last && addDays(last.to, 1).getTime() === d.getTime()) {
      last.to = d
      last.days++
    } else {
      runs.push({ from: d, to: d, days: 1 })
    }
  }
  return runs
}

function labelFor(score: number): string {
  return MOOD_SCALE.find((m) => m.score === score)!.label
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

/* ── Formatting ─────────────────────────────────────────────────────────── */

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

/**
 * "Fri 1 May 2026" — the exact shape the export header uses.
 *
 * Built by hand rather than through toLocaleDateString, which renders this
 * as "Fri, May 1, 2026" under en-CA. The printed summary has no commas and
 * puts the day before the month, and this string appears on the page next to
 * a picture of that summary, so the two have to agree.
 */
export function formatLong(d: Date): string {
  const wd = WEEKDAY_SHORT[d.getUTCDay()]
  const mon = MONTH_NAMES[d.getUTCMonth()].slice(0, 3)
  return `${wd} ${d.getUTCDate()} ${mon} ${d.getUTCFullYear()}`
}

/** "1 May 2026" — same, without the weekday. */
export function formatShort(d: Date): string {
  return `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`
}

/** "29 June 2026" — for accessible names and the day-view header. Built by
 *  hand for the same reason as formatLong: en-CA renders this "June 29, 2026",
 *  and day-before-month is what the rest of the interface uses. */
export function formatSpoken(d: Date): string {
  return `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** The text equivalent for a calendar cell. Decorative swatches are hidden
 *  from assistive tech; anything carrying meaning gets one of these. */
export function describeDay(date: Date, entry: DayEntry | null): string {
  const when = formatSpoken(date)
  const admission = entry?.admission ? ", hospital admission" : ""
  if (!entry?.am) return `${when}, no entry${admission}`
  if (!isSplit(entry)) return `${when}, ${entry.am.label} all day${admission}`
  return `${when}, ${entry.am.label} in the morning, ${entry.pm!.label} in the evening${admission}`
}

/** A one-line summary of a month grid, so the grid can be a single labelled
 *  image rather than thirty-odd unreadable cells. */
export function describeMonth(year: number, month: number): string {
  const cells = monthCells(year, month).filter((c) => c.date)
  const logged = cells.filter((c) => c.entry?.am).length
  const splits = cells.filter((c) => isSplit(c.entry)).length
  const admissions = cells.filter((c) => c.entry?.admission).length
  const base = `${MONTH_NAMES[month - 1]} ${year}: ${logged} of ${cells.length} days logged, ${splits} split between morning and evening`
  return admissions ? `${base}, ${admissions} days marked as a hospital admission` : base
}
