import { Client } from "@notionhq/client"

/**
 * Notion API version 2025-09-03 splits databases into one or more *data
 * sources*, and queries run against a data source rather than the database.
 * Set `NOTION_DATA_SOURCE_ID` directly, or set `NOTION_DATABASE_ID` and let
 * this module resolve the database's first data source once per process.
 *
 * DO NOT "fix" this back to `databases.query` — that is the pre-2025-09-03
 * shape, it is not what this pinned client speaks, and the failure looks like
 * a permissions error rather than a version error.
 *
 * Ported from the portfolio's src/lib/notion. Kept deliberately close to it,
 * including file names and function names, so a change in one is easy to
 * carry to the other. What differs is noted where it differs.
 */

/**
 * Astro reads .env files through Vite, which populates `import.meta.env` —
 * not `process.env`. On Vercel the opposite is true: the dashboard's
 * variables arrive in `process.env` and there is no .env file at all. A
 * loader has to run in both, so it checks both.
 *
 * (This is the one place the port needed to diverge structurally. The
 * portfolio reads `process.env` directly, which is correct for Next.)
 */
function env(name: string): string | undefined {
  const fromVite = (import.meta.env as Record<string, string | undefined>)[name]
  return fromVite ?? process.env[name]
}

let client: Client | null = null

export function getNotionClient(): Client | null {
  const auth = env("NOTION_TOKEN")
  if (!auth) return null

  client ??= new Client({ auth, notionVersion: "2025-09-03" })
  return client
}

/** True when the blog is wired up; used to degrade gracefully before then. */
export function isNotionConfigured(): boolean {
  return Boolean(
    env("NOTION_TOKEN") && (env("NOTION_DATA_SOURCE_ID") || env("NOTION_DATABASE_ID")),
  )
}

let dataSourceId: string | null = null

export async function getDataSourceId(): Promise<string | null> {
  if (dataSourceId) return dataSourceId

  const explicit = env("NOTION_DATA_SOURCE_ID")
  if (explicit) {
    dataSourceId = explicit
    return dataSourceId
  }

  const databaseId = env("NOTION_DATABASE_ID")
  const notion = getNotionClient()
  if (!databaseId || !notion) return null

  const database = await notion.databases.retrieve({ database_id: databaseId })

  // The response is a union; only the full object carries `data_sources`.
  if (!("data_sources" in database)) return null

  const first = database.data_sources[0]
  if (!first) return null

  dataSourceId = first.id
  return dataSourceId
}
