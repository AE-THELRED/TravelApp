# AI-Assisted Research Log

Append an entry every time AI research shaped a decision. This file is the assignment's evidence of the research phase — keep it honest and specific, including suggestions you rejected.

> **On the first three entries' sources.** Those entries were written on 2026-09-15
> from conversation, and their source lines were left blank. The URLs were located
> on 2026-09-22 and substantiate the claims already recorded — they are not a
> reconstruction of the original queries, which were not saved. Entries from
> 2026-09-22 onward cite what was actually read at the time.

---

### 2026-09-15 — What do existing "travel hack" tools actually solve?
**Prompt / query used:** Compared single-purpose tools (hidden-city fare search, group lodging saves, post-booking itinerary organizers) against a combined dashboard concept.
**What we learned:** Each existing tool solves one slice — fare tricks, shared saved listings, or itinerary organization — and none surface the full "true cost" of a compromise.
**Decision it drove:** Rebrand around transparency: every saving is paired with a visible tradeoff, rather than pushing the lowest headline number.
**Sources** (located 2026-09-22):
- Hidden-city fare search — [The Points Guy, "What is skiplagging"](https://thepointsguy.com/airline/what-is-skiplagging) and [NPR on American Airlines suing over skiplagging](https://www.npr.org/2023/08/23/1194998452/skiplagging-airfare-flying-skiplagged-american-airlines). Confirms the pattern we built the Hack Stack around: a real saving (roughly 50%) carried by real, unstated costs — checked bags routed to the wrong city, cancelled return legs, revoked miles, account bans. The saving is advertised; the tradeoff is not.
- Itinerary organizers and group splitting — [TripIt, "5 Best Group Travel Planning + Organizer Apps"](https://www.tripit.com/web/blog/travel-tips/best-group-travel-planning-app). Each tool owns one slice: TripIt organizes confirmations post-booking with one-way sharing and no expense splitting; Splitwise does expenses only and sits alongside a separate planner.
- Hidden true cost, and that this is a recognised problem and not just our opinion — [FTC final rule banning junk ticket and hotel fees](https://www.ftc.gov/news-events/news/press-releases/2024/12/federal-trade-commission-announces-bipartisan-rule-banning-junk-ticket-hotel-fees) and the [Federal Register text](https://www.federalregister.gov/documents/2025/01/10/2024-30293/trade-regulation-rule-on-unfair-or-deceptive-fees). "Drip pricing" — a low headline price with mandatory fees revealed at checkout — is the exact practice this rebrand argues against, and the rule only forces disclosure of *fees*, never of what a cheaper choice costs you in stairs, transit time, or a pull-out couch. That gap is the product.

---

### 2026-09-15 — Is a swipe/matching mechanic defensible for travel?
**Prompt / query used:** Researched travel-personality quiz dimensions (pace, budget, adventure tolerance, social preference, interests).
**What we learned:** Preference dimensions used by existing travel-personality tools map cleanly onto tag weights.
**Decision it drove:** A 4–5 question vibe quiz feeding a deterministic weighted-tag score, presented as dating-app "matches." (Superseded on 2026-09-22 — the quiz was replaced by vibe boards and swipe refinement, but the weighted-tag scoring it fed survives unchanged.)
**Sources** (located 2026-09-22):
- [Plog's model of allocentricity and psychocentricity (Tourism Teacher)](https://tourismteacher.com/plogs-model-of-allocentricity-and-psychocentricity/) and [Plog's tourist motivation model (Research-Methodology)](https://research-methodology.net/plogs-tourist-motivation-model/). Plog (1974) places travellers on a novelty-versus-familiarity spectrum, with most people mid-centric. This is the precedent for scoring a traveller on continuous dimensions rather than sorting them into a bucket — and it is why `rankTrips` compresses displayed scores into 62–97 instead of letting anything read as a dead card.
- [Truity travel personality test](https://www.truity.com/test/travel-personality-test) — a live example of the pattern: Big Five-derived questions resolving to named types ("Zen Traveler", "Culture Hound", "Trip Maximizer", "Creature of Comfort"). Confirmed that a handful of questions is enough to produce a result that reads as personal, which is what our seven shared tags do.
- [Talker Research, five American travel personas](https://talkerresearch.com/study-reveals-americans-fit-into-5-different-travel-personas/) — evidence that consumer-facing travel segmentation already runs on a small number of archetypes, supporting six vibe boards rather than twenty.

---

### 2026-09-15 — What architecture fits one class session?
**Prompt / query used:** Evaluated front-end-only vs. backend-backed prototypes for a team of four in a single session.
**What we learned:** Static hosting plus browser storage covers the entire demo requirement; a backend adds setup cost with no demo payoff.
**Decision it drove:** Front-end-only Next.js on Vercel, committed JSON dataset, `localStorage` persistence, no API keys.
**Rejected AI suggestions:** Live flight-price integration and runtime LLM bio generation — both add credential/latency/hallucination risk and neither is visible in a two-minute demo.
**Sources** (located 2026-09-22):
- [MDN, Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria). Confirms `localStorage` is 5 MiB per origin — far more than our one state blob needs — and that exceeding it throws `QuotaExceededError`, which "should be handled by using a `try...catch` block." This is the direct justification for wrapping every access in `src/lib/storage.js`, and for the failure paths returning `{}` rather than throwing: the same guard also covers Safari private browsing, where the quota is effectively zero and the *first* write throws.

---

### 2026-09-22 — The design handoff and the code describe two different products. Which one ships?
**Prompt / query used:** Diffed `design/roamance-handoff/README.md` and its five screenshots against the committed data contract in `src/lib/types.js`, then checked each side against the no-backend constraints in `CLAUDE.md`.
**What we learned:** The handoff was authored at 20:54 on 2026-09-15, and its own README states why it diverged: *"Repo currently contains only README.md — no source to build from."* It was built blind, in the same hour as the Vite scaffold. It specifies vibe boards → swipe refine → filtered destination results → Stay/Interests/Fly tabs → an end-to-end booking flow with a confirmation reference. The code specifies constraints → quiz → ranked deck → true-cost card with a Hack Stack. Only the brand and the ranking metaphor overlap. Both sides had independently landed on coral + teal on warm paper, so the *visual* layer transferred almost for free; it was the product that had forked.
**Decision it drove:** Adopt the handoff's two front screens (vibe boards, swipe refine) as the profile capture, keep the Hack Stack as what the deck pays off into, and drop the booking flow. The seam that made this cheap: every screen downstream consumes a `ProfileTags` vector, so replacing what *produces* that vector left `scoreTrip`, `rankTrips`, and all of `cost.js` untouched.
**Rejected AI suggestions:** Building the handoff as specified. It needs hotel, activity, and flight datasets plus a fake checkout, breaks constraints 1–5, and argues the opposite thing — a booking funnel optimises for completing a purchase, and this rebrand exists to show people what a cheap purchase actually costs them. Also rejected: keeping the five-question quiz alongside the boards, which would have meant two onboarding flows competing to set the same vector.
**Sources:** `design/roamance-handoff/README.md`; `design/roamance-handoff/screenshots/`; `src/lib/types.js`.

---

### 2026-09-22 — Does the scoring engine actually rank sensibly, or does it just run?
**Prompt / query used:** Ran four contrasting synthetic profiles (beach/thrifty, city/splurge, outdoors/mid-budget, slow-cultural) through `buildProfile` → `rankTrips` → `applyHacks` and read the output rather than trusting that a green build meant working logic.
**What we learned:** Three of the four decks were right. The outdoors profile was not: with `nature: 5` it put San Juan at the top and Asheville — the only `nature: 5` trip in the set — fourth. The cause was in the budget-fit term, `1 - |sensitivity - friendly| / 5`, which scores a trip highest when its cheapness *equals* the traveller's price-sensitivity and therefore **penalises a trip for being cheap**. A mid-budget traveller scored Asheville (budgetFriendly 5) 15/25 and San Juan (budgetFriendly 3) 25/25. The old quiz only ever emitted budgetSensitivity 0 or 5, so the bug sat at the extremes where it was invisible; deriving the value from the budget tier exposed it.
**Decision it drove:** Replaced the term with `1 - care × (1 - cheap)`, where `care = sensitivity / 5`. Cheapness can now never cost a trip points, and an expensive trip is penalised in proportion to how much the traveller says they care. All four decks then ranked correctly, each with a distinct top match at 97%.
**Rejected AI suggestions:** Hand-tuning the trip tag values until Asheville won. That would have papered over a formula bug with data, and the same bug would have resurfaced on the next trip anyone added.
**Sources:** Direct execution of `src/lib/scoring.js` and `src/lib/cost.js` against `src/data/trips.json`.

---

### <date> — <question>
**Prompt / query used:**
**What we learned:**
**Decision it drove:**
**Rejected AI suggestions:**
**Sources:**
