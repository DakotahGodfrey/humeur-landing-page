import enCA from "./en-CA"
import frCA from "./fr-CA"
import type { Dictionary } from "./dictionary"

/**
 * Locale plumbing.
 *
 * Two locales today, en-CA and fr-CA. Adding es-MX or de is meant to stay a
 * data change, not a refactor: add the tag to `locales`, add a dictionary
 * here, and add the tag to astro.config.mjs. The routes under
 * `src/pages/[locale]/` are generated from `prefixedLocales`, so nothing new
 * has to be written per language.
 *
 * Nothing should read copy from anywhere but `useTranslations`. The moment a
 * component hardcodes a string, translating the page stops being a data
 * change — and the app already ships in four languages, so this page will.
 *
 * Components get their locale from `Astro.currentLocale`, which Astro derives
 * from the URL. Pass it through `resolveLocale` rather than casting: it is
 * `string | undefined`, and on a route Astro cannot attribute to a locale the
 * honest answer is the default rather than a crash.
 */

export const locales = ["en-CA", "fr-CA"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en-CA"

/** The locales that carry a URL prefix. `prefixDefaultLocale` is false, so
 *  en-CA serves from `/` and everything else from `/<tag>/`. This is what
 *  `getStaticPaths` iterates in src/pages/[locale]/. */
export const prefixedLocales = locales.filter((locale) => locale !== defaultLocale)

/** Endonyms — a language picker that says "French" to someone who does not
 *  read English is a picker they cannot use. */
export const localeNames: Record<Locale, string> = {
  "en-CA": "English",
  "fr-CA": "Français",
}

/** Short form for the header switcher, where there is no room for the full
 *  endonym beside the theme toggle. */
export const localeCodes: Record<Locale, string> = {
  "en-CA": "EN",
  "fr-CA": "FR",
}

const dictionaries = {
  "en-CA": enCA,
  "fr-CA": frCA,
} satisfies Record<Locale, Dictionary>


export type { Dictionary }

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/**
 * `Astro.currentLocale` — or anything else stringly-typed — narrowed to a
 * locale. Case-insensitive, because the URL segment is `/fr-ca/` while the
 * tag is `fr-CA`.
 */
export function resolveLocale(value: string | undefined | null): Locale {
  if (!value) return defaultLocale
  const wanted = value.toLowerCase()
  return locales.find((locale) => locale.toLowerCase() === wanted) ?? defaultLocale
}

export function useTranslations(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale]
}

/** The URL segment for a locale: `fr-CA` → `fr-ca`. */
export function localeSegment(locale: Locale): string {
  return locale.toLowerCase()
}

/** Locale-aware href. A no-op for en-CA, which is unprefixed. External URLs
 *  and bare fragments pass through untouched. */
export function localePath(path: string, locale: Locale = defaultLocale): string {
  if (path.startsWith("http") || path.startsWith("#")) return path
  const clean = path.startsWith("/") ? path : `/${path}`
  if (locale === defaultLocale) return clean
  return clean === "/" ? `/${localeSegment(locale)}/` : `/${localeSegment(locale)}${clean}`
}

/** A pathname with any locale prefix removed, so it can be re-prefixed for
 *  another one. `/fr-ca/blog/` → `/blog/`. */
export function stripLocale(pathname: string): string {
  for (const locale of prefixedLocales) {
    const segment = `/${localeSegment(locale)}`
    if (pathname === segment || pathname === `${segment}/`) return "/"
    if (pathname.startsWith(`${segment}/`)) return pathname.slice(segment.length)
  }
  return pathname
}

/** The same page in another locale — what the language switcher and the
 *  hreflang alternates both need. */
export function switchLocalePath(pathname: string, to: Locale): string {
  return localePath(stripLocale(pathname), to)
}

/** `fr-CA` → `fr_CA`, the underscore form Open Graph wants. */
export function ogLocale(locale: Locale): string {
  return locale.replace("-", "_")
}

/**
 * Fill `{name}` placeholders in a dictionary string.
 *
 * Sentences that interleave copy and figures — the month grid's accessible
 * name, the export header's date range — cannot be assembled by concatenating
 * fragments, because the word order differs between languages. The template
 * lives in the dictionary and the numbers are substituted here.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}
