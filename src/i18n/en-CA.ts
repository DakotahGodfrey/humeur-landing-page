/**
 * Landing copy, en-CA.
 *
 * This is the source of truth for the words on the page. It has been through
 * a claim audit: every sentence traces to something that exists in the
 * product. Three rules, in order of how much trouble breaking them causes:
 *
 *   1. No invented claims. A previous audit found the marketing describing
 *      three features that did not exist, one of which had also reached the
 *      legal documents. If you want to say something new, check it first.
 *   2. Crisis resources and export are never gated — not in copy, not in
 *      layout, not behind a tier or a sign-up.
 *   3. No pronoun trust claims. Not "I'd never look at your data". Capability
 *      claims only: "Humeur can't read your entries." The first is a promise,
 *      the second is a fact about the software.
 *
 * Also: don't say "verifiable" of the encryption — the crypto module isn't
 * open source yet. "Open your network tab and watch" is fair.
 *
 * The body speaks in a neutral product voice. First person is reserved for
 * the about section, because it is one person's project and "we" would be a
 * lie in a product whose whole argument is that it doesn't lie.
 */

export default {
  meta: {
    title: "Humeur — One day is a data point. Ninety days is a pattern.",
    description:
      "A mood journal that tracks the morning and the evening separately, in four views, with a printable summary for your doctor. Encrypted on your device. Free with no account.",
  },

  nav: {
    skip: "Skip to content",
    primary: "Primary",
    footer: "Footer",
    // Root-relative, not bare fragments. The header renders on every route,
    // and "#split" from /blog/ scrolls to nothing.
    items: [
      { href: "/#split", label: "The split" },
      { href: "/#patterns", label: "Patterns" },
      { href: "/#export", label: "Export" },
      { href: "/#privacy", label: "Privacy" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/blog/", label: "Notes" },
    ],
    start: "Start tracking",
  },

  theme: {
    toDark: "Switch to dark mode",
    toLight: "Switch to light mode",
    dark: "Dark",
    light: "Light",
  },

  hero: {
    eyebrow: "Mood journal · Early access",
    headline: "One day is a data point. Ninety days is a pattern.",
    sub: "Ninety days of mornings and evenings, printed on one page for your next appointment.",
    primaryCta: "Start tracking",
    secondaryCta: "See how it works",
    note: "No account needed. Works on your device, free, for as long as you want.",
    panelLabel: "Month view",
    readout: {
      coverage: "Coverage",
      logged: "Days logged",
      average: "Average mood",
      range: "Range",
    },
  },

  how: {
    section: "How it works",
    heading: "One entry. A growing picture.",
    lead: "Pick a colour for the morning, the evening, or the whole day. Notes are optional — sleep, meds, what happened. That's the habit; everything else is what it becomes over time.",
    specs: [
      {
        key: "Track",
        title: "One entry, ten seconds",
        body: "Seven levels, Crisis through Great. A note when you want one. A hospital admission when there's one to note.",
      },
      {
        key: "See",
        title: "Four views",
        body: "Day, week, month, year. Patterns show up at a distance that are invisible up close.",
      },
      {
        key: "Share",
        title: "Built for the appointment",
        body: "Bring a record instead of trying to reconstruct six weeks from memory in a fifteen-minute visit.",
      },
    ],
  },

  split: {
    section: "The split",
    heading: "A day has two halves.",
    lead: "When both match, one tap. When they don't, the calendar keeps both.",
  },

  patterns: {
    section: "Patterns",
    heading: "A month says more than any single day.",
    lead: "Seven colours, ordered light to dark. The year view fits twelve months on one screen.",
    panelLabel: "Month view",
    caption:
      "Days you didn't log stay empty rather than being filled in as neutral. A gap is information too.",
  },

  exportSection: {
    section: "Export",
    heading: "Your record, in a form your doctor can read.",
    lead: "Month grids, the mood scale, your figures, and any hospital admissions listed plainly.",
    notes:
      "Notes stay out unless you choose to include them, and you can decide note by note. The printed page says how many you withheld. Never which.",
    // Never soften this into a tier benefit. Export is how someone leaves,
    // and a mood history is a medical record about the person holding it.
    free: "Free on every plan, including if you cancel.",
    files: ["Provider summary · print or PDF", "JSON", "CSV"],
    filesNote:
      "Data files always contain your full history, whatever range is on screen.",
    caption:
      "Both pages of the printed summary, shown as one: month grids, the mood scale, the figures and the admissions list.",
    pull: "A mood history is a medical record about you. It's never behind a paywall.",
  },

  privacy: {
    section: "Privacy",
    heading: "Humeur can't read your entries.",
    // Capability, then limit, then cost, in that order. The limit and the cost
    // are what make the capability believable — they can't be cut for brevity.
    rows: [
      {
        key: "Capability",
        sub: "What it does",
        body: "Your entries are encrypted on your device before they're sent anywhere. What reaches the server is unreadable — not by policy, but because the decryption key never leaves your device. Your password doesn't either.",
        aside:
          "Open your browser's network tab and watch an entry save if you'd like to see for yourself.",
      },
      {
        key: "Getting back in",
        sub: "Recovery",
        body: "You get a recovery code at signup — the one way back in if you forget your password. On a device you trust, you can stay unlocked for 30 days instead of entering your password every visit. That's opt-in, and only ever your choice.",
      },
      {
        key: "The limit",
        sub: "Still visible",
        body: "What's still visible on the server: that your account exists, and which dates you have entries on. Not what's in them.",
      },
      {
        key: "The cost",
        sub: "The trade",
        body: "The trade: if you lose your password and your recovery code, nobody can recover your entries. Including me.",
        tone: "cost",
      },
    ],
  },

  providers: {
    section: "Providers",
    heading: "And if you don't have a provider yet.",
    lead: "Humeur can find psychologists, psychiatrists, therapists, counsellors, clinics and hospitals near you — filtered by the kind of help you're looking for and how far you can travel.",
    panelLabel: "Provider search",
    resultCount: "4 results",
    filtersLabel: "Example filters",
    resultsLabel: "Example results",
    filters: [
      { label: "Psychiatrist", on: true },
      { label: "Psychologist", on: false },
      { label: "Therapist", on: false },
      { label: "Counsellor", on: false },
      { label: "Clinic", on: false },
      { label: "Hospital", on: false },
      { label: "10 km", on: true },
    ],
    // Illustrative results. Deliberately plain: no ratings, no availability,
    // no "accepting referrals" — the search returns places, and inventing a
    // field the data source doesn't have is exactly the failure mode above.
    results: [
      { distance: "1.2 km", name: "Riverside Psychiatry", type: "Psychiatrist" },
      { distance: "2.8 km", name: "Dr. A. Mercier", type: "Psychiatrist" },
      { distance: "4.6 km", name: "Northbank Mental Health Clinic", type: "Clinic · Psychiatry, psychology" },
      { distance: "7.1 km", name: "St. Elias Hospital — Outpatient", type: "Hospital" },
    ],
    close: "Tracking, a pattern, someone to show it to, and a page to hand them. That's the whole loop.",
  },

  languages: {
    section: "Languages",
    heading: "Currently available in 4 languages.",
    lead: "Every screen is translated, and the translations are parity-tested — so nothing drops back to English part-way through a flow.",
    list: [
      { name: "English", code: "EN" },
      { name: "Français", code: "FR · Canada" },
      { name: "Español", code: "ES · México" },
      { name: "Deutsch", code: "DE" },
    ],
  },

  pricing: {
    section: "Pricing",
    heading: "Free on your device. A dollar a month to sync.",
    free: {
      name: "On this device",
      meta: "No account",
      price: "Free",
      priceNote: " · forever",
      points: [
        "Every feature. Every view.",
        "Export, printed and as data.",
        "Crisis resources.",
        "No account, no time limit, no catch.",
      ],
      cta: "Start without an account",
    },
    synced: {
      name: "Synced",
      meta: "Across devices",
      price: "$12",
      priceNote: " /year · or $1/month",
      points: [
        "Everything on this device, plus:",
        "Your history across your devices.",
        "Backed up, and there if your phone isn't.",
        "Paying more is an option — it covers someone who can't.",
      ],
      cta: "Start tracking",
    },
    note: "If you never want an account, you never need one.",
    pull: "The usual business model for a free mental-health app is the data. A dollar a month is the reason Humeur doesn't need yours.",
  },

  about: {
    section: "About",
    heading: "Why I built this",
    // Placeholder. Dakotah to write — the only place first person appears.
    paragraphs: [
      "[Placeholder — Dakotah to write. Two short paragraphs: why mood charting, and what one-person development means here.]",
      "[Placeholder — the paragraph that answers “solo project” with decisions rather than reassurance.]",
    ],
    signature: "— Dakotah",
  },

  crisis: {
    section: "Crisis support",
    heading: "Support is one tap away, always.",
    body: "Crisis lines for the United States, Canada, the United Kingdom, Ireland, Germany, Australia, and New Zealand — with a worldwide directory for everywhere else, and your local emergency number alongside. Free on every plan, never gated, never behind a sign-up.",
    body2:
      "Humeur is not a crisis service and nobody monitors your entries. When you log a Crisis-level day, it offers the resources rather than interrupting you.",
    regions: [
      "United States", "Canada", "United Kingdom", "Ireland",
      "Germany", "Australia", "New Zealand", "Worldwide",
    ],
    cta: "Open crisis resources",
  },

  finalCta: {
    heading: "Start today. See a pattern in a month.",
    sub: "No account needed to begin.",
    cta: "Start tracking",
  },

  footer: {
    tagline: "A mood journal, not a diagnosis.",
    links: [
      { href: "/blog/", label: "Notes" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "https://humeur.dev/crisis", label: "Crisis resources" },
      { href: "https://humeur.dev/sign-in", label: "Sign in" },
    ],
    // Never bury this, and never drop the monitoring sentence.
    fine: "Humeur supports self-reflection and conversations with healthcare providers. It does not provide medical advice, diagnosis, or treatment. Nobody monitors your entries. If you're in crisis, contact your local emergency number or a crisis line in your region.",
  },

  dayView: {
    // Labels come from the app's own en messages so the mockup can't drift
    // from the product. AM/PM stay untranslated by brand direction.
    scaleLabel: "Day",
    split: "Split AM / PM",
    am: "AM",
    pm: "PM",
    admission: "Hospital admission",
    notes: "Notes",
    keepPrivate: "Keep this note private",
    save: "Save day",
    clear: "Clear day",
    // Illustrative. Ordinary and specific rather than dramatic — the note
    // field is mostly used for the small practical things that turn out to
    // matter six weeks later.
    sampleNote:
      "Slept through the alarm but got to work. Fine until the call at four. Went to bed at eight.",
  },

  legend: {
    nothing: "Nothing recorded",
    admission: "Hospital admission",
  },

  blog: {
    title: "Notes — Humeur",
    description:
      "Writing about mood tracking: what to record, how to read a month of it, and what to bring to an appointment.",
    heading: "Notes",
    lead: "Writing about mood tracking — the habit, reading your own patterns, and what's worth bringing to an appointment.",
    eyebrow: "Notes",
    backToBlog: "All notes",
    empty: "Nothing published yet.",
    draftBadge: "Draft",
    published: "Published",
    updated: "Updated",
    tagsLabel: "Tags",
    filedUnder: "Filed under",
    tagHeadingPrefix: "Notes on",
    readingOn: "More on this",
    // Appended to every post automatically rather than left to the author.
    // A post about mood disorders can read as clinical guidance whether or
    // not it meant to, and the one that most needs this line is the one
    // written in a hurry.
    disclaimerHeading: "About this writing",
    disclaimer:
      "This is one person's writing about mood tracking, not medical advice, diagnosis, or treatment. It isn't a substitute for talking to a healthcare provider, and nothing here is tailored to your situation. If you're in crisis, contact your local emergency number or a crisis line in your region.",
    crisisCta: "Crisis resources",
  },

  sheet: {
    title: "Humeur mood journal",
    covering: "Covering",
    to: "to",
    generated: "Generated 8/8/2026",
    scale: "Mood scale",
    // Reproduced from the real export. Note it says "afternoon" while the
    // rest of the page says "evening" and the day view says PM — three
    // vocabularies for the same thing. Flagged; one side needs to move.
    keyAdmission: "hospital admission",
    keySplit: "Morning / afternoon differed",
    summary: "Summary",
    daysInPeriod: "Days in period",
    daysLogged: "Days logged",
    notLogged: "Not logged",
    averageMood: "Average mood",
    lowest: "Lowest recorded",
    highest: "Highest recorded",
    mix: "Mood mix",
    entries: "recorded entries",
    admissions: "Hospital admissions",
    fine: "Self-recorded mood journal. Not a clinical assessment.",
  },
} as const
