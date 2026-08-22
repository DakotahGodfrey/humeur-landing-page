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
 */

export const TAGS = {
  tracking: {
    label: "Tracking",
    blurb: "The habit itself — what to record, how often, and what to do about the days you miss.",
  },
  patterns: {
    label: "Patterns",
    blurb: "Reading a month or a year of your own entries without over-reading them.",
  },
  appointments: {
    label: "Appointments",
    blurb: "Bringing a record to a provider, and what tends to be useful once you're in the room.",
  },
  notes: {
    label: "Notes",
    blurb: "The written half of an entry: what's worth keeping, and what to leave out.",
  },
  privacy: {
    label: "Privacy",
    blurb: "Encryption, what a server can and can't see, and who holds the keys.",
  },
  product: {
    label: "Product",
    blurb: "What shipped, what changed, and why a decision went the way it did.",
  },

  /* ── Added when the posts moved to Notion ──────────────────────────────
     These two are the options that already existed on the Notion database's
     Tags property, and they had no counterpart here — so every row in Notion
     failed the schema's tag check and nothing could publish.

     Adding them was the option that keeps Notion authoritative about what a
     post is tagged, rather than mapping `intro` and `about` onto `product`
     and inventing editorial meaning the author didn't write. It is also the
     cheapest to undo: delete these two, retag the rows in Notion, and the
     loader will report anything left pointing at them.

     Adding a tag here is still a decision — see the note at the top. Adding
     one in Notion alone is not: the loader drops unknown tags with a warning
     and holds back a post that has none left. */
  intro: {
    label: "Intro",
    blurb: "Starting points — what Humeur is, and what it's for.",
  },
  about: {
    label: "About",
    blurb: "The project behind the app: why it exists, and how it gets built.",
  },
} as const

export type TagKey = keyof typeof TAGS

export const TAG_KEYS = Object.keys(TAGS) as [TagKey, ...TagKey[]]

export function tagLabel(key: TagKey): string {
  return TAGS[key].label
}

export function tagBlurb(key: TagKey): string {
  return TAGS[key].blurb
}
