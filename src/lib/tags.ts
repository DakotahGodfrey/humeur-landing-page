import type { Dictionary } from "@/i18n/dictionary"

/**
 * The blog's tag vocabulary.
 *
 * Deliberately small and closed. An open `string[]` tag field fragments
 * within about a dozen posts — "appointment", "appointments", "Appointments"
 * — and every one of those spawns a near-empty page that looks like a broken
 * site. Adding a tag here is a decision; typing one into frontmatter is not.
 *
 * The schema validates against these keys, so a typo fails the build instead
 * of quietly publishing.
 *
 * Only the keys live here. The label and the blurb are words, so they live in
 * the `tags` block of each dictionary in src/i18n — a tag added here without a
 * matching entry there fails `astro check`, which is the outcome we want:
 * a French tag page headed "Appointments" is worse than a build error.
 *
 * The last two keys were added when the posts moved to Notion. They are the
 * options that already existed on the Notion database's Tags property and had
 * no counterpart here, so every row in Notion failed the schema's tag check
 * and nothing could publish. Adding them keeps Notion authoritative about what
 * a post is tagged, rather than mapping `intro` and `about` onto `product` and
 * inventing editorial meaning the author didn't write. It is also the cheapest
 * to undo: delete them, retag the rows in Notion, and the loader will report
 * anything left pointing at them.
 */
export const TAG_KEYS = [
  "tracking",
  "patterns",
  "appointments",
  "notes",
  "privacy",
  "product",
  "intro",
  "about",
] as const satisfies readonly [string, ...string[]]

export type TagKey = (typeof TAG_KEYS)[number]

export function tagLabel(key: TagKey, t: Dictionary): string {
  return t.tags[key].label
}

export function tagBlurb(key: TagKey, t: Dictionary): string {
  return t.tags[key].blurb
}
