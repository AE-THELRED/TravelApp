# Handoff: Roamance — vibe-first travel booking app

## Overview
Roamance combines mood-board discovery (Pinterest), destination/hotel comparison (Trivago), and end-to-end booking (Expedia) into one flow, framed with a lighthearted dating-app metaphor (pick "Your Type," get "Matches," "Make it Official" to book). Users pick aesthetic vibe boards, swipe photos to refine a weighted taste profile, browse destinations scored by % match against that profile, then book a hotel, activities, and a flight as one bundled trip.

## About the Design Files
The files in this bundle (`Likeness.dc.html`, `modernist.css`) are **design references built as an interactive HTML/React prototype** — they demonstrate intended layout, copy, states, and logic, not production code to paste into a real app. The task is to **recreate this design in the target codebase's actual environment** (React/Next.js, native mobile, etc. — whatever the project uses, or the most appropriate stack if none exists yet), using that codebase's own component library, state management, and data layer. Treat `Likeness.dc.html` as the single source of truth for copy, layout, scoring logic, and interaction rules.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interaction states are final-intent. Recreate pixel-close using the target codebase's own styling system (Tailwind, CSS-in-JS, native styles, etc.) rather than copying inline styles verbatim.

## Screens / Views

### 1. Your Type (vibe board picker) — `screen: 'vibe'`
- **Purpose**: user selects one or more aesthetic "vibe boards" (e.g. "Sun-Bleached Coastal," "Alpine Quiet") that seed their taste profile.
- **Layout**: header (brand + tagline + trip summary), a 5-tab step nav, then a hero (H1 + supporting paragraph) over a responsive grid of board cards (`auto-fill, minmax(270px,1fr)`, `gap: var(--space-4)`).
- **Board card**: rounded card (`border-radius: 26px`, `overflow:hidden`, `box-shadow: var(--shadow-sm)`, hover lifts + `shadow-md`), striped placeholder photo (180px tall) with a caption chip bottom-left naming the intended photo; title, one-line note, up to 3 tag chips; selected state shows a top accent bar + "IN PROFILE" tag.
- **CTA**: primary button "Find Your Type →" (disabled state copy: "Pick at least one board"), a hint line showing board count + signal count.

### 2. Find Your Type (swipe refine) — `screen: 'swipe'`
- **Purpose**: user swipes yes/no on 8 individual photos to refine/weight the vibe profile.
- **Layout**: 2-column — left column shows one photo card at a time (340px photo + label + tags), with "Not My Type" / "Crush ♡" buttons below, plus a "Skip to matches" link; right column is a persistent "Your vibe profile" sidebar listing weighted tags as horizontal bar meters (bar width = normalized weight).
- **End state**: once all 8 are swiped, shows a summary card ("Your type, decided.") with the top 3 signals and a "See your matches" CTA.
- **Scoring**: board picks weight +2 per tag; swipe-yes +1.5; swipe-no −1 (per tag on that photo).

### 3. Your Matches (destination results) — `screen: 'matches'`
- **Purpose**: ranked destination results filtered/sorted against the vibe profile.
- **Layout**: 300px left filter rail + result grid.
- **Filter rail**: budget-ceiling range slider ($900–$5,200), max-flight-time range slider (3–20h), month `<select>`, a 3-option sort list (Vibe match / Package price / Flight time) styled as a segmented list, active board chips, "Edit vibe" link back to screen 1.
- **Result card**: photo with a circular "% match" badge (top-right, pill, accent-filled) and an optional "PRICE DROP N%" pill badge (top-left, teal); destination name, country + flight time, blurb, up to 4 matched-tag chips (accent) + 1 unmatched-tag chip (outline), package price estimate, "Open →" link. Empty state: "Nothing inside those limits…" message.

### 4. Match (destination detail) — `screen: 'dest'`
- **Purpose**: single destination deep-dive with 3 sub-tabs: Stay, Interests, Fly.
- **Header**: 2-col split — left is a full-bleed placeholder photo (360px), right has back link, destination name + large % badge, country/flight-time/month meta line, blurb, and a "Why you're compatible" list (tag vs. bar-meter vs. source: board/saved).
- **Tab bar**: Stay (hotel count) / Interests (activity count) / Fly (fare count), active tab has an accent square indicator.
- **Stay tab**: sort row (Vibe match / Cheapest / Biggest drop) + stacked hotel cards (200px photo | details incl. "Chemistry" bar-meter + tags | price panel with strikethrough "was" price, per-night + total, "Make a Move"/"Locked in ✓" button, source line).
- **Interests tab** (was "Activities"): responsive card grid — photo, name, duration + price-per-person, note, "N% match" chip + "Make a Move"/"Remove" toggle button.
- **Fly tab**: a data table (`.table` class) — carrier, out/back times, duration, stops, fare, "Select"/"Selected ✓" button.

### 5. Make It Official (trip builder) — `screen: 'trip'`
- **Purpose**: the auto-assembled package (flight + hotel + activities) is editable line-by-line and finalized here.
- **Layout**: main column + 360px sticky total sidebar.
- **Trip rows**: one row per line item (Flights / Stay / Activity) — kind label chip, title/meta/badge, price + "Swap flight"/"Swap stay"/"Swap activity" button opening an inline swap drawer listing alternatives with price deltas.
- **Day-by-day**: card grid, one tile per day, numbered, with a title and note (day 1 is labeled "First Date — arrive + check in").
- **Sidebar**: itemized totals (flights × travellers, stay × nights, activities, taxes), a large trip-total figure, a budget-verdict line (under/over the filter-rail budget ceiling), "Make It Official" button, and post-booking confirmation card ("Official — ref LK-XXXX").

