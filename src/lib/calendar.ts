import { addDays, eachDay, entryFor, isSplit, type DayEntry } from "./history"
import { MOOD_SCALE, nearestMood, type MoodSlug } from "./moodScale"
import { fill } from "@/i18n"
import type { Dictionary } from "@/i18n/dictionary"

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

/* Month and weekday names used to live here. They are words, so they moved
   to the `calendar` block of each dictionary in src/i18n — read them off `t`.
   Everything below that produces a human-readable string takes the dictionary
   for the same reason. */

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
  /** Slugs, not labels: the figures are locale-independent and the words are
   *  looked up at the point of display. */
  averageSlug: MoodSlug
  entries: number
  splits: number
  mix: { slug: MoodSlug; cssVar: string; count: number }[]
  lowest: MoodSlug
  highest: MoodSlug
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
    averageSlug: nearestMood(average).slug,
    entries: scores.length,
    splits,
    mix: MOOD_SCALE.filter((m) => counts.has(m.score)).map((m) => ({
      slug: m.slug,
      cssVar: m.cssVar,
      count: counts.get(m.score)!,
    })),
    lowest: slugFor(Math.min(...scores)),
    highest: slugFor(Math.max(...scores)),
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

function slugFor(score: number): MoodSlug {
  return MOOD_SCALE.find((m) => m.score === score)!.slug
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

/* ── Formatting ─────────────────────────────────────────────────────────── */

/** The day of the month as the language writes it. French takes an ordinal on
 *  the first and a bare numeral on every other day; English takes a bare
 *  numeral throughout, and says so with an empty `firstOfMonth`. */
function dayNumeral(d: Date, t: Dictionary): string {
  const day = d.getUTCDate()
  return day === 1 && t.calendar.firstOfMonth ? t.calendar.firstOfMonth : String(day)
}

/**
 * "Fri 1 May 2026" — the exact shape the export header uses.
 *
 * Built from the dictionary rather than through toLocaleDateString, which
 * renders this as "Fri, May 1, 2026" under en-CA. The printed summary has no
 * commas and puts the day before the month, and this string appears on the
 * page next to a picture of that summary, so the two have to agree.
 *
 * The order lives in the dictionary too, as a `{weekday} {day} {month} {year}`
 * template, because a language that orders a date differently should be able
 * to say so without a code change.
 */
export function formatLong(d: Date, t: Dictionary): string {
  return fill(t.calendar.dateLong, {
    weekday: t.calendar.weekdaysShort[d.getUTCDay()],
    day: dayNumeral(d, t),
    month: t.calendar.monthsShort[d.getUTCMonth()],
    year: d.getUTCFullYear(),
  })
}

/** "1 May 2026" — same, without the weekday. */
export function formatShort(d: Date, t: Dictionary): string {
  return fill(t.calendar.dateShort, {
    day: dayNumeral(d, t),
    month: t.calendar.monthsShort[d.getUTCMonth()],
    year: d.getUTCFullYear(),
  })
}

/** "29 June 2026" — for accessible names and the day-view header. Full month
 *  name rather than the abbreviation, because this one gets read aloud. */
export function formatSpoken(d: Date, t: Dictionary): string {
  return fill(t.calendar.dateSpoken, {
    day: dayNumeral(d, t),
    month: t.calendar.months[d.getUTCMonth()],
    year: d.getUTCFullYear(),
  })
}

/** The text equivalent for a calendar cell. Decorative swatches are hidden
 *  from assistive tech; anything carrying meaning gets one of these. */
export function describeDay(date: Date, entry: DayEntry | null, t: Dictionary): string {
  const when = formatSpoken(date, t)
  const admission = entry?.admission ? t.calendar.dayAdmission : ""
  if (!entry?.am) return fill(t.calendar.dayNoEntry, { date: when }) + admission
  if (!isSplit(entry)) {
    return fill(t.calendar.dayAllDay, { date: when, mood: t.moods[entry.am.slug] }) + admission
  }
  return (
    fill(t.calendar.daySplit, {
      date: when,
      am: t.moods[entry.am.slug],
      pm: t.moods[entry.pm!.slug],
    }) + admission
  )
}

/** A one-line summary of a month grid, so the grid can be a single labelled
 *  image rather than thirty-odd unreadable cells. */
export function describeMonth(year: number, month: number, t: Dictionary): string {
  const cells = monthCells(year, month).filter((c) => c.date)
  const logged = cells.filter((c) => c.entry?.am).length
  const splits = cells.filter((c) => isSplit(c.entry)).length
  const admissions = cells.filter((c) => c.entry?.admission).length
  const base = fill(t.calendar.monthSummary, {
    month: t.calendar.months[month - 1],
    year,
    logged,
    total: cells.length,
    splits,
  })
  return admissions ? base + fill(t.calendar.monthSummaryAdmissions, { admissions }) : base
}
