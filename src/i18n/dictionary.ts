import type enCA from "./en-CA"

/**
 * The shape every dictionary has to satisfy.
 *
 * en-CA is the source of truth for the structure as well as the words, so the
 * type is derived from it rather than declared twice. It lives in its own
 * module so a translation can import the type without importing the registry
 * in ./index that imports the translation back.
 *
 * en-CA is `as const`, which makes every string its own literal type — useful
 * for nothing here, and fatal to a structural check, because "Crise" is not
 * assignable to "Crisis". `Widen` relaxes the literals and keeps the shape, so
 * `astro check` fails on a key a translation is missing rather than on a word
 * it translated.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : { readonly [K in keyof T]: Widen<T[K]> }

export type Dictionary = Widen<typeof enCA>
