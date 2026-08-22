import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints"

/**
 * Notion blocks → an HTML string.
 *
 * The portfolio renders to React and carries a `styles.ts` lookup of utility
 * classes. This site has no React in the blog path, and its article styles
 * are already written as element rules under `.prose` in global.css — so the
 * output here is plain semantic HTML with no classes at all, and PostLayout's
 * existing `.prose` wrapper styles it. Anything this emits (p, h2–h4, ul, ol,
 * li, blockquote, pre, code, hr, img, figure, a, strong, em) has a rule there;
 * add the rule before adding a tag.
 *
 * Heading levels are shifted down one: the post title is the page's h1, so
 * Notion's heading_1 becomes h2. Notion has no h1-inside-body concept worth
 * preserving, and two h1s on a page is a real outline error, not a nitpick.
 */

/** Everything from Notion is untrusted text going into an HTML string. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** Notion rich text → HTML, honouring the inline annotations and links. */
export function renderRichText(runs: RichTextItemResponse[]): string {
  return runs
    .map((run) => {
      const { annotations, plain_text: text, href } = run

      let html = escapeHtml(text)

      if (annotations.code) html = `<code>${html}</code>`
      if (annotations.bold) html = `<strong>${html}</strong>`
      if (annotations.italic) html = `<em>${html}</em>`
      if (annotations.strikethrough) html = `<s>${html}</s>`
      if (annotations.underline) html = `<u>${html}</u>`

      if (href) {
        // Notion permits arbitrary hrefs. Anything that isn't plainly http(s)
        // or a mail/anchor target is dropped rather than emitted — a
        // `javascript:` URL pasted into a post is an XSS hole otherwise.
        const safe = /^(https?:|mailto:|#|\/)/i.test(href)
        html = safe
          ? `<a href="${escapeHtml(href)}"${
              href.startsWith("http") ? ' rel="noreferrer" target="_blank"' : ""
            }>${html}</a>`
          : html
      }

      return html
    })
    .join("")
}

type ListRun = { list: "ul" | "ol"; blocks: BlockObjectResponse[] }
type Item = BlockObjectResponse | ListRun

/** Notion returns list items as flat siblings; group consecutive ones. */
function groupLists(blocks: BlockObjectResponse[]): Item[] {
  const items: Item[] = []

  for (const block of blocks) {
    const list =
      block.type === "bulleted_list_item"
        ? "ul"
        : block.type === "numbered_list_item"
          ? "ol"
          : null

    if (!list) {
      items.push(block)
      continue
    }

    const previous = items.at(-1)
    if (previous && "list" in previous && previous.list === list) {
      previous.blocks.push(block)
    } else {
      items.push({ list, blocks: [block] })
    }
  }

  return items
}

/**
 * Turns a Notion file URL into one this site can serve.
 *
 * This is the sharpest difference from the portfolio, and it isn't a style
 * choice. Notion's block images are S3 URLs signed for about an hour. The
 * portfolio can hotlink them because its pages are ISR at revalidate = 600,
 * so the URL is refreshed before it expires. This site builds to static HTML,
 * which freezes whatever URL was current at build time — every image on the
 * blog would 403 an hour after deploy. So they are downloaded instead.
 */
export type ImageResolver = (
  url: string,
  blockId: string,
) => Promise<{ src: string; width: number; height: number } | null>

async function renderBlock(
  block: BlockObjectResponse,
  resolveImage: ImageResolver,
): Promise<string> {
  switch (block.type) {
    case "paragraph":
      // Notion uses empty paragraphs as spacing. `.prose > * + *` already
      // owns vertical rhythm, so they'd render as double gaps.
      return block.paragraph.rich_text.length === 0
        ? ""
        : `<p>${renderRichText(block.paragraph.rich_text)}</p>`

    case "heading_1":
      return `<h2>${renderRichText(block.heading_1.rich_text)}</h2>`

    case "heading_2":
      return `<h3>${renderRichText(block.heading_2.rich_text)}</h3>`

    case "heading_3":
      return `<h4>${renderRichText(block.heading_3.rich_text)}</h4>`

    case "quote":
      return `<blockquote>${renderRichText(block.quote.rich_text)}</blockquote>`

    case "code":
      return `<pre><code>${escapeHtml(
        block.code.rich_text.map((run) => run.plain_text).join(""),
      )}</code></pre>`

    case "divider":
      return "<hr />"

    case "image": {
      const source =
        block.image.type === "external" ? block.image.external.url : block.image.file.url
      const caption = block.image.caption.map((run) => run.plain_text).join("")

      const resolved = await resolveImage(source, block.id)
      if (!resolved) return ""

      // Width and height are always emitted: a blog post is mostly text and
      // an unsized image mid-article shifts everything below it on load.
      const img =
        `<img src="${escapeHtml(resolved.src)}" alt="${escapeHtml(caption)}"` +
        ` width="${resolved.width}" height="${resolved.height}" loading="lazy" decoding="async" />`

      return caption
        ? `<figure>${img}<figcaption>${escapeHtml(caption)}</figcaption></figure>`
        : `<figure>${img}</figure>`
    }

    default:
      // Unsupported block types are skipped rather than rendered raw. Callers
      // get told which ones, so an unstyled block type shows up as a build
      // warning instead of silently missing prose.
      return ""
  }
}

export type RenderResult = { html: string; skipped: string[] }

export async function renderBlocks(
  blocks: BlockObjectResponse[],
  resolveImage: ImageResolver,
): Promise<RenderResult> {
  const skipped = new Set<string>()
  const parts: string[] = []

  for (const item of groupLists(blocks)) {
    if ("list" in item) {
      const lis = item.blocks
        .map((block) =>
          block.type === "bulleted_list_item"
            ? `<li>${renderRichText(block.bulleted_list_item.rich_text)}</li>`
            : block.type === "numbered_list_item"
              ? `<li>${renderRichText(block.numbered_list_item.rich_text)}</li>`
              : "",
        )
        .join("")

      parts.push(`<${item.list}>${lis}</${item.list}>`)
      continue
    }

    const html = await renderBlock(item, resolveImage)
    if (html) parts.push(html)
    else if (!KNOWN_EMPTY.has(item.type)) skipped.add(item.type)
  }

  return { html: parts.join("\n"), skipped: [...skipped] }
}

/** Types that legitimately render to nothing, so they aren't reported. */
const KNOWN_EMPTY = new Set(["paragraph", "image"])
