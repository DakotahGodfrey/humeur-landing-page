import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import sharp from "sharp"

import type { ImageResolver } from "./render"

/**
 * Downloads Notion block images into public/ at build time.
 *
 * Why this exists at all is in render.ts: Notion's file URLs are signed and
 * expire in about an hour, and a static build freezes them into the HTML.
 *
 * Two details worth keeping:
 *
 *   The filename is a hash of the URL's *path*, not the whole URL. The query
 *   string carries the signature and changes on every single request, so
 *   hashing the full URL would write a new file on every build and never hit
 *   the cache. The path is stable for the life of the upload.
 *
 *   Files already on disk are not re-downloaded. Notion is an external
 *   service in the build's critical path; the fewer requests a rebuild makes,
 *   the fewer ways a deploy fails for reasons that have nothing to do with
 *   the change being deployed.
 */

const OUT_DIR = path.join(process.cwd(), "public", "notion")
/** Matches the .prose measure (38rem) at 2x, with headroom for wide screens. */
const MAX_WIDTH = 1600

function keyFor(url: string): string {
  let stable = url
  try {
    const parsed = new URL(url)
    stable = parsed.origin + parsed.pathname
  } catch {
    // Not a URL we can parse; hash it whole rather than throwing.
  }
  return createHash("sha256").update(stable).digest("hex").slice(0, 16)
}

export function createImageResolver(
  log: (message: string) => void = () => {},
): ImageResolver {
  return async (url, blockId) => {
    const name = `${keyFor(url)}.webp`
    const file = path.join(OUT_DIR, name)
    const src = `/notion/${name}`

    // Already downloaded by an earlier build — reuse it, but still read the
    // dimensions, because the markup needs them on every render.
    try {
      const existing = await readFile(file)
      const meta = await sharp(existing).metadata()
      if (meta.width && meta.height) return { src, width: meta.width, height: meta.height }
    } catch {
      // Not cached yet. Fall through and fetch.
    }

    try {
      const response = await fetch(url)
      if (!response.ok) {
        log(`image ${blockId}: HTTP ${response.status} — block skipped`)
        return null
      }

      const input = Buffer.from(await response.arrayBuffer())
      const converted = await sharp(input)
        .rotate() // Honour EXIF orientation before dropping the metadata.
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true })

      await mkdir(OUT_DIR, { recursive: true })
      await writeFile(file, converted.data)

      return { src, width: converted.info.width, height: converted.info.height }
    } catch (error) {
      // A failed image must not fail the deploy. The block is dropped and the
      // reason is reported; everything else about the post still publishes.
      log(`image ${blockId}: ${(error as Error).message} — block skipped`)
      return null
    }
  }
}
