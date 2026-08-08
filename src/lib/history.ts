import raw from "@/data/demo-history.json"
import { moodBySlug, type MoodLevel } from "./moodScale"

/**
 * The committed demo history, and the small amount of date arithmetic the
 * illustrations need.
 *
 * Everything on the page — the calendars, the readout, the export sheet — is
 * derived from this one fixture, so the figures always agree with the grids.
 * If the fixture changes, every number on the page changes with it.
 *
 * This is invented data for a fictional person. It is deliberately not a
 * pleasant year: a real product for this audience should not illustrate
 * itself with a month of Greats.
 */

export interface DayEntry {
  /** Morning. Absent when the day was never logged. */
  am?: MoodLevel
  /** Evening. Equal to `am` when the day was logged as a whole. */
  pm?: MoodLevel
  admission: boolean
  /** True when the day falls inside the tracked range but has no mood. */
  logged: boolean
}

interface RawEntry {
  am?: string
  pm?: string
  admission?: boolean
}

const ENTRIES = raw.entries as Record<string, RawEntry>

export const HISTORY_START = parseKey(raw._range.from)
export const HISTORY_END = parseKey(raw._range.to)

/** `YYYY-MM-DD`, the same key shape the app uses. */
export function dateKey(d: Date): string {
  const m = `${d.getUTCMonth() + 1}`.padStart(2, "0")
  const day = `${d.getUTCDate()}`.padStart(2, "0")
  return `${d.getUTCFullYear()}-${m}-${day}`
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(Date.UTC(y!, m! - 1, d!))
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86_400_000)
}

export function inHistory(d: Date): boolean {
  return d >= HISTORY_START && d <= HISTORY_END
}

export function entryFor(d: Date): DayEntry | null {
  if (!inHistory(d)) return null
  const rec = ENTRIES[dateKey(d)]
  if (!rec) return { admission: false, logged: false }
  return {
    am: rec.am ? moodBySlug(rec.am) : undefined,
    pm: rec.pm ? moodBySlug(rec.pm) : undefined,
    admission: rec.admission === true,
    logged: Boolean(rec.am),
  }
}

export function isSplit(e: DayEntry | null): boolean {
  return Boolean(e?.am && e.pm && e.am.score !== e.pm.score)
}

export function eachDay(from: Date, to: Date): Date[] {
  const out: Date[] = []
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d)
  return out
}
