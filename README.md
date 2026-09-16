# Travel Hacker

A front-end-only Next.js prototype that turns trip planning into a swipe-based matching experience. Answer a few constraints and a short vibe quiz, then meet ten trip "profiles" with matchmaker-style bios. Each match has a **Hack Stack**: toggleable money-saving strategies that adjust the estimated cost and always show the tradeoff.

> **Stop searching for trips. Meet one.**

All prices are **estimated prototype data**. There is no booking, no live pricing, and no external API.

## Live demo

Production: `<paste Vercel production URL here>`

## Quick start

```bash
git clone <repo-url>
cd travel-hacker
npm install
npm run dev        # http://localhost:3000
```

Before pushing:

```bash
npm run build      # must pass
```

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router), React |
| Language | TypeScript |
| Hosting | Vercel (Git-integrated previews) |
| State | Local `useState` + one Context/`useReducer` store |
| Persistence | Browser `localStorage`, single versioned key |
| Data | Committed static `src/data/trips.json` |
| Assets | Committed images in `public/images/<trip-id>/` |
| Backend | None |

## Documentation

Start with [CLAUDE.md](CLAUDE.md) — it is the entry point for AI coding assistants and for humans.

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — system diagram, layers, module boundaries, data flow
- [docs/NEXTJS.md](docs/NEXTJS.md) — scaffold, file layout, client/server components, routing
- [docs/VERCEL.md](docs/VERCEL.md) — deployment, preview URLs, build triage, static-export fallback
- [docs/STATE.md](docs/STATE.md) — state ownership, types, reducer actions, derived values
- [docs/PERSISTENCE.md](docs/PERSISTENCE.md) — `localStorage` schema, SSR-safe access, reset
- [docs/ASSETS.md](docs/ASSETS.md) — image sourcing, sizing, `next/image`, placeholders
- [docs/DATA-SCHEMA.md](docs/DATA-SCHEMA.md) — `trips.json` construction guide
- [docs/WORKFLOW.md](docs/WORKFLOW.md) — phase ownership, branching, review, integration checklist

## Screens

`/` landing → `/onboarding` constraints → `/quiz` vibe test → `/matches` swipe deck → `/trip/[id]` detail + Hack Stack → `/saved` comparison

## Non-goals

Real bookings, live flight or lodging prices, scraping, accounts, multi-device sync, runtime LLM calls, maps requiring an API key.

## Credits

Third-party image attributions: [`public/images/CREDITS.md`](public/images/CREDITS.md).
