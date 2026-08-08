import { getCollection, type CollectionEntry } from "astro:content"
import { TAG_KEYS, type TagKey } from "./tags"

export type Post = CollectionEntry<"posts">

/**
 * Published posts, newest first.
 *
 * Drafts are filtered here rather than at each call site, so there is one
 * place a post can leak from. `import.meta.env.DEV` keeps drafts visible
 * while writing and out of every build.
 */
export async function publishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft)
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
}

export async function postsByTag(tag: TagKey): Promise<Post[]> {
  const posts = await publishedPosts()
  return posts.filter((post) => (post.data.tags as readonly TagKey[]).includes(tag))
}

/** Tags that actually have posts, in vocabulary order. An empty tag page is
 *  a broken-looking page, so unused tags simply don't get routed. */
export async function tagsInUse(): Promise<TagKey[]> {
  const posts = await publishedPosts()
  const used = new Set(posts.flatMap((post) => post.data.tags as readonly TagKey[]))
  return TAG_KEYS.filter((tag) => used.has(tag))
}

/** "8 August 2026" — day before month, matching the rest of the interface. */
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const

export function formatPostDate(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** `<time datetime>` needs ISO, regardless of how the date is displayed. */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}
