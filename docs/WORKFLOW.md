# Team Workflow, Phases, and Evidence

Three people, one session. The shared contract — `src/lib/types.js`,
`src/data/*.json`, `src/lib/scoring.js`, `src/lib/cost.js`, `src/state/tripReducer.js`,
`src/lib/storage.js` — is **already committed on `main`**. Do not re-litigate it
at the start of the session; branch off it.

If you genuinely need a new field, open a PR that changes the JSON, `types.js`,
and `DATA-SCHEMA.md` together and say so in the team chat before you merge.

## Phase ownership

| Phase | Owner | Builds | Files owned |
|---|---|---|---|
| **A. Vibe capture** | | "Your Type" board picker, "Find Your Type" swipe refine, the live tag-meter sidebar, and the real `Art` motifs | `screens/VibeBoards.jsx`, `screens/SwipeRefine.jsx`, `components/VibeCard.jsx`, `components/SwipeCard.jsx`, `components/TagMeters.jsx`, `components/Art.jsx` |
| **B. Deck and true cost** | | Ranked deck of ten, trip detail, Hack Stack with live cost and the tradeoff list | `screens/Matches.jsx`, `screens/TripDetail.jsx`, `components/TripCard.jsx`, `components/HackStack.jsx`, `components/CostSummary.jsx` |
| **C. Constraints, saved, integration** | | Onboarding constraints form, saved comparison, app shell, merges, QA, the demo click-path | `screens/Onboarding.jsx`, `screens/Saved.jsx`, `App.jsx`, `state/*`, `lib/storage.js` |

Put your name in the Owner column in your first commit.

### Dependencies between phases

- **B depends on A only for `Art.jsx`.** A stub is already on `main` that
  renders the handoff's diagonal-stripe placeholder for every motif, so B can
  build trip cards on day one. Phase A replaces the stub's internals; the props
  do not change. See [ASSETS.md](ASSETS.md).
- **A and B both depend on C for `constraints`.** Until Onboarding exists, set a
  fake constraints object in your own screen while developing. Do not commit it
  to `App.jsx` — that is C's file.
- **Nobody depends on `scoring.js` or `cost.js` landing.** They are done.

## What is already built and verified

- `scoring.js` — `buildProfileTags`, `buildProfile`, `scoreTrip`, `rankTrips`.
  Four contrasting profiles rank sensibly and distinctly.
- `cost.js` — `baseCost`, `availableHacks`, `applyHacks`, `money`. Itemised
  group totals, per-person splits, a floor so a total can never go negative,
  and one tradeoff per enabled hack.
- `bio.js` — `buildMatchLine`, `reasonChips`.
- `storage.js`, `tripReducer.js`, `App.jsx` shell, `Landing.jsx`.
- Data: 10 trips with 3–4 hacks each, 6 vibe boards, 8 swipe photos.

Unbuilt screens render a `NotBuiltYet` placeholder rather than a blank page, so
you can always see where you are in the flow.

## Branching and commits

```bash
git checkout main && git pull
git checkout -b feat/<phase>-<thing>
# small commits as you go
npm run build && npm run lint     # both must pass
git push -u origin feat/<phase>-<thing>
```

- Branch names: `feat/`, `fix/`, `docs/`, `chore/`.
- Conventional commit subjects: `feat(vibe): weight board picks into the profile`.
- Meaningful units, not `wip` × 12. **Two substantive commits per phase is the
  floor** — that is an assignment requirement, not a style preference.

## Pull requests and reviewed diffs

Every PR body:

```md
## What
## Why
## How to test (click path)
## Preview URL
## Screenshots (if visual)
```

At least one teammate reviews and leaves a **specific, substantive comment** on
the diff — a named function, a data-shape concern, an edge case — not "LGTM".
The assignment asks for a reviewed diff; a rubber stamp does not count as one.

Squash-merge into `main`.

## Integration phase

Reserve the last third of the session. Order matters:

1. Merge **C**'s onboarding first — nothing downstream can be exercised without
   a `constraints` object.
2. Merge **A**. The deck cannot be checked without a real profile.
3. Merge **B** on top, resolving conflicts in favour of the shared types.
4. Walk the full click path on the deployed URL, on a phone.
5. Freeze features. Remaining time goes to copy, spacing, and the reset button.

## Integration smoke test

- [ ] Fresh browser, storage cleared, completes landing → onboarding → vibe →
      swipe → matches → detail → saved without a dead end.
- [ ] Deck shows exactly 10 cards, descending match score, no duplicates.
- [ ] Two contrasting vibe runs produce visibly different decks and different
      top matches.
- [ ] Picking one board and picking four both yield a profile that peaks at 5 —
      clicking more must not inflate every match.
- [ ] Every card renders art; no broken-image icons and no empty boxes.
- [ ] Trip detail cost changes when a hack is toggled, and every enabled hack's
      tradeoff is listed.
- [ ] A hack whose requirement is unmet is not shown at all — set travellers to
      1 and confirm the group-split hack disappears.
- [ ] Hacked total never drops below the floor and never renders negative.
- [ ] Saved screen shows base vs. hacked cost and the selected hacks.
- [ ] Reload preserves constraints, vibe picks, swipes, and saved trips.
- [ ] "Reset" clears everything and returns to landing.
- [ ] "Estimated prototype data" appears wherever a price appears.

## AI-assisted research evidence

[RESEARCH-LOG.md](RESEARCH-LOG.md) is the assignment's evidence of the research
phase. Append as you go — each entry names the question, what you learned, the
decision it drove, and **what you rejected**.

The rejections are the most persuasive evidence that AI was used as a research
tool rather than an autopilot. The log already records three: live flight-price
integration, runtime LLM bio generation, and the handoff's booking flow.
