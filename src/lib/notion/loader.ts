import type { Loader } from "astro/loaders"

import { defaultLocale } from "@/i18n"
import { TAG_KEYS, type TagKey } from "@/lib/tags"

import { createImageResolver } from "./images"
import { getPostBlocks, getPosts } from "./posts"
import { renderBlocks } from "./render"
import { isNotionConfigured } from "./client"

/**
 * The Notion content-layer loader.
 *
 * This replaces the `glob` loader that read src/content/posts. Everything
 * downstream — publishedPosts(), the tag pages, PostLayout, `render(post)` —
 * goes through getCollection("posts") and did not need to change; the entry
 * `id` is still the slug, and the body still arrives through `render()`
 * because the loader stores `rendered.html`.
 *
 * WHEN THIS RUNS. Astro builds this site statically, so posts are fetched at
 * build time and a deploy is what publishes them. Editing Notion does not
 * change the live site on its own — a scheduled post goes out on the next
 * build after its date, not on its date. If that turns out to matter, the fix
 * is a Notion automation hitting a Vercel deploy hook, not a change here.
 *
 * HOW IT FAILS. Badly-formed rows are skipped with a warning; they do not
 * fail the build. That is the opposite of the rule for the file-backed posts
 * this replaces, and deliberately so: a broken Markdown file is in the repo
 * and fails in the pull request that introduced it, while a Notion row is
 * edited by a person outside this repo who has no way to see a build. A
 * half-written row should not take down the next deploy of anything else.
 *
 * The one thing that DOES fail the build is Notion being configured but
 * unreachable — see the catch at the bottom.
 */
export function notionPosts(): Loader {
  return {
    name: "notion-posts",

    load: async ({ store, logger, parseData }) => {
      if (!isNotionConfigured()) {
        // No token: the collection is simply empty and the site still builds.
        // This is what makes the repo cloneable without credentials.
        logger.warn("NOTION_TOKEN not set — the notes section will be empty.")
        store.clear()
        return
      }

      // Drafts are visible in `astro dev` and never in a build, matching what
      // publishedPosts() already did for file-backed posts.
      const includeDrafts = import.meta.env.DEV

      let posts
      try {
        posts = await getPosts(defaultLocale, { includeDrafts })
      } catch (error) {
        // Configured but unreachable is a real failure — a bad token or a
        // database that lost its share should not deploy a silently empty
        // blog over a working one.
        throw new Error(
          `Notion is configured but the query failed: ${(error as Error).message}`,
        )
      }

      // Cleared and refetched rather than diffed. Incremental loading would
      // need a per-row digest, and it would still have to fetch every row to
      // notice a deletion — which is the case that matters, because a stale
      // post is worse than a slow build.
      store.clear()

      const resolveImage = createImageResolver((message) => logger.warn(message))
      let published = 0

      for (const post of posts) {
        const held = (reason: string) =>
          logger.warn(`"${post.title}" held back — ${reason}`)

        if (!post.summary) {
          // Warned, not held back. See the note on `description` in
          // content.config.ts: an empty Summary costs this post its card text
          // and its own meta description, which is worth flagging, but it is
          // not worth removing the post from the site over.
          logger.warn(
            `"${post.title}" has no Summary — the card and the standfirst will omit it, ` +
              `and the page falls back to the site meta description.`,
          )
        }

        // Unknown tags are dropped with a warning rather than failing the
        // row, so adding a tag in Notion before adding it to tags.ts costs a
        // warning and not a missing post. A row with none left is held back,
        // because the schema requires at least one and an untagged post has
        // no route on any tag page.
        const known = post.tags.filter((tag): tag is TagKey =>
          (TAG_KEYS as readonly string[]).includes(tag),
        )
        const unknown = post.tags.filter((tag) => !(TAG_KEYS as readonly string[]).includes(tag))
        if (unknown.length) {
          logger.warn(
            `"${post.title}" — ignoring tag(s) not in src/lib/tags.ts: ${unknown.join(", ")}`,
          )
        }
        if (!known.length) {
          held(`no tags in the site's vocabulary (${TAG_KEYS.join(", ")}).`)
          continue
        }

        const blocks = await getPostBlocks(post.id)

        // Notion authors commonly repeat the page title as the first heading
        // of the body, because the Notion editor shows the title in a chrome
        // that doesn't read as part of the document. PostLayout already
        // renders the title as the page's h1, so that block would print it
        // twice in a row. Dropped only when it is the *first* block and its
        // text matches the title exactly — a later heading that happens to
        // repeat the title is a real section and stays.
        const [first] = blocks
        const firstText =
          first && first.type.startsWith("heading_")
            ? ((first as never as Record<string, { rich_text: Array<{ plain_text: string }> }>)[
                first.type
              ]?.rich_text
                ?.map((run) => run.plain_text)
                .join("") ?? "")
            : ""
        const body =
          firstText.trim().toLowerCase() === post.title.trim().toLowerCase()
            ? blocks.slice(1)
            : blocks

        const { html, skipped } = await renderBlocks(body, resolveImage)

        if (skipped.length) {
          logger.warn(
            `"${post.title}" — no renderer for block type(s): ${skipped.join(", ")}. Skipped.`,
          )
        }

        if (!html) {
          held("the Notion page has no renderable content.")
          continue
        }

        try {
          const data = await parseData({
            id: post.slug,
            data: {
              title: post.title,
              // Empty string would fail the schema's min(1); absent is the
              // state the schema actually models.
              description: post.summary || undefined,
              // A draft has no Published date. The schema needs one, and the
              // value is never shown for a draft — it only ever sorts the dev
              // index — so today's date stands in rather than inventing one.
              pubDate: post.date ?? new Date().toISOString(),
              tags: known.slice(0, 3),
              draft: post.draft,
            },
          })

          store.set({ id: post.slug, data, rendered: { html } })
          if (!post.draft) published += 1
        } catch (error) {
          // parseData throws the collection's own zod message, which names
          // the field. Worth surfacing verbatim — it is more specific than
          // anything this loader could say about it.
          held((error as Error).message.replace(/\s+/g, " ").trim())
        }
      }

      const drafts = store.keys().length - published
      logger.info(
        `${published} post${published === 1 ? "" : "s"} from Notion` +
          (drafts > 0 ? ` (+${drafts} draft${drafts === 1 ? "" : "s"}, dev only)` : ""),
      )
    },
  }
}
