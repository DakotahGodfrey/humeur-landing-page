import { locales, type Locale } from "@/i18n"

/**
 * Notion data-source schema. Types are named as Notion's UI names them; the
 * API name follows in parentheses where the two differ.
 *
 *   Title      Title              post title
 *   Slug       Text (rich_text)   URL segment, shared across translations
 *   Summary    Text (rich_text)   the card text, meta description and social
 *                                 preview — see the note below
 *   Locale     Select             `en` / `fr` (full tags also accepted)
 *   Published  Date               publication date — gates AND sorts
 *   Tags       Multi-select       must be in the site's vocabulary, see tags.ts
 *   Author     Text (rich_text)   not read — the site has no byline
 *   Cover      Files & media      not read yet
 *
 * `Published` does double duty: an empty date means draft, a future date
 * means scheduled, and a past date both publishes the post and orders it.
 * There is no separate checkbox to forget to tick.
 *
 * `Summary` is optional, as it is in the portfolio. It feeds the card, the
 * meta description and the social preview, so a row without one gets a build
 * warning — but it still publishes, and nothing is derived to fill the gap.
 * See the note on `description` in content.config.ts.
 *
 * Change a property name in Notion, change it in NOTION_PROPERTIES below.
 */
export type PostMeta = {
  id: string
  slug: string
  title: string
  summary: string
  locale: Locale
  /** The `Published` date, or null while the post is still a draft. */
  date: string | null
  tags: string[]
  /** True when this row is the default-locale original shown in place of a
   *  missing translation. */
  fallback: boolean
  /** True when `Published` is empty or still in the future. */
  draft: boolean
}

export const NOTION_PROPERTIES = {
  title: "Title",
  slug: "Slug",
  summary: "Summary",
  locale: "Locale",
  published: "Published",
  tags: "Tags",
} as const

/**
 * Notion's `Locale` options are short codes, which are nicer to author than
 * full tags. Both forms resolve to the same locale.
 *
 * Only `en-CA` is routed today. The other three are here because the aliases
 * cost nothing now and are the thing most likely to be missed when a
 * translation lands — the Notion rows can be written before the routes exist.
 */
const LOCALE_ALIASES: Record<string, string> = {
  en: "en-CA",
  "en-ca": "en-CA",
  fr: "fr-CA",
  "fr-ca": "fr-CA",
  es: "es-MX",
  "es-mx": "es-MX",
  de: "de",
  "de-de": "de",
}

/**
 * Resolve a `Locale` cell to one of the site's locales, or null if unknown.
 *
 * Note "unknown" covers two different things: a typo, and a locale the site
 * has not shipped yet. Both should keep the row out of the build, so both
 * return null and the caller skips the row.
 */
export function normalizeLocale(value: string | null): Locale | null {
  if (!value) return null

  const key = value.trim().toLowerCase()
  const aliased = LOCALE_ALIASES[key] ?? key
  return (locales as readonly string[]).find((locale) => locale.toLowerCase() === aliased.toLowerCase()) as
    | Locale
    | undefined ?? null
}
