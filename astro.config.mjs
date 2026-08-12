// @ts-check
import { defineConfig, fontProviders } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import vercel from "@astrojs/vercel"
/**
 * Humeur landing page.
 *
 * i18n is configured with en-CA as the only locale for now. The copy is
 * already written in Canadian spelling ("colour", "counsellor"), so this is
 * the honest tag rather than a bare `en`.
 *
 * Adding fr-CA, es-MX and de later is a data change — add the tag here, add a
 * dictionary in src/i18n/ui.ts, and add src/pages/[locale]/index.astro. With
 * prefixDefaultLocale false, en-CA keeps serving from `/` and the others get
 * `/fr-ca/`, `/es-mx/`, `/de/`.
 *
 * Note the app itself uses `en` (see i18n/routing.ts). If these two ever need
 * to share a locale negotiator, one side has to move — flagged, not decided.
 */
export default defineConfig({
  site: "https://humeur.dev",
  output: "static",
  i18n: {
    defaultLocale: "en-CA",
    locales: ["en-CA"],
    routing: {
      // en-CA serves from `/` unprefixed; the other three will get
      // `/fr-ca/`, `/es-mx/`, `/de/` when they land.
      prefixDefaultLocale: false,
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-humeur-ui",
      weights: [400, 500, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "IBM Plex Serif",
      cssVariable: "--font-humeur-display",
      weights: [400, 500, 600],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "serif"],
    },
    {
      provider: fontProviders.google(),
      name: "IBM Plex Mono",
      cssVariable: "--font-humeur-mono",
      weights: [400, 500, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
  build: {
    // One stylesheet rather than per-page <style> blocks: the whole site is
    // one document, and an inlined-per-component split would ship the tokens
    // more than once.
    inlineStylesheets: "auto",
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
})