## Interactions & Behavior
- All navigation is client-side state (`screen`, `tab`) — no page reloads.
- Selecting/deselecting a vibe board, and swiping a photo, both immediately recompute the weighted tag profile used everywhere downstream (match %, hotel "Chemistry" %, "why you're compatible" bars).
- Filters (budget slider, flight-time slider, month, sort) are live — the Matches grid re-filters/re-sorts on every change, no submit step.
- Swap drawers (flight/hotel/activity) are inline, not modals — opened via a "Swap …" button, closed via an explicit "Close ✕", and picking an option immediately updates the trip row and re-prices the total.
- "Make It Official" is idempotent once booked (button becomes disabled-style "Official ✓" and a confirmation card appears); no error/loading states are modeled (this is a prototype — a real build needs pending/error states for the booking call).
- Range sliders are custom-styled (not browser default): `appearance:none`, square 16px accent-colored thumb, 4px neutral track, 2px accent `:focus-visible` ring.

## State Management
Prototype state shape (single component, for reference — restructure per the target app's state approach):
- `screen`: `'vibe' | 'swipe' | 'matches' | 'dest' | 'trip'`
- `picked`: string[] — selected vibe board ids
- `likes`: `{ [swipeIndex]: boolean }` — swipe yes/no per photo
- `swipeIdx`: number — current swipe position
- `budget`, `flightMax`, `month`, `sort`, `hotelSort`: filter/sort state
- `destId`, `tab`: current destination + active sub-tab
- `hotelId`, `flightIdx`, `acts` (number[]): selections composing the trip package
- `swap`: `null | 'flight' | 'hotel' | 'act:<index>'` — which swap drawer is open
- `booked`: boolean
- Derived (recomputed each render, not stored): tag-weight profile, destination match scores, hotel "Chemistry" scores, trip line items, trip total.
- Trip setup props (would come from a prior onboarding step or account defaults in a real app): `nights`, `travellers`, `origin`, `originCode`.
- No persistence in the prototype — a real build should persist profile/trip state (e.g. per-user backend or localStorage) so a reload doesn't lose progress.

## Design Tokens
Sourced from the bundled `modernist.css` design system, with an in-page override block at the top of `Likeness.dc.html`'s `<style>` (this project's palette diverges from that system's default mono red-on-white toward a warmer, more colorful, less geometric look — see override values below).

**Colors** (overridden in this build):
- Accent (coral): `--color-accent: oklch(64% 0.19 35)`, ramp 100–900 from `oklch(97% 0.02 35)` to `oklch(27% 0.10 35)`
- Accent-2 (teal): `--color-accent-2: oklch(60% 0.13 190)`, ramp 100–900 from `oklch(96% 0.02 190)` to `oklch(26% 0.07 190)`
- Base neutrals/ground/ink: from `modernist.css` — `--color-bg #f3f2f2`, `--color-text #201e1d`, `--color-neutral-100…900`
- `--color-divider: color-mix(in oklch, var(--color-accent) 14%, var(--color-neutral-300))`

**Typography**: `--font-heading` / `--font-body`: "Work Sans" (400/500/600/700), `--font-heading-weight: 700`. (Base system default was Archivo; swapped for a less geometric, more humanist letterform per art direction.)

**Radius** (overridden, non-zero — base system default is 0): `--radius-sm: 10px`, `--radius-md: 16px`, `--radius-lg: 26px`

**Shadows** (overridden, accent-tinted): `--shadow-sm`, `--shadow-md`, `--shadow-lg` — see `<style>` block in `Likeness.dc.html` for exact `color-mix()` values.

**Spacing**: unchanged from `modernist.css` — `--space-1` (4px) through `--space-8` (32px), 1.00× density.

## Screenshots
See `screenshots/` — one per main screen, captured from the live prototype:
- `01-your-type.png` — vibe board picker
- `02-find-your-type.png` — swipe refine
- `03-your-matches.png` — destination results
- `04-match-detail.png` — destination detail (Stay tab)
- `05-make-it-official.png` — trip builder

## Adding this to a GitHub repo
This bundle is a design reference, not app source — the usual path is to hand it to whoever implements the real app (or to Claude Code) alongside the target repo, not to commit the HTML itself as production code. To store it in a repo anyway (e.g. as a `design/` reference folder):

1. Unzip this download locally.
2. From the repo root:
   ```bash
   mkdir -p design/roamance-handoff
   cp -r path/to/unzipped/* design/roamance-handoff/
   git add design/roamance-handoff
   git commit -m "Add Roamance design handoff (prototype + spec)"
   git push origin <your-branch>
   ```
3. Open a PR as usual, or push directly to `main` if that's your workflow.

If you'd rather I push it for you: connect this project to your GitHub repo (Import → GitHub in this app), and ask me to sync — I can then commit these files directly instead of you copying them by hand.

## Assets
No real photography — every image slot is a diagonal-stripe placeholder (`repeating-linear-gradient`, accent/accent-2 tinted) with a monospace caption naming what belongs there (e.g. "board / chalk village + sea", "photo / lake under cloud", "stay / kalypso rooms"). Replace each with real photography before shipping; caption text in the JS data arrays (`BOARDS`, `SWIPES`, `DESTS`, `HOTELS`, `ACTS`) doubles as an asset shot-list.

## Files
- `Likeness.dc.html` — the full prototype (template + component logic + destination/hotel/activity/flight data, all inline per this authoring format). Read the `<script data-dc-script>`-equivalent logic class at the bottom for the scoring algorithm, data shape, and all copy strings.
- `modernist.css` — the base design-system stylesheet (tokens + component classes: `.btn`, `.tag`, `.input`, `.table`, etc.) that the prototype builds on and overrides.
