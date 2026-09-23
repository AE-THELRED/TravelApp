# Vite + React conventions

Replaces the old `NEXTJS.md`. There is no Next.js here: no App Router, no
server components, no `"use client"`, no `next/image`, no TypeScript. If you
find a doc, a snippet, or an AI answer that mentions any of those, it is
describing an earlier plan for this repo that no longer exists.

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173, hot reload
npm run build     # must pass before you push
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

## File layout

```
index.html                 the real entry point — Vite serves this
src/
  main.jsx                 createRoot(...).render(<App />)
  App.jsx                  the reducer, the two persistence effects, the screen switch
  index.css                every design token and all component CSS
  data/                    trips.json, boards.json, swipes.json
  lib/                     scoring.js, cost.js, bio.js, storage.js, types.js
  state/tripReducer.js
  screens/                 one file per screen
  components/              presentational pieces
public/                    served as-is at the site root (favicon.svg)
```

## Conventions

- **Always include the file extension in a relative import.** `./lib/cost.js`,
  `./screens/Landing.jsx`. There is no path alias configured — no `@/`.
- **JSON imports are static and bundled**: `import trips from "../data/trips.json"`.
  No `fetch`, no `await`.
- **Plain JavaScript with JSDoc types.** Annotate with
  `/** @param {import("./types.js").Trip} trip */` and editors give you
  autocomplete without a build step. Do not add TypeScript mid-session.
- **Components are function components.** Default-export one per file, named
  the same as the file.
- **CSS is global**, in `src/index.css`, with `.block__element` class names. No
  CSS modules, no Tailwind, no styled-components. See [THEME.md](THEME.md).
- **No new dependencies without asking the team.** Every package is another
  install to go wrong on someone else's laptop twenty minutes before the demo.
  The current runtime dependency list is `react` and `react-dom`, and it should
  stay that way.

## Routing

There isn't any. `state.screen` is a string and `App.jsx` switches on it:

```jsx
const screens = {
  landing: <Landing dispatch={dispatch} hasVibe={state.picks.length > 0} />,
};

return screens[state.screen] ?? <NotBuiltYet screen={state.screen} dispatch={dispatch} />;
```

Add your screen to that object when it is ready. Until then it renders
`NotBuiltYet`, which is a visible TODO rather than a blank page.

Consequences to accept: no URL per screen, no browser back button, no deep
links. For a two-minute demo that is a feature, not a limitation — nobody can
land mid-flow in a broken state.

## Adding a screen

1. Create `src/screens/YourScreen.jsx`, default-exporting a function component.
2. Take `state` and `dispatch` as props. Do not reach for a global.
3. Derive with `useMemo`; keep component-local UI state in `useState`.
4. Register it in the `screens` object in `App.jsx`. **That file is shared by
   both phases**, so keep your edit to the `screens` object and say so in the
   PR — that keeps the conflict trivial.
5. `npm run build && npm run lint` before you push.

## Gotchas

| Symptom | Cause |
|---|---|
| `Failed to resolve import "./lib/cost"` | Missing `.js` extension. |
| Blank page, console `Objects are not valid as a React child` | Rendering an object — usually `cost` instead of `cost.hackedTotal`. |
| Styles do nothing | Class typo, or you wrote a raw hex where a token belongs. |
| Two `<Art>` on a screen render identically | Duplicate SVG `<pattern>` id. See [ASSETS.md](ASSETS.md). |
| `NaN` in a price | Reading a field that does not exist on the cost result — it is `hackedTotal`, not `total`. |
