# Team Workflow, Phases, and Evidence

Two people, one session. The shared contract — `src/lib/types.js`,
`src/data/*.json`, `src/lib/scoring.js`, `src/lib/cost.js`, `src/state/tripReducer.js`,
`src/lib/storage.js` — is **already committed on `main`**. Do not re-litigate it
at the start of the session; branch off it.

If you genuinely need a new field, open a PR that changes the JSON, `types.js`,
and `DATA-SCHEMA.md` together and say so in the team chat before you merge.

## Phase ownership

| Phase | Owner | Builds | Files owned |
|---|---|---|---|
| **A. Getting to know you** | | Onboarding constraints form, "Your Type" board picker, "Find Your Type" swipe refine, the live tag-meter sidebar | `screens/Onboarding.jsx`, `screens/VibeBoards.jsx`, `screens/SwipeRefine.jsx`, `components/VibeCard.jsx`, `components/SwipeCard.jsx`, `components/TagMeters.jsx` |
| **B. The match and what it costs** | | Ranked deck of ten, trip detail, Hack Stack with live cost and the tradeoff list, saved comparison | `screens/Matches.jsx`, `screens/TripDetail.jsx`, `screens/Saved.jsx`, `components/TripCard.jsx`, `components/HackStack.jsx`, `components/CostSummary.jsx` |

Put your name in the Owner column in your first commit.

`App.jsx`, `state/*`, `lib/*` and `index.css` are **shared**. Both of you will
touch `App.jsx` to register a screen. Keep those edits to the `screens` object
and say so in the PR, and the conflicts stay trivial.

### This was a three-way split until a collaborator left

The third phase was onboarding + saved + integration. Onboarding moved to A
because it sits in the same flow; saved moved to B because it re-derives the
same costs the detail screen already computes. Integration is now **both of
you**, jointly, in the last third of the session.

That is more work per person than before, so read the cut list below before you
start rather than at the point you run out of time.

### Dependencies

- **B depends on A only for `Art.jsx`'s real motifs.** A stub is already on
  `main` rendering the handoff's stripe placeholder for every motif, so B can
  build trip cards on day one and it will never look broken. Drawing real
  motifs is now optional polish, owned by whoever has time. See
  [ASSETS.md](ASSETS.md).
- **B depends on A for `constraints`.** Until Onboarding exists, hard-code a
  constraints object locally while developing. Do not commit it to `App.jsx`.
- **Nobody depends on `scoring.js` or `cost.js` landing.** They are done.

## Cut list, in order

If you are running out of time, cut from the top. Do not cut from the bottom —
the bottom three are the demo.

1. **Real `Art` motifs.** The stripe placeholder is a deliberate design choice,
   not an unfinished one. Cutting this costs nothing.
2. **The saved comparison screen.** The Hack Stack already makes the argument;
   saved only shows it twice side by side.
3. **The swipe-refine screen.** Boards alone produce a usable profile —
   `buildProfileTags` works with `likes` empty. Wire the board picker straight
   to `COMMIT_VIBE` and the app still runs end to end.
4. **The onboarding form.** Dispatch a sensible default constraints object from
   the landing button instead. You lose the budget tier as an input, which
   flattens `budgetSensitivity` to its neutral 3.
5. — everything below this line ships —
6. The vibe-board picker.
7. The ranked deck.
8. The trip detail with a working Hack Stack and visible tradeoffs.

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

1. Merge **A** first — nothing downstream can be exercised without a
   `constraints` object and a real profile.
2. Merge **B** on top, resolving conflicts in favour of the shared types.
3. Both of you wire the `screens` object in `App.jsx` together, in one sitting.
   It is the one file you have both been editing.
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
