import enCA from "./en-CA"

/**
 * Locale plumbing.
 *
 * One locale today. Adding fr-CA, es-MX or de is meant to be a data change,
 * not a refactor: add the tag to `locales`, add a dictionary here, add
 * `src/pages/[locale]/index.astro`, and add the tag to astro.config.mjs.
 *
 * Nothing should read copy from anywhere but `useTranslations`. The moment a
 * component hardcodes a string, translating the page stops being a data
 * change — and the app already ships in four languages, so this page will.
 */

export const locales = ["en-CA"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en-CA"

const dictionaries = {
  "en-CA": enCA,
} satisfies Record<Locale, unknown>

export type Dictionary = typeof enCA

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function useTranslations(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale]
}

/** Locale-aware href. A no-op while en-CA is unprefixed, but it means links
 *  don't have to be rewritten when the other three arrive. */
export function localePath(path: string, locale: Locale = defaultLocale): string {
  if (path.startsWith("http") || path.startsWith("#")) return path
  const clean = path.startsWith("/") ? path : `/${path}`
  // Widened deliberately: with a single locale in the union, TypeScript
  // narrows the else branch to `never` and the prefix logic stops compiling.
  // The branch is dead today and correct the moment a second locale lands.
  const tag: string = locale
  return tag === (defaultLocale as string) ? clean : `/${tag.toLowerCase()}${clean}`
}
