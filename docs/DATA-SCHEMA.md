# Data Schema

Three committed files in `src/data/`. `src/lib/types.js` is the authoritative
contract — this doc is how to *build* valid data, and why the shapes are what
they are.

**Changing a field changes the JSON, `types.js`, and this file in the same
commit.** Say so in the PR.

## `trips.json` — 10 `Trip` objects

```json
{
  "id": "new-orleans",
  "city": "New Orleans",
  "region": "Louisiana, USA",
  "archetype": "city",
  "travelMode": "fly",
  "art": { "sky": "#2A1B3D", "accent": "#E8B44A", "motif": "brass" },
  "tags": {
    "food": 5, "nightlife": 5, "nature": 0, "culture": 4, "beach": 0,
    "relaxation": 2, "activity": 4,
    "familyFriendly": 1, "budgetFriendly": 3
  },
  "idealStay": [3, 4],
  "groupFriendly": true,
  "recommendedGroupSize": 4,
  "currency": "USD",
  "cost": {
    "airfare": 280, "lodgingPerNight": 180, "foodPerDay": 55,
    "localTransit": 40, "fees": 35
  },
  "assumptions": { "baggage": "…", "airportTransfer": "…", "transitHours": 0.7 },
  "tripBio": "A charismatic long-weekend match. …",
  "hacks": [ … ]
}
```

### Tags, 0–5

The first seven — `food`, `nightlife`, `nature`, `culture`, `beach`,
`relaxation`, `activity` — are **shared** with the traveler profile and drive
tag-overlap scoring. Score the place honestly: New Orleans is `nature: 0`, and
that is what makes it lose to Asheville for someone who wants trees.

Two are trip-only and deliberately asymmetric:

- `familyFriendly` — compared against traveller ages, not a profile tag.
- `budgetFriendly` — **how cheap the trip is**, not how cheap the traveller
  wants it to be. 5 = very cheap. Compared against `profile.budgetSensitivity`.

### `cost` — the part people get wrong

Every line is **per person** *except* `lodgingPerNight`, which is the nightly
rate for **the whole party's unit** and is divided by traveller count in
`cost.js`. That asymmetry is the entire reason the "split a rental" hack shows
a visible saving. Do not "fix" it into a per-person number.

| Field | Unit |
|---|---|
| `airfare` | Per person, round trip. For `travelMode: "drive"`, that person's share of gas and tolls. |
| `lodgingPerNight` | **Whole unit**, per night. |
| `foodPerDay` | Per person, per night of stay. |
| `localTransit` | Per person, whole trip. |
| `fees` | Per person. Cleaning, resort, booking. |

### `assumptions`

Rendered verbatim on the true-cost card. This is the honesty layer, not flavour
text — it is where the estimate admits what it assumed. Write real numbers.

### `hacks` — 3–4 per trip

```json
{
  "id": "nola-split-2br",
  "title": "Split a two-bedroom rental",
  "description": "Swap two hotel rooms for one rental and divide it across the group.",
  "type": "groupSplit",
  "savingsAmount": 70,
  "appliesPerPerson": true,
  "tradeoff": "Someone is taking the pull-out couch. Decide who before you book, not after.",
  "risk": "needs 3+ travelers",
  "requires": { "minTravelers": 3 }
}
```

| Field | Rule |
|---|---|
| `id` | Unique within its trip. Prefix with the trip for sanity. |
| `title` | Imperative and specific. "Fly Tuesday instead of Friday", not "Save on flights". |
| `type` | `dateFlex`, `altAirport`, `altLodgingArea`, `groupSplit`, `offSeason`, `transportChoice`, `packing`, `misc`. |
| `savingsAmount` / `savingsPercent` | Amount wins if both are present. |
| `appliesPerPerson` | `true` = per person. `false` = split across the group. |
| **`tradeoff`** | **Required, non-empty, and concrete.** This is the product. |
| **`risk`** | **Required.** Short chip label: "carry-on only", "arrives late". |
| `requires` | `{}` means always offered. `flexibleDates`, `minTravelers`, `minNights`. |

An unmet `requires` **hides the hack entirely** rather than greying it out — a
solo traveller should never see "split a two-bedroom" at all.

#### Writing a tradeoff

A tradeoff is not a disclaimer. It is the sentence that makes the saving honest,
and it has to cost the reader something real:

- Good: "A 15-minute streetcar ride each way at about $3 a trip, and you will
  take it often."
- Good: "It waits for a full van. Add 40 minutes to a travel day that is
  already long."
- Bad: "May be less convenient." — names nothing, costs nothing, persuades
  nobody.

If you cannot write a specific tradeoff, the hack is probably not real.

## `boards.json` — 6 `VibeBoard` objects

```json
{
  "id": "sun-bleached",
  "title": "Sun-Bleached Coastal",
  "note": "Water you can get into and a book you might finish.",
  "chips": ["slow water", "no schedule", "long light"],
  "caption": "board / white cubes above water",
  "art": { "sky": "#1E6F8C", "accent": "#F4E3C4", "motif": "waves" },
  "tags": { "beach": 5, "relaxation": 5, "nature": 3, "activity": 1, "planningStyle": 0 }
}
```

`tags` is a **partial** profile vector: list only the dimensions this board
actually signals, 0–5. A picked board adds `+2 × (strength / 5)` per dimension.

Do not put `budgetSensitivity` on a board. It comes from the onboarding budget
tier — asking for price-sensitivity through photographs was the weakest part of
the quiz this replaced.

Keep the six spread across the archetypes, or every profile converges.

## `swipes.json` — 8 `SwipePhoto` objects

```json
{
  "id": "empty-sand",
  "label": "Footprints and nothing else",
  "caption": "photo / footprints and nothing else",
  "art": { "sky": "#1D7E93", "accent": "#EFDFC0", "motif": "dune" },
  "tags": { "beach": 5, "relaxation": 4, "nature": 3 }
}
```

A crush adds `+1.5 × (strength / 5)`; a pass subtracts `1 × (strength / 5)`.
Two to four tags each — a photo that signals everything signals nothing.

## Normalisation, and why it matters

After boards and swipes are summed, the vector is scaled so the traveller's
**strongest** dimension reads 5. Someone who picks one board and someone who
picks four both end up peaking at 5, so clicking more cannot inflate every
match score.

`budgetSensitivity` is set separately from `constraints.budgetTier`
(1 → 5, 2 → 3, 3 → 1) and is not normalised.

## Validating by hand

```bash
node --input-type=module -e '
import fs from "node:fs";
const trips = JSON.parse(fs.readFileSync("src/data/trips.json","utf8"));
for (const t of trips) {
  if (!t.hacks?.length) console.log(t.id, "has no hacks");
  for (const h of t.hacks ?? []) {
    if (!h.tradeoff?.trim()) console.log(t.id, h.id, "missing tradeoff");
    if (!h.risk?.trim())     console.log(t.id, h.id, "missing risk");
  }
}
console.log(trips.length, "trips checked");
'
```
