# Deployment

## Why deploy at all

Every branch push gets its own preview URL, so each phase is reviewable on a
phone without anyone merging to `main` first. That is worth the ten minutes of
setup: "open this link" beats "pull my branch and run npm install" when three
people are working at once.

## One-time setup — one person, at the start

1. Push `main` before anyone branches. (Already done.)
2. Vercel → **Add New… → Project** → import `AE-THELRED/TravelApp`.
3. Framework preset: **Vite**. This repo is Vite + React, **not Next.js** — if
   the preset says Next.js, change it or the build will fail.
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Environment variables: **none**. If a task seems to need one, the task is
   out of scope for this prototype.
5. Confirm the production branch is `main`.
6. Paste the production URL into `README.md` and the team chat.

## Everyday flow

```bash
git checkout -b feat/vibe-boards
# work
npm run build && npm run lint     # both must pass before you push
git push -u origin feat/vibe-boards
# open a PR → a preview URL appears on it
```

- Review the **preview URL**, not just the diff. Click the whole path: landing
  → onboarding → vibe → swipe → matches → detail → saved.
- Merge to `main` only after the preview works. Merging deploys production.
- If `main` breaks during the demo window, **roll back to the last good
  production deployment** rather than debugging live. Find out where that button
  is *before* you need it.

## Build failure triage

| Symptom | Cause | Fix |
|---|---|---|
| Build fails immediately, mentions `next` | Framework preset is Next.js | Set it to Vite, output `dist` |
| `Failed to resolve import "./lib/cost"` | Missing `.js` extension | Vite is stricter than your editor — add it |
| `window is not defined` | Storage read at module scope | Move it inside `useEffect`; see [PERSISTENCE.md](PERSISTENCE.md) |
| Blank white page, no build error | Runtime crash | Open the browser console on the preview; it is almost always an undefined field |
| Works locally, 404 in production | Case-mismatched filename | Paths are case-sensitive in production even when macOS is not |
| Fonts look wrong in production only | Google Fonts blocked or slow | Check the fallback stack in `--font` reads acceptably |

## Static hosting fallback

The build output is a plain static `dist/` folder — `index.html` plus hashed
assets, no server. Any static host serves it:

```bash
npm run build
npx serve dist        # or GitHub Pages, Netlify, someone's laptop
```

If Vercel is being difficult ten minutes before the demo, this is the escape
hatch. Nothing in this app needs a server.

## Before the demo

- [ ] Production URL loads on a phone, not just a laptop.
- [ ] Full click path works end to end on that URL.
- [ ] Reset button works, so the demo can be run twice.
- [ ] Someone has the rollback screen open in a tab.
