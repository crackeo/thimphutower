# Thimphu Tower Hotel website (static Next.js)

A full redesign of thimphutower.com as a static Next.js site. It has no login, no backend and no database: `npm run build` produces a plain `out/` folder that any static host can serve.

## Preview

```bash
npm install
npm run dev                         # http://localhost:3000
npm run build && npx serve@14 out   # the real static output
```

`npm run images` regenerates the responsive WebP files after you add or replace a photo. It skips files that already exist, so delete the old `public/images/optimized/<key>-*.webp` files first.

## Structure

| Route | Content |
|---|---|
| `/` | Hero with 4 real views of the square and an enquiry bar; intro; room explorer and stay calculator; 3D "Explore the tower"; interactive square map; dining; experiences; guest quotes; photo mosaic; contact |
| `/rooms/` | 4 room cards (with photo morph into each room page), room explorer, in-room features, hotel facilities |
| `/rooms/[slug]/` | Photo gallery with thumbnails, rate, enquiry, features, illustrative plan, other rooms |
| `/the-building/` | Facade, the 3D tower stage, elevation, section and site plates, interiors |
| `/experiences/` | The 4 experiences, plus the square map |
| `/gallery/` | 46 photos, filter chips, full-screen viewer (arrows, swipe, filmstrip) |
| `/about/`, `/downloads/`, `/contact/` | Story and mission; the trek reports; details and the full enquiry form (the no-JavaScript fallback) |

Every "Enquire" button opens a 5-step drawer: Dates → Room → Guests → Details → Review. The last step opens the guest's email app with the enquiry filled in.

## What was kept, cleaned and removed

**Kept, word for word apart from typo fixes:** the hotel summary, the "since 2015" text, the about intro, vision and the three mission pillars, the dining text, all 19 facilities, every in-room and service feature, the 4 room types and prices, check-in and check-out times, the activity copy, both named testimonials, the contact details, the Facebook link and both PDFs. An automated check found all 74 of these facts in the built HTML.

**Added from the hotel's own material:**
- From the rate card in its gallery: taxes (10% BST + 10% service charge), the mobile number +975 17110988, the Tripadvisor link, and the women-led staff and reverse-osmosis water lines.
- 58 gallery photos and their captions (46 used).

**Cleaned:**
- "Private balcony" removed everywhere: the hotel confirmed (2026-11-03) that the building has no balconies, although the old site listed one in every room.
- Typos fixed: Dobule, Childern, Vission, Thimpu, "High Comet Toilet", "3 star star".
- Room descriptions rewritten, because each one named the wrong room type ("King Suite", "Double", "Deluxe Rooms").
- The "Pemako" copy, taken from another hotel's site, rewritten for this hotel.
- The two PDF labels were swapped on the old site (Group 1 opened Group 2). They now point to the right files.

**Removed:**
- Login, Register, "My Account" and the newsletter signup.
- The fake statistics counter (5000 / 1200 / 4100 / 750).
- The 4 placeholder "articles", which used stock photos of other places and linked to `#`.
- Generic avatar icons on testimonials.
- Dead social links, the broken `gallary.php` link, and the 4 hidden template rooms with "500/ Per Night" prices.
- The "Coming soon" virtual tour page.
- Gallery posts that weren't suitable: a rate flyer, rent/lease adverts, an Instagram screenshot, private birthday photos, a royal greeting card, and 5 duplicate photos.

## [TO CONFIRM] with the hotel

0a. **Personalised stamps.** The section reuses the hotel's own stamps image (travellers in snow, which isn't obviously Bhutan), with suggested photo spots. Swap in a real guest stamp photo when one comes in through "Share your stamp" (with permission). Also confirm how guests get their stamps: at Bhutan Post in Thimphu, the timing, and whether the front desk arranges it.
0. **Floors and the tax method.** Which room types are on which floor, and whether BST is charged on the rate alone or on the rate plus service charge (the calculator assumes the rate alone).
1. **Breakfast.** The room pages say buffet breakfast is included, but the gallery rate card says "meal costs not included". The site currently says breakfast is included.
2. **Room occupancy.** The old site's adults/children numbers looked like template values ("5 Adults" in a double), so they are left out. The site treats Single/Double as a single or double *rate*, matching the rate card.
3. **Room photos.** Only "The Premium category" has a caption tying it to a room. The other room-to-photo pairings follow the old site's choices and should be checked.
4. **Bed layouts in the floor plans** (double bed on single-rate pages, twin beds on double-rate pages) are illustrative guesses.
5. **WhatsApp** on +975 17110988: the number comes from the rate card; whether it takes WhatsApp is not confirmed.
6. **Photo rights.** The facade-and-pool photo (`main.jpg`) looks like the same shot as a gallery photo watermarked "@inside_bhutan". The watermarked copy is excluded, but check the rights for `main.jpg` too.
7. **"Personalised stamps" image.** The hotel's own card for it shows travellers in the snow, not stamps. Swap in a better photo if one exists.
8. **Distances** ("about 20 minutes" to Buddha Dordenma) were adapted from copy that measured from another hotel. They are plausible from Clock Tower Square but should be confirmed.
9. **Domain:** canonicals, the sitemap and Open Graph tags assume `https://thimphutower.com`. Change `hotel.siteUrl` in `content/site.ts` if that's wrong.
10. **Virtual tour:** there's none yet. `/360tour.php` temporarily redirects (302) to the gallery.

## Swapping in real photos and plans

