# CLAUDE.md — Travel Hacker

Context file for Claude Code. Read this first, then read the linked docs before writing code.

## Project

Travel Hacker is a **front-end-only** Next.js prototype built in a single hackathon session by 3–4 developers with limited coding experience. It is a "travel Tinder": the user answers trip constraints and a short vibe quiz, then swipes through ~10 generated trip "profiles" with matchmaker-style bios. Each trip has a **Hack Stack** — toggleable money-saving strategies that adjust an estimated cost and always show the tradeoff.

Tagline: "Stop searching for trips. Meet one."

## Hard constraints (do not violate)

1. **No backend.** No API routes that persist data, no database, no auth, no server actions.
2. **No API keys, no `.env` secrets, no third-party SDKs** that require credentials.
3. **No live prices and no web fetching at runtime.** All trip and price data comes from a committed static JSON file.
4. **No runtime LLM calls.** Bios are pre-authored or assembled from template fragments. Match scores come from a deterministic scoring function.
5. All prices must be rendered with a visible **"estimated prototype data"** label.
6. Persistence is **`localStorage` only**.
7. Visual design (colors, type, layout polish) is owned by a separate collaborator. Build clean, unstyled-to-lightly-styled, semantic markup with clear class hooks. Do not invent a heavy design system.

## Documentation map

| Doc | Read when |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Always. System diagram, module boundaries, data flow. |
| [docs/NEXTJS.md](docs/NEXTJS.md) | Scaffolding, routing, file layout, conventions. |
| [docs/VERCEL.md](docs/VERCEL.md) | Deployment, preview URLs, static export fallback. |
| [docs/STATE.md](docs/STATE.md) | Component state, Context shape, reducer actions. |
| [docs/PERSISTENCE.md](docs/PERSISTENCE.md) | `localStorage` keys, schema versioning, SSR-safe reads. |
| [docs/ASSETS.md](docs/ASSETS.md) | Images, licensing, `next/image` usage, placeholders. |
| [docs/DATA-SCHEMA.md](docs/DATA-SCHEMA.md) | Building and validating `trips.json`. |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Branching, commit expectations, phase ownership, integration. |

## Definition of done for the prototype

A user can: land → enter constraints → take the quiz → swipe a deck of 10 ranked trips → open a trip detail → toggle hacks and watch the cost change → save the trip → view saved trips side by side → reload the page and still see their quiz result and saved trips.
