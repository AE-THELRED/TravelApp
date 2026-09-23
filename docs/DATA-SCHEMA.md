# Travel Hacker – trips.json Construction Guide

This document specifies how to build the static `trips.json` data file used by the Travel Hacker prototype. It describes the schema, required fields, and examples for trip profiles and hack stacks.

---

## File location and usage

- Place the file at `src/data/trips.json` (or similar path).
- Import it into the app via:
  - `import trips from "../data/trips.json";` in React/Next.js components.
- The file contains **an array of Trip objects**.

---

## Trip object schema

Each Trip represents one potential travel "match" (card). The schema is designed to be simple but expressive.

```ts
Trip = {
  id: string,
  city: string,
  country: string,

  // Visual / descriptive
  photos: string[],
  tags: {
    food?: number,
    nightlife?: number,
    nature?: number,
    culture?: number,
    beach?: number,
    relaxation?: number,
    activity?: number,
    familyFriendly?: number,
    budgetFriendly?: number,
  },

  tripBio: string,

  // Trip shape
  idealStay: [number, number], // min and max nights
  groupFriendly: boolean,
  recommendedGroupSize: number,

  // Cost model
  baseCostPerPerson: number,
  currency: string,

  // Hack Stack
  hacks: Hack[],
}

Hack = {
  id: string,
  title: string,
  description: string,

  type: "dateFlex" | "altAirport" | "altLodgingArea" | "groupSplit" | "offSeason" | "transportChoice" | "misc",

  savingsAmount?: number,    // absolute savings in currency per person or trip
  savingsPercent?: number,   // relative savings percentage

  appliesPerPerson?: boolean,

  tradeoff: string,
}
```

Notes:
- `tags` are numeric weights (e.g., 0–5) indicating how strongly the trip reflects that characteristic.
- Either `savingsAmount` or `savingsPercent` should be provided; the UI can interpret these to adjust cost.

---

## Example Trip – New Orleans Long Weekend

```json
{
  "id": "new-orleans-weekend",
  "city": "New Orleans",
  "country": "USA",
  "photos": [
    "/images/nola-1.jpg",
    "/images/nola-2.jpg",
    "/images/nola-3.jpg"
  ],
  "tags": {
    "food": 5,
    "nightlife": 5,
    "culture": 4,
    "relaxation": 2,
    "activity": 4,
    "budgetFriendly": 3
  },
  "tripBio": "A charismatic long-weekend match: brass bands, beignets, and a walkable neighborhood mix that keeps the group chat alive.",
  "idealStay": [3, 4],
  "groupFriendly": true,
  "recommendedGroupSize": 4,
  "baseCostPerPerson": 540,
  "currency": "USD",
  "hacks": [
    {
      "id": "nola-date-flex",
      "title": "Fly midweek instead of Friday",
      "description": "Shift your departure and return by 1–2 days to avoid peak weekend fares.",
      "type": "dateFlex",
      "savingsAmount": 85,
      "appliesPerPerson": true,
      "tradeoff": "Less convenient timing with work or school schedules."
    },
    {
      "id": "nola-alt-lodging",
      "title": "Stay just outside the French Quarter",
      "description": "Choose a neighborhood 10–15 minutes away to drop nightly rates.",
      "type": "altLodgingArea",
      "savingsAmount": 60,
      "appliesPerPerson": false,
      "tradeoff": "Slightly more transit time and less direct access to nightlife."
    },
    {
      "id": "nola-group-split",
      "title": "Share a two-bedroom rental",
      "description": "Swap hotel rooms for a shared rental and split the cost across the group.",
      "type": "groupSplit",
      "savingsPercent": 15,
      "appliesPerPerson": true,
      "tradeoff": "Less privacy and shared common spaces."
    }
  ]
}
```

---

## Example Trip – Beach Reset (Generic)

```json
{
  "id": "beach-reset",
  "city": "Playa Azul",
  "country": "Mexico",
  "photos": [
    "/images/beach-1.jpg",
    "/images/beach-2.jpg"
  ],
  "tags": {
    "beach": 5,
    "relaxation": 5,
    "activity": 2,
    "food": 3,
    "budgetFriendly": 4,
    "nightlife": 1
  },
  "tripBio": "A soft-landing beach reset: hammocks, sunset tacos, and just enough structure to keep travel simple.",
  "idealStay": [4, 7],
  "groupFriendly": false,
  "recommendedGroupSize": 2,
  "baseCostPerPerson": 620,
  "currency": "USD",
  "hacks": [
    {
      "id": "beach-off-season",
      "title": "Travel during shoulder season",
      "description": "Pick dates just outside peak season for lower prices and fewer crowds.",
      "type": "offSeason",
      "savingsPercent": 20,
      "appliesPerPerson": true,
      "tradeoff": "Weather may be less predictable."
    },
    {
      "id": "beach-transport-choice",
      "title": "Use local buses instead of taxis",
      "description": "Swap airport and in-town taxis for well-rated local buses.",
      "type": "transportChoice",
      "savingsAmount": 40,
      "appliesPerPerson": false,
      "tradeoff": "More time spent in transit and less direct routes."
    }
  ]
}
```

---

## Building the full trips.json

Steps for collaborators:

1. **Decide on 8–12 trips** that cover a range of vibes:
   - Budget city weekends.
   - Beach resets.
   - Culture-focused city breaks.
   - Outdoors/adventure.
   - Festival or nightlife trips.

2. **For each trip, fill out:**
   - `id`, `city`, `country`.
   - `photos` list (paths to local images).
   - `tags` weights (0–5 scale).
   - `tripBio` (1–2 sentences).
   - `idealStay`, `groupFriendly`, `recommendedGroupSize`.
   - `baseCostPerPerson`, `currency`.
   - 2–4 `hacks` with realistic savings + clear tradeoffs.

3. **Keep numbers plausible but obviously prototype-level.**
   - Round to simple values (e.g., 540, 620) instead of exact fares.
   - Savings should be intuitive (e.g., midweek travel cheaper, off-season cheaper).

4. **Validate the file:**
   - Run a small script or use Claude Code to check:
     - Unique `id` values.
     - Required fields present for each trip.
     - At least one hack per trip.

5. **Iterate:**
   - As the matching logic evolves, adjust `tags` and `baseCostPerPerson` to make scoring and Hack Stack behavior feel fun and believable.

---

## Minimal schema variant (if needed)

If the team wants an even simpler starting point, use this reduced schema and expand later:

```ts
Trip = {
  id: string,
  city: string,
  country: string,
  photos: string[],
  tags: {
    food?: number,
    nightlife?: number,
    nature?: number,
    beach?: number,
    relaxation?: number,
    activity?: number
  },
  tripBio: string,
  idealStay: [number, number],
  baseCostPerPerson: number,
  currency: string,
  hacks: Hack[]
}

Hack = {
  id: string,
  title: string,
  description: string,
  savingsAmount: number,
  tradeoff: string
}
```

Claude Code can then refactor the file as needed once the app logic stabilizes.

---

## Collaboration notes

- One collaborator can own the `trips.json` file, but everyone should be able to add or tweak trips via PRs.
- Use meaningful commit messages (e.g., "Add 3 new city weekend trips" instead of "update data").
- Keep `trips.json` small and readable to support quick iteration and AI-assisted refactors.


---

## Related docs

- [ARCHITECTURE.md](ARCHITECTURE.md) — where this file sits in the system
- [STATE.md](STATE.md) — the TypeScript types these objects must satisfy
- [ASSETS.md](ASSETS.md) — how `photos[]` paths map to `public/images/<trip-id>/`
