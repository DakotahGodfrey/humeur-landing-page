# humeur-landing

Landing page for [Humeur](https://humeur.dev) — a mood journal that tracks the morning and the evening separately.

Astro 7 · Tailwind 4 · TypeScript (strict) · static output.

```bash
corepack enable   # once, if you haven't
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # astro check && astro build
pnpm preview
```

Node 22.12 or newer. pnpm is pinned in `packageManager`, so corepack will fetch the right version — you don't need it installed globally.

`pnpm-workspace.yaml` exists only because pnpm 10+ reads its settings from there rather than `package.json`. It allows exactly one dependency to run a build script: esbuild, which fetches its platform binary and which Astro's build needs. Everything else stays blocked. Adding to that list should be a decision, not a reflex.

---

## What this is

A translation of the approved "Field" mockup — the clinical-instrument direction — into a real build. Twelve sections, one route.

The calendar, the day view and the printed summary are **not** decorative approximations. They were rebuilt from the product itself: the month view from a screenshot of `humeur.dev`, the day view from `components/CalendarViews/DayView.tsx`, and the export sheet field-for-field from a real `export.pdf`. If any of those change in the app, they should change here.

---

## Layout

```
src/
  content.config.ts          blog collection + schema
  content/posts/             markdown posts
  data/demo-history.json     one year of invented entries, committed as a fixture
  i18n/en-CA.ts              every word on the site
  i18n/index.ts              locale plumbing
  lib/moodScale.ts           the seven levels — mirrors the app's MOOD_SCALE
  lib/history.ts             fixture access, date helpers
  lib/calendar.ts            Sunday-first grids, statistics, formatting
  lib/posts.ts               published-post queries, draft filtering
  lib/tags.ts                the closed tag vocabulary
  lib/site.ts                outbound URLs, the ranges the illustrations cover
  components/                MoodCell, MonthCalendar, DayView, ExportSheet, …
  components/blog/           PostCard, TagList
  components/sections/       one file per landing section, in page order
  layouts/BaseLayout.astro
  layouts/PostLayout.astro
  pages/index.astro
  pages/blog/                index, [...slug], tags/[tag]
  styles/global.css          tokens, Tailwind theme, base layer, prose
```

---

## Things that will bite you

**The mood palette is load-bearing.** Seven colours running monotonically from L\* 5.0 to 90.0, verified against protanopia, deuteranopia and tritanopia at ΔE2000 ≥ 10.4 for every pair. That ordered lightness ramp is what makes a month grid readable without colour vision. Never reorder it, never substitute a prettier colour, and never apply opacity to a fill — fading a swatch moves it up the ramp into a different meaning. The scale is deliberately outside the theme flip: a Crisis day has to look identical in both modes.

**`--crisis` is reserved.** Crisis-helpline surfaces only. It is not an "urgent" accent for marketing moments. If it shows up anywhere else, the one surface where red means something loses its meaning.

**Crisis resources and export are never gated.** Not behind a sign-up, not behind a tier, not behind a CTA. Someone's mood history is a medical record about them, and leaving has to be as easy as arriving. This is a product rule, not a copy preference.

**Copy claims trace to real features.** A previous audit found the marketing describing three features that did not exist, one of which had also reached the legal documents. `src/i18n/en-CA.ts` carries the rules at the top. If you want to say something new, check it in the app first.

**No pronoun trust claims.** Not "I'd never look at your data" — that's a promise. "Humeur can't read your entries" is a fact about the software. Only the second kind ships.

**Don't say "verifiable"** of the encryption. The crypto module isn't open source yet. "Open your network tab and watch" is fair.

---

## The blog

Writing about mood tracking, at `/blog`. Posts are markdown in `src/content/posts/`, typed by the collection in `src/content.config.ts`.

```
---
title: Something specific and under 80 characters
description: One or two sentences. This is the card text, the meta description and the social preview, so write it as standalone prose.
pubDate: 2026-08-08
tags: [patterns, tracking]     # closed vocabulary — see src/lib/tags.ts
draft: false
---
```

**Drafts render in `pnpm dev` and are excluded from every build.** The placeholder post ships as a draft, which is why `pnpm build` produces an empty blog index — run `pnpm dev` to see the post, tag and prose layouts.

**Tags are a closed vocabulary.** An open `string[]` fragments within about a dozen posts — `appointment`, `appointments`, `Appointments` — and each variant spawns a near-empty page that looks like a broken site. Adding a tag is an edit to `src/lib/tags.ts`; a typo in frontmatter fails the build. Only tags with posts get routed, so there are no empty tag pages.

**Every post gets the disclaimer automatically.** It's rendered by `PostLayout`, not written per post. Writing about mood disorders for people who have one can read as clinical guidance whether or not it meant to, and the post most likely to need that line is the one written quickly. Don't move it into the posts themselves.

Prose styles are hand-written in `global.css` against the existing tokens rather than pulled from `@tailwindcss/typography` — the plugin would need re-theming against every token here to stop looking like a different site, which is more configuration than the forty lines it replaces. The measure is capped around 68 characters; long lines are harder to track back to the start of, which matters more than usual for these readers.

---

## Design tokens

Raw HSL channel triplets on `:root`, exactly as the app stores them, mapped onto Tailwind colours through `@theme inline`. That indirection is why there are almost no `dark:` variants here — flipping the custom properties re-themes the page, so `bg-surface` is correct in both modes.

Dark mode follows `prefers-color-scheme` and can be overridden by a `data-theme` attribute from the header toggle. The toggle stores nothing; the OS setting is the one most people have actually thought about.

Two token notes worth carrying back to the app:

- **`--muted-foreground` fails WCAG AA for body text.** `40 20% 48%` measures 3.28:1 on `--background` and 2.93:1 on `--accent-surface`. Large text only. This page adds `--muted-strong` (5.06:1 / 4.53:1) and uses it for anything under 24px. The app likely has the same gap.
- **Dark mode beyond `--background` and `--surface` is derived here**, including a dark `--crisis`, because `#AA0E0E` on `#181B27` is roughly 1:1 and simply unreadable. All derived values are contrast-checked. They belong in the real token file rather than being reinvented per surface.

---

## The day view shows the reader's own date

The app opens its day view on today, so the illustration does too — rendered at build time, then corrected on the client so it doesn't go stale a week after a deploy. The build value keeps the static output complete for anyone with JavaScript off.

What it shows is an **unsaved draft**: two halves picked, `Save day` not yet pressed. That's the state the real `DayView` holds, and it's also why a live date can't contradict the saved history the month grids are drawn from — nothing here has been saved.

Don't wire this to the demo fixture to "make it consistent". That reintroduces exactly the clash it avoids on any day the fixture happens to cover.

---

## Demo data

`src/data/demo-history.json` is one hand-authored year for a fictional person: a stable autumn, a decline through November, a December admission, recovery, a June collapse with a five-day admission, a July logging gap, a levelling August.

It is deliberately not a pleasant year. A month of Greats would misrepresent who this product is for.

Every figure on the page — coverage, the average, the mood mix, the admissions list — is computed from this one fixture at build time, so the numbers can never disagree with the grids. Change the fixture and the whole page follows.

---

## Open items

- **The export says "afternoon", the copy says "evening", the day view says "PM".** Three vocabularies for the same thing, all visible on the page at once. AM/PM in the day view is deliberate (untranslated, by brand direction). The export string is the odd one out and the cheapest to change.
- **`/privacy` and `/terms` don't exist yet.** The footer links to both. Legal review is the stated launch dependency — see the TODO in `src/lib/site.ts`.
- **The about section is placeholder copy.** See `src/i18n/en-CA.ts`.
- **Provider search uses device location and Geoapify**, a data flow the current privacy policy draft doesn't describe. Needs adding before publish.
- **i18n carries `en-CA` only.** The app uses `en`; if the two ever share a locale negotiator, one side has to move. Adding the other three locales is meant to be a data change — see `src/i18n/index.ts`.
- **The demo history is anchored to fixed 2026 dates.** The calendars will read as historical rather than current as time passes. If that starts to matter, the fix is to store the fixture as day offsets and rebase it at build time — the statistics are all derived, so only the month boundaries would shift.
- **Nothing here has been rendered in a browser yet.** It type-checks and builds; it has not been looked at. Worth opening at 360px first.