- **Photos:** put the file in `public/images/original/`, add or edit its entry in `content/assets.json` (key, file, alt, category, caption), then run `npm run images`. Refer to the image anywhere by its key, e.g. `<Img k="my-key" />` or `rooms[].image` in `content/site.ts`.
- **Floor plans:** replace `<RoomPlan>` in `app/rooms/[slug]/page.tsx` with the real plan (an SVG or image) and remove the "Illustrative layout" label.
- **Elevation and section:** these are our own drawings traced from photos, in `components/architecture/`. If the architect's drawings are available, they can replace these.

## Switching the enquiry form to a form service

Every enquiry goes through one function, `sendEnquiry()` in `lib/enquiry.ts`. Today it opens the visitor's email app with a pre-filled message to thimphutowers@gmail.com. The page says plainly that nothing is sent until they press Send there, and it offers a copy-the-text fallback plus WhatsApp and phone.

To use Netlify Forms or Formspree, replace the body of that function with a `fetch()` POST and return `{ ok }`. The hero enquiry bar is a plain GET form to `/contact/`, so it works without JavaScript and pre-fills the full form.

## SEO

All page metadata goes through `pageMeta()` in `lib/seo.tsx`, so every page has a keyword title, a description of 160 characters or fewer, a canonical, `og:url` and a share image.

- **Structured data:**
  - Every page has `Hotel` (address, map coordinates, amenities, rooms, price range, check-in and check-out).
  - The home page adds `WebSite`.
  - Inner pages add `BreadcrumbList`, generated from the page breadcrumbs.
  - Room pages add an `Offer` in BTN.
- **Room share images:** `npm run images` writes 1200×630 JPEGs to `public/og/`.
- **Sitemap and 404:** the sitemap carries `lastmod`, and the 404 page has its own title and is `noindex`.
- **Off-site steps (need the hotel's accounts):**
  - Verify the domain in Google Search Console and submit `/sitemap.xml`.
  - Claim the Google Business Profile, and make its name, address and phone match the site exactly.
  - Ask guests for Google and Tripadvisor reviews. Reviews aren't marked up on the site, because self-published review markup is ignored by Google and they must not be invented.

## Redirects

`public/_redirects` (Netlify/Cloudflare Pages format, copied into `out/`) maps every old `.php` URL to its new route: `index`, `rooms`, the 4 room pages, `activite`, `about_us`, `gallery`, `gallary`, `contact` and `downloads`, plus `signin`/`signup` to the home page, and both old PDF paths. Other hosts need the same rules in their own format.

## Check results (redesign, 2026-11-01, on the built `out/` folder)

| Check | Result |
|---|---|
| `next build` (static export) | Passes |
| Internal links and assets | 107 checked, 0 broken |
| SEO basics | Every page has one h1, a description and a canonical; all images have alt text; titles are unique |
| Content completeness | 74/74 source facts present; no leftover typos, "Pemako" or login text |
| Horizontal overflow | 0px at 390, 768 and 1440 |
| Interactions (Playwright) | **27/27 pass**: hero scene switch; enquiry bar → drawer pre-fill (dates, 4 nights, room, 3 adults); details validation with focus on the first error; review total (Nu 28,800); honest send message; Escape closes; room explorer total (Nu 26,400); rate-card selection; pill hidden at top and end, shown mid-page; map pins and chips; 3D floor selection, controls and click-on-model picking; gallery filter, arrows, filmstrip and Escape; room thumbnails; contact pre-fill from the URL; mobile menu; skip link; focus ring; no console errors |
| impeccable detector | Only "broken image" false positives remain: the `Img` wrapper sets `src` itself, and the link check loads every image. The bounce easing it flagged was replaced. |

**Lighthouse mobile (simulated slow 4G), real numbers:**

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `/` | 82–89 (two runs) | 100 | 100 | 100 |
| `/rooms/` | 87 | 100 | 100 | 100 |
| `/rooms/premium-double/` | 95 | 100 | 100 | 100 |
| `/the-building/` | 85 | 100 | 100 | 100 |
| `/gallery/` | 85–87 | 100 (after a contrast fix) | 100 | 100 |
| `/contact/` | 90 | 100 | 100 | 100 |

**Not met:** the Performance target of ≥ 90 is met on two of six pages. LCP is 3–5 s on throttled mobile, from React hydration on long, interactive pages plus web fonts. The enquiry drawer and the 3D model already load lazily. Long cache headers on the real host would help.

Screenshots of Home, a room page and The Building at 390, 768 and 1440 are in `docs/screenshots/`.

## Design decisions

The full system is in `DESIGN.md`.

- **The direction was chosen by you** ("Quiet luxury, cinematic") and is treated as binding. `impeccable` craft rules applied: no eyebrow labels, one primary action, real states, and themed focus and selection.
- **Split hero instead of a full-bleed one.** The best photos are 960–1536px wide, so a full-width hero would look soft on large screens. A 56%-wide photo panel keeps them sharp.
- **Hero scenes use the hotel's own photos** of, or from, the square (festival, breakfast, dusk, snow), instead of an invented "day/night" effect.
- **3D floor panel stays honest.** Which room types are on which floor is unknown, so each floor shows what the facade drawing supports (window type, outlook) and links to all four rooms with "mention it when you enquire".
- **Stay calculator.** The estimate applies 10% BST and 10% service charge to the room rate, from the hotel's rate card, and is labelled an estimate.
- **Skills used:**
  - `impeccable`: craft floor and detector.
  - `ui-ux-pro-max`: font pairing (Cormorant + Jost, from its luxury pairings) and booking-form rules (progress indicator, labels, submit feedback).
  - `emil-design-eng` / `apple-design` principles: one easing curve, interruptible tweens, the drawer and step motion.
  - Playwright for verification.
- **What was removed:** the "stamp issue" look (stamps, postmarks, cornice band, paper texture, Bodoni) and the draw-on-scroll SVG animation that rendered blank.
