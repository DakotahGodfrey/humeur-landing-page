/**
 * Outbound destinations.
 *
 * Kept in one place so no component invents a URL, and so the app origin can
 * be pointed at a staging build without a find-and-replace.
 */

export const APP_ORIGIN = "https://humeur.dev"

export const links = {
  home: `${APP_ORIGIN}/`,
  app: `${APP_ORIGIN}/app`,
  signIn: `${APP_ORIGIN}/sign-in`,
  /** Free, on every plan, no account. Never put this behind anything. */
  crisis: `${APP_ORIGIN}/crisis`,

  // TODO(launch): these two routes do not exist on this site yet. The policy
  // and terms are drafted and in legal review; both need a page here (or a
  // redirect to wherever they end up living) before this goes public, or the
  // footer ships two 404s. Legal review is the stated launch dependency, so
  // this is the thing most likely to be forgotten.
  privacy: "/privacy",
  terms: "/terms",
} as const

/** The range the illustrations cover: three whole months ending 31 Jul 2026. */
export const DEMO_RANGE = {
  from: new Date(Date.UTC(2026, 4, 1)),
  to: new Date(Date.UTC(2026, 6, 31)),
  months: [
    { year: 2026, month: 5 },
    { year: 2026, month: 6 },
    { year: 2026, month: 7 },
  ],
} as const

/** The months shown at full size in the patterns section. */
export const PATTERN_MONTHS = [
  { year: 2026, month: 6 },
  { year: 2026, month: 7 },
  { year: 2026, month: 8 },
] as const
