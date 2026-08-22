import { collectPaginatedAPI, iteratePaginatedAPI } from "@notionhq/client"
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"

import { defaultLocale, type Locale } from "@/i18n"

import { getDataSourceId, getNotionClient, isNotionConfigured } from "./client"
import { NOTION_PROPERTIES, normalizeLocale, type PostMeta } from "./types"

type Row = PageObjectResponse

/**
 * Include drafts and scheduled posts.
 *
 * The portfolio gates this on Next's Draft Mode cookie. A static Astro build
 * has no request to carry a cookie, so the gate here is the build itself:
 * `astro dev` includes drafts, `astro build` does not. Same intent, and it
 * matches what publishedPosts() in lib/posts.ts already did for file-backed
 * posts — a draft is visible while you're writing and never in a deploy.
 */
export type FetchOptions = { includeDrafts?: boolean }

function isFullPage(page: unknown): page is Row {
  return typeof page === "object" && page !== null && "properties" in page
}

function plainText(property: unknown): string {
  if (!property || typeof property !== "object") return ""
  const prop = property as Record<string, unknown>

  const runs =
    (prop.type === "title" ? prop.title : prop.type === "rich_text" ? prop.rich_text : null) ?? null

  if (!Array.isArray(runs)) return ""
  return runs.map((run) => (run as { plain_text?: string }).plain_text ?? "").join("")
}

function selectName(property: unknown): string | null {
  const prop = property as { type?: string; select?: { name?: string } | null }
  return prop?.type === "select" ? (prop.select?.name ?? null) : null
}

/**
 * A URL segment from a title, for rows where Slug hasn't been filled in.
 *
 * Mechanical, not editorial — it lowercases and hyphenates, and invents
 * nothing. A row still needs a real Slug before it publishes, because a
 * generated one changes the moment someone edits the title and takes the
 * post's URL with it. This exists so a draft is previewable in dev.
 */
function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function toPostMeta(row: Row): PostMeta | null {
  const props = row.properties

  const title = plainText(props[NOTION_PROPERTIES.title]).trim()
  if (!title) return null

  // The portfolio requires Slug and drops the row without one. Here an empty
  // Slug falls back to the title so the row is still previewable in dev; the
  // loader refuses to publish it, which is where that belongs.
  const slug = plainText(props[NOTION_PROPERTIES.slug]).trim() || slugify(title)
  if (!slug) return null

  const publishedProp = props[NOTION_PROPERTIES.published] as
    | { type?: string; date?: { start?: string } | null }
    | undefined

  const date = publishedProp?.date?.start ?? null

  const tagsProp = props[NOTION_PROPERTIES.tags] as
    | { type?: string; multi_select?: Array<{ name: string }> }
    | undefined

  return {
    id: row.id,
    slug,
    title,
    summary: plainText(props[NOTION_PROPERTIES.summary]).trim(),
    locale: normalizeLocale(selectName(props[NOTION_PROPERTIES.locale])) ?? defaultLocale,
    date,
    tags: tagsProp?.multi_select?.map((tag) => tag.name) ?? [],
    fallback: false,
    // Empty date = draft; future date = scheduled, and not public yet either.
    draft: date === null || new Date(date).getTime() > Date.now(),
  }
}

/**
 * Every post the caller is allowed to see, newest first.
 * Empty when Notion is not configured, so the site still builds and renders.
 */
async function fetchPosts({ includeDrafts = false }: FetchOptions): Promise<PostMeta[]> {
  if (!isNotionConfigured()) return []

  const notion = getNotionClient()
  const dataSourceId = await getDataSourceId()
  if (!notion || !dataSourceId) return []

  const pages = await collectPaginatedAPI(notion.dataSources.query, {
    data_source_id: dataSourceId,
    // Drafts have an empty `Published`, so the filter is simply its presence.
    // The future-dated case is excluded below, where "now" is evaluated per
    // build rather than baked into the query.
    filter: includeDrafts
      ? undefined
      : { property: NOTION_PROPERTIES.published, date: { is_not_empty: true } },
    sorts: [{ property: NOTION_PROPERTIES.published, direction: "descending" }],
  })

  const posts = pages
    .filter(isFullPage)
    .map(toPostMeta)
    .filter((post): post is PostMeta => post !== null)

  return includeDrafts ? posts : posts.filter((post) => !post.draft)
}

/**
 * Posts for one locale. A post with no row in `locale` falls back to its
 * default-locale row, flagged so the page can say so.
 *
 * A no-op while en-CA is the only locale, and deliberately kept anyway: one
 * row per (slug, locale) is the convention the Notion database is already
 * authored against, and the fallback is what stops a half-translated blog
 * from looking like a half-broken one.
 */
export async function getPosts(locale: Locale, options: FetchOptions = {}): Promise<PostMeta[]> {
  const all = await fetchPosts(options)

  const translated = all.filter((post) => post.locale === locale)
  const covered = new Set(translated.map((post) => post.slug))

  const fallbacks = all
    .filter((post) => post.locale === defaultLocale && !covered.has(post.slug))
    .map((post) => ({ ...post, fallback: true }))

  return [...translated, ...fallbacks].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
}

/*
 * The reference also exports getPost(slug, locale) and getAllSlugs(). Neither
 * is ported: Next needs them for generateStaticParams and per-request lookup,
 * while here the loader reads every row once at build time and the routes go
 * through getCollection("posts"). They're a copy-paste away in the portfolio
 * if a future route wants them; an unused export is a thing that drifts.
 */

/** Top-level blocks of a post, with children resolved one level deep. */
export async function getPostBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const notion = getNotionClient()
  if (!notion) return []

  const blocks: BlockObjectResponse[] = []

  for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
    block_id: pageId,
  })) {
    if ("type" in block) blocks.push(block as BlockObjectResponse)
  }

  return blocks
}
