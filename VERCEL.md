# Deployment — Vercel

## Why Vercel for this project

Vercel's Git integration deploys every branch push automatically and creates a production deployment when changes land on the production branch; pull requests targeting the production branch get their own unique preview deployment, and reverts on a custom domain can be rolled back instantly ([Vercel Git deployments](https://vercel.com/docs/deployments/git)). For a hackathon that means each teammate gets a shareable URL for their phase without touching the main branch.

## One-time setup (done by one person, at the start)

1. Create the GitHub repository and push an initial commit **before** anyone starts a feature branch.
2. In Vercel, "Add New… → Project" → import the GitHub repo.
3. Framework preset: **Next.js**. Build command, output directory, and install command: leave as detected defaults.
4. Environment variables: **none**. If a task seems to need one, the task is out of scope for this prototype.
5. Confirm the production branch is `main`.
6. Paste the production URL into the repo `README.md` and the team chat.

## Everyday flow

```bash
git checkout -b feat/hack-stack
# work
npm run build          # must pass before you push
git push -u origin feat/hack-stack
# open a PR -> Vercel comments a preview URL on the PR
```

- Review the **preview URL**, not just the diff. Click the full path: landing → onboarding → quiz → matches → detail → saved.
- Merge to `main` only after the preview works. Merging produces the production deployment.
- If `main` breaks during the demo window, use Vercel's rollback to the last good production deployment rather than debugging live.

## Build failure triage

| Symptom | Cause | Fix |
|---|---|---|
| `window is not defined` / `localStorage is not defined` during build | Storage read at module scope or in a server component | Move it inside `useEffect`; see [PERSISTENCE.md](PERSISTENCE.md) |
| `useState`/`onClick` error about server components | Missing `"use client"` | Add the directive to the top of the file |
| Type error on `trips.json` | Data file drifted from the declared types | Update `trips.json` and `types.ts` together |
| Image 404 in production, fine locally | Wrong case in filename or path | Paths are case-sensitive on Vercel; match exactly |

## GitHub Pages fallback

Only if Vercel is unavailable: set `output: 'export'` and `images: { unoptimized: true }`, run `next build`, and publish the generated `out/` folder ([Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)). Also set `basePath` to the repo name if the site is served from `username.github.io/repo`. Prefer Vercel; the fallback costs configuration time you do not have.

## Demo checklist

- [ ] Production URL loads on a phone, not just a laptop.
- [ ] Hard refresh mid-flow does not white-screen.
- [ ] Every price is next to the "estimated prototype data" label.
- [ ] `localStorage` cleared → the whole flow still works from scratch.
- [ ] A "Reset demo" button exists so you can re-run the pitch cleanly.
