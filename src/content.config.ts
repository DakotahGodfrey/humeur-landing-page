import { defineCollection } from "astro:content"
// `z` re-exported from astro:content is deprecated in Astro 7. astro/zod is
// the exact zod build Astro validates with, so schemas can't drift from it.
import { z } from "astro/zod"
import { TAG_KEYS } from "./lib/tags"
import { notionPosts } from "./lib/notion/loader"

/**
 * Blog posts.
 *
 * The schema is stricter than a personal blog usually needs, on purpose. This
 * is a site for people managing a serious condition, and the failure mode
 * here isn't a broken layout — it's a sentence that reads as clinical advice,
 * or a claim about a feature that doesn't exist. A previous audit found the
 * marketing describing three features that didn't, one of which had reached
 * the legal documents. Frontmatter is a cheap place to make that harder.
 *
 * `description` is required because it's the meta description, the card text
 * and the only thing a reader sees before deciding to open the post. Letting
 * it default to the first paragraph produces worse versions of all three.
 *
 * Posts come from the "Humeur Blog" Notion database rather than from Markdown
 * in this repo — see lib/notion/loader.ts. The schema below is unchanged by
 * that move and still governs: the loader maps Notion properties onto these
 * fields and runs them through it, so a row missing a Summary or carrying a
 * tag that isn't in the vocabulary is held back exactly as bad frontmatter
 * would have been. What changed is the consequence. Bad frontmatter fails the
 * build; a bad Notion row logs a warning and is skipped, because it is edited
 * outside this repo by someone who cannot see a build log.
 */
const posts = defineCollection({
  loader: notionPosts(),
  schema: z
    .object({
      title: z.string().min(1).max(80),
      /**
       * One or two sentences. Used for the card, the meta description and the
       * social preview — so write it as standalone prose, not a teaser.
       *
       * Optional, but only in the sense that a post without one still
       * publishes. It was required while posts were Markdown in this repo,
       * where the author writing the post and the person who could fix the
       * frontmatter were the same person in the same commit. With Notion as
       * the source they are not: a row with an empty Summary was silently
       * held back, which turned one missing field into an empty notes
       * section. Holding back the post is a worse outcome than shipping it
       * without a teaser.
       *
       * Nothing is derived to fill the gap — no first-paragraph fallback,
       * which is what the original note here argued against and still does.
       * The card and the standfirst simply omit the line, and the page falls
       * back to the site-level meta description. The loader warns so the gap
       * is visible in a build log instead of only on the page.
       */
      description: z.string().min(1).max(200).optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** Closed vocabulary — see src/lib/tags.ts. A typo fails the build. */
      tags: z.array(z.enum(TAG_KEYS)).min(1).max(3),
      /** Drafts are excluded from the index, the tag pages and the routes. */
      draft: z.boolean().default(false),
    })
    .refine((data) => !data.updatedDate || data.updatedDate >= data.pubDate, {
      message: "updatedDate cannot be before pubDate",
      path: ["updatedDate"],
    }),
})

export const collections = { posts }
