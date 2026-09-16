# Next.js Setup and Conventions

## Scaffold

```bash
npx create-next-app@latest travel-hacker \
  --typescript --app --tailwind --eslint --src-dir --import-alias "@/*"
cd travel-hacker
npm run dev
```

If the team is uncomfortable with TypeScript, use `--javascript` instead. Pick one and do not mix. TypeScript is recommended here only because the shared data shapes are the main source of integration bugs.

## Version and rendering choice

- Use the **App Router** (`src/app/`), which is the current default in `create-next-app`.
- Deploy to Vercel with a **normal build** (no `output: 'export'`). This keeps `next/image` optimization and Vercel preview deployments working with zero configuration.
- Only if the team must host on GitHub Pages, switch to a static export by setting `output: 'export'` in `next.config.js`; `next build` then emits an `out/` folder of plain HTML, CSS, and JS ([Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)). In that mode also set `images: { unoptimized: true }`, since on-demand image optimization needs a server.

```js
// next.config.js — GitHub Pages fallback only
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // trailingSlash: true, // emits /me/index.html instead of /me.html
};
module.exports = nextConfig;
```

## File layout

```text
src/
  app/
    layout.tsx            # html/body shell, imports globals.css, wraps <TripProvider>
    page.tsx              # Landing
    onboarding/page.tsx
    quiz/page.tsx
    matches/page.tsx
    trip/[id]/page.tsx
    saved/page.tsx
    globals.css
  components/
    Landing.tsx
    OnboardingForm.tsx
    Quiz.tsx
    QuizQuestion.tsx
    SwipeDeck.tsx
    TripCard.tsx
    TripDetail.tsx
    HackStack.tsx
    HackToggle.tsx
    CostSummary.tsx
    SavedList.tsx
    EstimateBadge.tsx     # the "estimated prototype data" label
  context/
    TripProvider.tsx
    tripReducer.ts
    types.ts
  lib/
    scoring.ts
    bio.ts
    cost.ts
    storage.ts
  data/
    trips.json
    quiz.json
public/
  images/<trip-id>/1.jpg ...
docs/
```

## Client vs. server components

Nearly every interactive screen needs `"use client"` at the top of the file, because it uses state, effects, or event handlers. Specifically:

- `"use client"` required: `TripProvider`, `OnboardingForm`, `Quiz`, `SwipeDeck`, `TripCard`, `TripDetail`, `HackStack`, `SavedList`.
- Server components are fine for: `app/layout.tsx` shell content, static copy blocks, and the landing hero.
- `src/app/layout.tsx` stays a server component but renders `<TripProvider>` (a client component) around `{children}`. That is allowed and is the intended pattern.

## Routing notes

- `src/app/trip/[id]/page.tsx` reads the route param and looks the trip up in `trips.json` by `id`. If the id is missing, render a "trip not found" state with a link back to `/matches` — do not throw.
- Navigate with `next/link` and `useRouter().push()` from `next/navigation` (not `next/router`).
- Guard sequencing: if a user lands on `/matches` with no `travelerProfile` in state, redirect to `/onboarding`. Do that in a `useEffect`, not during render.
- Acceptable simplification: if routing causes friction, keep everything on `/` and switch on a `screen` value in Context. Choose this before splitting work, not after.

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
}
```

Every pull request must pass `npm run build` locally before review. That single command catches most integration breakage.

## Styling

Tailwind utility classes in markup are fine, but keep semantic structure and stable `data-testid` / class hooks so the design collaborator can restyle without refactoring logic. Put shared tokens in `globals.css` rather than hardcoding hex values across components.
