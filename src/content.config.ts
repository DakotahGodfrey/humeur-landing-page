import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
// `z` re-exported from astro:content is deprecated in Astro 7. astro/zod is
// the exact zod build Astro validates with, so schemas can't drift from it.
import { z } from "astro/zod"
import { TAG_KEYS } from "./lib/tags"

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
 */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z
    .object({
      title: z.string().min(1).max(80),
      /** One or two sentences. Used for the card, the meta description and
       *  the social preview — so write it as standalone prose, not a teaser. */
      description: z.string().min(1).max(200),
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
