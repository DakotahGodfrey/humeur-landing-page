/**
 * The product screenshots, in one place.
 *
 * Captures live in src/assets so they go through the build's image pipeline
 * (webp, width ladder, intrinsic dimensions baked into the tag) rather than
 * being served raw from public/ as 250KB PNGs with no size attributes.
 *
 * Naming: <view>-<theme>-<palette>. The palette is the app's seasonal accent
 * — every capture here is `spring`, which is what the app ships as default.
 * Recapturing for a new palette means replacing files, not editing sections.
 *
 * Alt text is copy and lives in the dictionary (t.shots.*), not here.
 */

/**
 * Cropped from the full crisis-support capture to the drawer itself. The
 * uncropped frame is 85% year calendar, which put a second copy of the hero
 * image under a heading about crisis lines and buried the thing the section
 * is about in a strip along the bottom. Recrop from the original if the
 * drawer changes; the source capture is in the promo folder.
 */
import crisisLight from "@/assets/shots/crisis-panel-light-spring.png"
import dayLight from "@/assets/shots/day-light-spring.png"
import monthDark from "@/assets/shots/month-june-dark-spring.png"
import monthLight from "@/assets/shots/month-june-light-spring.png"
import weekLight from "@/assets/shots/week-light-spring.png"
import yearDark from "@/assets/shots/year-dark-spring.png"
import yearLight from "@/assets/shots/year-light-spring.png"

import mobileDayLight from "@/assets/shots/mobile-day-light-spring.png"
import mobileMonthDark from "@/assets/shots/mobile-month-dark-spring.png"
import mobileYearLight from "@/assets/shots/mobile-year-light-spring.png"

/**
 * Only `year` and `month` have both themes captured. The rest render light in
 * both modes — see the note in Shot.astro on why they aren't filtered to
 * match. Capturing dark for `day`, `week` and `crisis` is the open item.
 */
export const shots = {
  year: { light: yearLight, dark: yearDark },
  month: { light: monthLight, dark: monthDark },
  week: { light: weekLight },
  day: { light: dayLight },
  crisis: { light: crisisLight },

  mobileDay: { light: mobileDayLight },
  mobileMonth: { light: mobileMonthDark },
  mobileYear: { light: mobileYearLight },
} as const
