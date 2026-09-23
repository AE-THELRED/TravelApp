# Team Workflow, Phases, and Evidence

## Phase ownership

Agree on the data contract in [DATA-SCHEMA.md](DATA-SCHEMA.md) and the types in `src/context/types.ts` **before** anyone branches. Commit those two files first, on `main`.

| Phase | Owner | Files owned | Deliverable |
|---|---|---|---|
| 1. Data + logic | Person 1 | `src/data/*`, `src/lib/scoring.ts`, `src/lib/cost.ts`, `src/lib/bio.ts` | 10 trip profiles, quiz weight map, `scoreTrip`, `rankTrips`, `applyHacks`, `buildBio` |
| 2. Onboarding + quiz | Person 2 | `src/app/onboarding/*`, `src/app/quiz/*`, `OnboardingForm`, `Quiz`, `QuizQuestion` | Constraint form and 4–5 question vibe quiz producing a `TravelerProfile` |
| 3. Deck + detail | Person 3 | `SwipeDeck`, `TripCard`, `TripDetail`, `HackStack`, `HackToggle`, `CostSummary` | Swipeable ranked deck, trip detail, toggleable Hack Stack with live cost |
| 4. State + saved + integration | Person 4 | `context/*`, `lib/storage.ts`, `SavedList`, `app/layout.tsx` | Context/reducer, persistence, saved-trips comparison, merges, QA, demo flow |

Everyone works against the same committed `trips.json` and `types.ts`. If you need a new field, open a PR that changes `trips.json`, `types.ts`, and `DATA-SCHEMA.md` together and tell the team in chat.

## Branching and commits

```bash
git checkout main && git pull
git checkout -b feat/<phase-short-name>
# small commits as you go
npm run build            # must pass
git push -u origin feat/<phase-short-name>
```

- Branch names: `feat/`, `fix/`, `docs/`, `chore/`.
- Conventional commit subjects: `feat(quiz): map answers to tag weights`.
- Commits should be meaningful units, not `wip` × 12. Two substantive commits per phase is the floor.

## Pull requests and reviewed diffs

Every PR body:

```md
## What
## Why
## How to test (click path)
## Preview URL
## Screenshots (if visual)
```

At least one teammate reviews and leaves a **specific, substantive comment** on the diff — a named function, a data-shape concern, an edge case — not "LGTM". Squash-merge into `main`.

## Integration phase

Reserve the last third of the session. Order matters:

1. Merge Phase 1 (data + logic) first. Nothing else can be verified without it.
2. Merge Phase 4 (state + persistence) second.
3. Merge Phases 2 and 3 on top, resolving conflicts in favor of the shared types.
4. Walk the full click path on the production URL, on a phone.
5. Freeze features. Remaining time goes to copy, spacing, and the reset button.

## Integration smoke test

- [ ] Fresh browser (storage cleared) completes landing → onboarding → quiz → matches.
- [ ] Deck shows exactly 10 cards, sorted by descending match score, no duplicates.
- [ ] Match percentages differ meaningfully between two contrasting quiz runs.
- [ ] Every card image loads; no broken-image icons.
- [ ] Trip detail cost changes when a hack is toggled, and each enabled hack's tradeoff is listed.
- [ ] Hacked total never goes below the floor and never displays as negative.
- [ ] Saved screen shows saved trips with base vs. hacked cost and selected hacks.
- [ ] Reload preserves quiz result and saved trips.
- [ ] "Reset demo" clears everything and returns to landing.
- [ ] "Estimated prototype data" label appears wherever a price appears.

## AI-assisted research evidence

Keep `docs/RESEARCH-LOG.md` in the repo and append as you go. Each entry:

```md
### <date> — <question you were trying to answer>
**Prompt / query used:**
**What we learned:**
**Decision it drove:**
**Sources:**
```

Log at minimum: the competitor scan that led to the swipe-matching rebrand, the decision to prototype transparent tradeoffs instead of live booking, the architecture decision to stay front-end only, and any place where you rejected an AI suggestion and why. The rejections are the most persuasive evidence that AI was used as a research tool rather than an autopilot.
