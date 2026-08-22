# humeur-landing

Landing page for [Humeur](https://humeur.dev) — a mood journal that tracks the morning and the evening separately.

Astro 7 · Tailwind 4 · TypeScript (strict) · static output on Vercel.

```bash
corepack enable   # once, if you haven't
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # astro check && astro build
pnpm preview
```

Node 22.12 or newer. pnpm is pinned in `packageManager`, so corepack fetches the right version — you don't need it installed globally.

`pnpm-workspace.yaml` exists only because pnpm 10+ reads its settings from there rather than `package.json`. It allows exactly one dependency to run a build script: esbuild, which fetches its platform binary. Everything else stays blocked. Adding to that list should be a decision, not a reflex.

---

## Environment

The blog reads from Notion at build time. Without credentials the site still builds and renders — the notes section is simply empty and the build warns once. That is deliberate: the repo has to be cloneable and runnable by someone who doesn't have the token.

```bash
NOTION_TOKEN=            # internal integration secret
NOTION_DATABASE_ID=      # the "Humeur Blog" database
# NOTION_DATA_SOURCE_ID= # optional; skips one API call at build (see below)
```

Locally these go in `.env.local`, which is gitignored. **They must also be set in Vercel** — otherwise production quietly deploys an empty blog while local builds look fine. That is the single most likely way this breaks.

---

## What this is

One route, twelve sections, plus a Notion-backed blog at `/blog`.

The product illustrations are **real screenshots of the app**, not recreations. The page used to draw its own approximations in Astro components; they drifted several views behind the product, and the day view here had no structured fields at all for months after they shipped. A screenshot can't drift without somebody noticing.

Section order, which is not arbitrary:

| | | |
|---|---|---|
| — | Hero | one idea, and the year view under it |
| 01 | How it works | the habit is small — say so |
| 02 | The split | AM/PM, the wedge no competitor can copy without rebuilding their data model |
| 03 | The entry | the structured note fields |
| 04 | Patterns | four views; show, don't assert |
| 05 | Export | lead with the artifact, not the word "export" |
| 06 | Privacy | capability, then limit, then cost, in that order |
| 07 | Providers | completes the loop: track → see → find someone → hand them the page |
| 08 | Languages | |
| 09 | Pricing | |
| 10 | Crisis | calm and short; it reassures by existing |
| — | Final CTA | |

Two constraints on reordering: nothing may sit between a reader and the crisis resources, and export must never be introduced as something a plan buys you.

---

## Layout

```
src/
  content.config.ts          blog collection + schema
  i18n/en-CA.ts              every word on the site
  i18n/index.ts              locale plumbing
  assets/shots/              app screenshots, through the image pipeline
  lib/shots.ts               screenshot imports, one place
  lib/notion/                the blog's only contact with Notion
    client.ts                  SDK client, data-source resolution, config gate
    types.ts                   PostMeta, property-name map, locale aliases
    posts.ts                   queries
    render.ts                  blocks → HTML string
    images.ts                  downloads block images at build
    loader.ts                  the Astro content-layer loader
  lib/posts.ts               published-post queries, draft filtering
  lib/tags.ts                the closed tag vocabulary
  lib/site.ts                outbound URLs, the range the export sheet covers
  lib/moodScale.ts           the seven levels — mirrors the app's MOOD_SCALE
  lib/calendar.ts            grids, statistics, formatting
  lib/history.ts             fixture access, date helpers
  data/demo-history.json     one invented year, committed as a fixture
  components/Shot.astro      screenshot frame: theme pair, phone variant, scroll
  components/ExportSheet.astro   the printed provider summary, drawn in HTML
  components/sections/       one file per landing section, in page order
  components/blog/           PostCard, TagList
  layouts/                   BaseLayout, PostLayout
  pages/                     index, 404, blog/{index,[...slug],tags/[tag]}
  styles/global.css          tokens, Tailwind theme, base layer, prose
public/
  favicon.ico · favicon.svg · apple-touch-icon.png
  notion/                    downloaded post images (gitignored, build output)
```

`moodScale.ts`, `calendar.ts`, `history.ts` and `demo-history.json` now serve **only** `ExportSheet.astro`. They used to drive the whole page, back when the calendars were hand-drawn. The printed summary is still drawn in HTML rather than screenshotted, because paper doesn't invert with the theme and no export capture exists.

---

## The blog

Posts live in the **Humeur Blog** Notion database. `src/content/posts/` does not exist and shouldn't be recreated.

Everything downstream — `publishedPosts()`, the tag pages, `PostLayout`, `render(post)` — still goes through `getCollection("posts")`. The loader stores `rendered.html`, so `<Content />` works exactly as it did with Markdown.

**Property names** live in `NOTION_PROPERTIES` (`lib/notion/types.ts`). Rename a property in Notion, rename it there.

| Notion | | |
|---|---|---|
| Title | Title | |
| Slug | Text | URL segment, shared across translations |
| Summary | Text | card text, meta description, social preview |
| Locale | Select | `en` / `fr` — short codes, aliased to site locales |
| Published | Date | gates **and** sorts |
| Tags | Multi-select | must exist in `lib/tags.ts` |

**`Published` does double duty.** Empty means draft, a future date means scheduled, a past date both publishes the post and orders it. There is no separate checkbox to forget to tick. The API filter is just `is_not_empty`; the future-date cut happens in JS so "now" isn't baked into a cached query.

**Posts are fetched at build time.** Editing Notion does not change the live site — a scheduled post goes out on the next build after its date, not on its date. If that starts to matter, the fix is a Notion automation hitting a Vercel deploy hook, not a change to the loader.

**Drafts render in `pnpm dev` and are excluded from every build.**

**Bad rows warn and skip; they don't fail the build.** This is the opposite of the rule for the Markdown posts it replaces, and deliberately so. A broken `.md` is in the repo and fails in the pull request that introduced it. A Notion row is edited by a person outside this repo who has no way to see a build log, and a half-written row shouldn't take down the next deploy of something unrelated. Notion being configured but *unreachable* still throws.

**Tags are a closed vocabulary.** An open `string[]` fragments within a dozen posts — `appointment`, `appointments`, `Appointments` — and each variant spawns a near-empty page that looks broken. Adding a tag is an edit to `lib/tags.ts`. A tag that exists in Notion but not there is dropped with a warning; a post left with no valid tags is held back.

**Every post gets the medical disclaimer automatically**, rendered by `PostLayout` rather than written per post. Writing about mood disorders for people who have one can read as clinical guidance whether or not it meant to, and the post most likely to need that line is the one written quickly. Don't move it into the posts.

### The API version will trip you up

Pinned to Notion API **`2025-09-03`**. In that version a database contains one or more *data sources*, and queries run against `notion.dataSources.query({ data_source_id })` — **not** `databases.query`. `client.ts` resolves `NOTION_DATABASE_ID` to its first data source once per process; setting `NOTION_DATA_SOURCE_ID` skips that hop.

Do not "fix" this back to the older shape from memory. It fails as a permissions error, not a version error, so the error message points you somewhere unhelpful.

### Post images are downloaded, not hotlinked

Notion's file URLs are signed S3 links that expire in about an hour. A static build freezes whatever URL was current at build time, so hotlinking means every image on the blog 403s an hour after deploy.

`images.ts` fetches each one at build, converts to webp, and writes it to `public/notion/`. Filenames hash the URL **path**, not the whole URL — the query string carries the signature and changes on every request, so hashing the full URL would miss the cache on every build.

---

## Things that will bite you

**The mood palette is load-bearing.** Seven colours running monotonically from L\* 5.0 to 90.0, verified against protanopia, deuteranopia and tritanopia at ΔE2000 ≥ 10.4 for every pair. That ordered lightness ramp is what makes a month grid readable without colour vision. Never reorder it, never substitute a prettier colour, and never apply opacity to a fill — fading a swatch moves it up the ramp into a different meaning. The scale sits outside the theme flip: a Crisis day has to look identical in both modes.

**`--crisis` is reserved.** Crisis-helpline surfaces only. It is not an "urgent" accent for marketing moments. If it appears anywhere else, the one surface where red means something loses its meaning.

**Crisis resources and export are never gated.** Not behind a sign-up, not behind a tier, not behind a CTA. Someone's mood history is a medical record about them, and leaving has to be as easy as arriving. This is a product rule, not a copy preference.

**Copy claims trace to real features.** A previous audit found the marketing describing three features that did not exist, one of which had also reached the legal documents. `i18n/en-CA.ts` carries the rules at the top. If you want to say something new, check it in the app first — and note the trap runs both ways: the published post about provider search now *understates* it, having been written while the feature was still alpha.

**No pronoun trust claims.** Not "I'd never look at your data" — that's a promise. "Humeur can't read your entries" is a fact about the software. Only the second kind ships.

**Don't say "verifiable"** of the encryption. The crypto module isn't open source yet. "Open your network tab and watch" is fair.

---

## Design tokens

Raw HSL channel triplets on `:root`, exactly as the app stores them, mapped onto Tailwind colours through `@theme inline`. That indirection is why there are almost no `dark:` variants here — flipping the custom properties re-themes the page, so `bg-surface` is correct in both modes.

**The palette is the app's, value for value** — light "Pearled Ivory" (hue 30–32, anchored on PANTONE 11-0907 TCX, which is `--band` exactly) and the cooler navy dark set. If a value here disagrees with `app/globals.css`, the app wins; this is the copy. Every ratio was re-measured rather than trusted:

| | light | dark |
|---|---|---|
| `--foreground` on `--background` | 12.60:1 | 14.95:1 |
| `--muted-foreground` on `--background` | 5.85:1 | 5.77:1 |
| `--on-accent` on `--accent` | 5.70:1 | 6.87:1 |
| `--accent` on `--surface` | 5.70:1 | 6.87:1 |

Two site-only tokens: `--on-accent` (the app has nothing that fills with the accent and puts type on it; the primary button here does, and it points the opposite way in each theme) and the crisis card's `--crisis-surface` / `--crisis-border`.

Dark mode follows `prefers-color-scheme` and can be overridden by a `data-theme` attribute from the header toggle. The toggle stores nothing; the OS setting is the one most people have actually thought about. **Anything that swaps on theme must handle both cases** — `Shot.astro` and `ThemeToggle.astro` share the same three-rule structure, and a swap keyed on only one of them is wrong half the time.

---

## Screenshots

`src/assets/shots/` holds captures from the app, named `<view>-<theme>-<palette>`. Every one is `spring`, the app's default seasonal accent; recapturing for another palette means replacing files, not editing sections.

`Shot.astro` handles three axes on separate elements, because two of them would otherwise fight over `display`:

- **theme** — `light` required, `dark` optional, swapped on the *effective* theme
- **width** — `mobile` optional; below 40rem the phone capture shows instead, because a 2880px capture scaled into a 330px column is a smear
- **overflow** — with no phone capture, the frame scrolls sideways rather than shrinking past reading

Only `year` and `month` have both themes captured. A light-only shot renders as-is on the dark page rather than being tinted or dimmed to fit — the mood scale is calibrated, and a filter over a screenshot of it would misrepresent the one thing on the page that has to be exact.

The cost: every variant is in the markup, so a browser fetches some it won't display — about 88KB of phone captures on a desktop visit. `<picture media>` would fetch exactly one, but its media queries only read the OS setting and can't follow the theme button, and a toggle that doesn't change the screenshots is worse than the bytes.

One gotcha when swapping captures: **dev-server image URLs are keyed on the source path, not its contents.** Replace a file and the browser will keep serving the old bytes until you hard-reload. Production filenames are content-hashed, so this only affects local checking.

---

## Open items

- **`/privacy` and `/terms` don't exist.** The footer links to both. Legal review is the stated launch dependency — see the TODO in `lib/site.ts`. Two 404s at launch if this is missed.
- **"Meet Your Humeur" has no Summary.** It publishes, but with no card text, no meta description and no social preview, and warns on every build.
- **The published post is stale on provider search**, describing it as alpha and hospital-only. It shipped the full type filter on 21 Aug 2026.
- **Dark `--border-strong` is 1.67:1** on the background, so ghost-button outlines are faint in dark mode. Inherited from the app's tokens, not introduced here — fixing it means changing the app.
- **The export says "afternoon", the copy says "evening", the day view says "PM".** Three vocabularies for one thing, all visible at once. AM/PM is deliberate; the export string is the odd one out and the cheapest to change.
- **`t.about` exists in the dictionary but nothing renders it.** Either write the section or drop the key.
- **No dark captures** for the day, week or crisis views, and the only phone capture of a month is the dark one.
- **i18n carries `en-CA` only.** The app routes four locales (`en`, `fr-ca`, `es-mx`, `de`). Adding the rest here is meant to be a data change — see `i18n/index.ts`. The Notion loader already understands the locale aliases and the fallback rule.
- **The demo fixture is anchored to fixed 2026 dates.** Only the export sheet still reads it, so this ages more slowly than it used to, but it will read as historical eventually.
