/**
 * The seven-level mood scale, mirroring lib/moodScale.ts in the app.
 *
 * Scores run 0–6 so the numeric average the app shows ("avg 3.3", "Average
 * mood 1.8" in the export) means the same thing here as it does there.
 *
 * The colours are theme-invariant and monotonic in lightness, L* 5.0 to 90.0.
 * That ordering is what makes a month grid readable without colour vision, so
 * the order below is load-bearing: do not sort it, do not re-map it.
 */

export type MoodScore = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Which text tone stays legible on top of a swatch. Values taken from the
 *  app's MOOD_SCALE rather than re-derived, so the two cannot drift. */
export type MoodTextTone = "light" | "dark"

export interface MoodLevel {
  score: MoodScore
  /** Key used in the committed history fixture. */
  slug: string
  label: string
  /** Tailwind class for a background fill. */
  bg: string
  /** Raw token name, for inline custom properties on split cells. */
  cssVar: string
  textTone: MoodTextTone
}

export const MOOD_SCALE: readonly MoodLevel[] = [
  { score: 0, slug: "crisis",    label: "Crisis",    bg: "bg-mood-crisis",    cssVar: "--mood-crisis",    textTone: "light" },
  { score: 1, slug: "awful",     label: "Awful",     bg: "bg-mood-awful",     cssVar: "--mood-awful",     textTone: "light" },
  { score: 2, slug: "bad",       label: "Bad",       bg: "bg-mood-bad",       cssVar: "--mood-bad",       textTone: "light" },
  { score: 3, slug: "not-great", label: "Not great", bg: "bg-mood-not-great", cssVar: "--mood-not-great", textTone: "dark" },
  { score: 4, slug: "okay",      label: "Okay",      bg: "bg-mood-okay",      cssVar: "--mood-okay",      textTone: "dark" },
  { score: 5, slug: "good",      label: "Good",      bg: "bg-mood-good",      cssVar: "--mood-good",      textTone: "dark" },
  { score: 6, slug: "great",     label: "Great",     bg: "bg-mood-great",     cssVar: "--mood-great",     textTone: "dark" },
] as const

const BY_SLUG = new Map(MOOD_SCALE.map((m) => [m.slug, m]))
const BY_SCORE = new Map(MOOD_SCALE.map((m) => [m.score, m]))

export function moodBySlug(slug: string): MoodLevel {
  const found = BY_SLUG.get(slug)
  if (!found) throw new Error(`Unknown mood slug: ${slug}`)
  return found
}

export function moodByScore(score: number): MoodLevel {
  const found = BY_SCORE.get(score as MoodScore)
  if (!found) throw new Error(`Unknown mood score: ${score}`)
  return found
}

/** Rounded to the nearest level, for prose like "average: Not great". The
 *  numeric average is what the app displays; this is only for copy. */
export function nearestLabel(average: number): string {
  return moodByScore(Math.round(average)).label
}
