import { getCollection, type CollectionEntry } from "astro:content"
import { TAG_KEYS, type TagKey } from "./tags"
import { fill, localePath, type Locale } from "@/i18n"
import type { Dictionary } from "@/i18n/dictionary"

export type Post = CollectionEntry<"posts">

/**
 * Published posts for one locale, newest first.
 *
 * Drafts are filtered here rather than at each call site, so there is one
 * place a post can leak from. `import.meta.env.DEV` keeps drafts visible
 * while writing and out of every build.
 *
 * The collection holds every locale at once — see the note in the Notion
 * loader — so the locale filter is not optional. A route that forgets it
 * renders every translation of every post on one page, which is why there is
 * no default: leaving it out is a type error, not a silent duplicate.
 */
export async function publishedPosts(locale: Locale): Promise<Post[]> {
  const posts = await getCollection(
    "posts",
    ({ data }) => data.locale === locale && (import.meta.env.DEV || !data.draft),
  )
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
}

export async function postsByTag(tag: TagKey, locale: Locale): Promise<Post[]> {
  const posts = await publishedPosts(locale)
  return posts.filter((post) => (post.data.tags as readonly TagKey[]).includes(tag))
}

/** Tags that actually have posts, in vocabulary order. An empty tag page is
 *  a broken-looking page, so unused tags simply don't get routed.
 *
 *  Computed per locale, because a tag can be in use in English and not yet in
 *  French — though while every French post is an en-CA fallback the two lists
 *  are identical. */
export async function tagsInUse(locale: Locale): Promise<TagKey[]> {
  const posts = await publishedPosts(locale)
  const used = new Set(posts.flatMap((post) => post.data.tags as readonly TagKey[]))
  return TAG_KEYS.filter((tag) => used.has(tag))
}

/** The path to a post, in its own locale. */
export function postPath(post: Post): string {
  return localePath(`/blog/${post.data.slug}/`, post.data.locale)
}

/** "8 August 2026" — day before month, matching the rest of the interface.
 *  The month names and the order both come from the dictionary, so a locale
 *  that writes a date differently says so there and not here. */
export function formatPostDate(d: Date, t: Dictionary): string {
  return fill(t.calendar.dateSpoken, {
    day: d.getUTCDate() === 1 && t.calendar.firstOfMonth ? t.calendar.firstOfMonth : d.getUTCDate(),
    month: t.calendar.months[d.getUTCMonth()],
    year: d.getUTCFullYear(),
  })
}

/** `<time datetime>` needs ISO, regardless of how the date is displayed. */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}
