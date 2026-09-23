/**
 * Match scoring — Person 1.
 *
 * Pure and deterministic: the same inputs always produce the same score.
 * No randomness, no Date.now(), no LLM. The "intelligence" the user perceives
 * comes from the reasons being shown, not from the math being clever.
 *
 * The traveler profile comes from vibe boards + swipe refinement, not a quiz.
 * Ranking is VIBE-FIRST by design. Savings never enter this function — a cheap
 * trip you would hate is not a match. Money is the second act, in cost.js.
 */

import boards from "../data/boards.json";
import swipes from "../data/swipes.json";

/** The seven dimensions a trip and a traveler are both scored on. */
export const SHARED_TAGS = [
  "food",
  "nightlife",
  "nature",
  "culture",
  "beach",
  "relaxation",
  "activity",
];

/** Empty profile tag vector. */
function emptyTags() {
  return {
    food: 0,
    nightlife: 0,
    nature: 0,
    culture: 0,
    beach: 0,
    relaxation: 0,
    activity: 0,
    budgetSensitivity: 0,
    planningStyle: 0,
  };
}

/** How much each signal moves a tag, before normalisation. */
const BOARD_WEIGHT = 2;
const SWIPE_YES_WEIGHT = 1.5;
const SWIPE_NO_WEIGHT = -1;

/**
 * The onboarding budget tier IS the budget signal. Vibe boards are about
 * aesthetics; asking someone to express price-sensitivity through photographs
 * is worse than just reading the number they already gave us.
 * 1 = keep it cheap, 2 = comfortable middle, 3 = treat ourselves.
 */
const BUDGET_SENSITIVITY_BY_TIER = { 1: 5, 2: 3, 3: 1 };

/** Add one board's or photo's tags into the running totals, scaled by weight. */
function addSignal(totals, tags, weight) {
  for (const [key, strength] of Object.entries(tags ?? {})) {
    if (!(key in totals)) continue;
    totals[key] += weight * (strength / 5);
  }
}

const clamp05 = (n) => Math.max(0, Math.min(5, n));

/**
 * Turn vibe-board picks and swipe verdicts into a traveler tag vector.
 *
 * Two stages, matching the two screens:
 *   1. Boards are the coarse signal — each picked board pushes its tags up.
 *   2. Swipes refine — a yes nudges up, a no pulls down.
 *
 * Totals are then normalised so the traveler's STRONGEST dimension reads as 5.
 * This is what keeps scoring honest across very different players: someone who
 * picks one board and someone who picks four should both end up with a profile
 * whose peak is 5, or the four-board player would out-score every trip simply
 * by having clicked more.
 *
 * `budgetSensitivity` is not normalised — it comes straight from the tier.
 *
 * @param {string[]} picks Selected board ids.
 * @param {Record<string, boolean>} likes photoId -> true (crush) | false (not my type).
 * @param {import("./types.js").TripConstraints|null} constraints
 * @returns {import("./types.js").ProfileTags}
 */
export function buildProfileTags(picks = [], likes = {}, constraints = null) {
  const totals = emptyTags();

  for (const board of boards.boards) {
    if (!picks.includes(board.id)) continue;
    addSignal(totals, board.tags, BOARD_WEIGHT);
  }

  for (const photo of swipes.photos) {
    const verdict = likes[photo.id];
    if (verdict === undefined || verdict === null) continue;
    addSignal(totals, photo.tags, verdict ? SWIPE_YES_WEIGHT : SWIPE_NO_WEIGHT);
  }

  // Scale off the seven shared dimensions only. planningStyle rides along on
  // the same factor but never sets it — it is display copy, not a match input.
  const peak = Math.max(0, ...SHARED_TAGS.map((k) => totals[k]));
  const scale = peak > 0 ? 5 / peak : 0;

  const tags = emptyTags();
  for (const key of SHARED_TAGS) {
    tags[key] = clamp05(totals[key] * scale);
  }
  tags.planningStyle = peak > 0 ? clamp05(totals.planningStyle * scale) : 2.5;
  tags.budgetSensitivity = BUDGET_SENSITIVITY_BY_TIER[constraints?.budgetTier] ?? 3;

  return tags;
}

/**
 * Convenience wrapper: the object shape `scoreTrip` and `rankTrips` expect.
 * Call it inside a `useMemo` — it is derived, never stored.
 *
 * @returns {import("./types.js").TravelerProfile}
 */
export function buildProfile(picks, likes, constraints) {
  return { picks: picks ?? [], likes: likes ?? {}, tags: buildProfileTags(picks, likes, constraints) };
}

/** Has the traveler given us enough to rank anything? One board is the floor. */
export function hasVibe(picks) {
  return Array.isArray(picks) && picks.length > 0;
}

/** Total humans on the trip. */
export function travelerCount(constraints) {
  if (!constraints) return 1;
  return Math.max(1, (constraints.adults || 0) + (constraints.children || 0));
}

/**
 * Score one trip against a traveler profile. Returns 0–100 plus the reasons
 * that drove it, used verbatim as the "why you match" copy.
 *
 * Budget of 100 points:
 *   45  tag overlap across the seven shared dimensions
 *   25  budget fit (traveler price-sensitivity vs. how cheap the trip is)
 *   20  stay-length fit
 *   10  group and age suitability
 *
 * @param {import("./types.js").TravelerProfile} profile
 * @param {import("./types.js").Trip} trip
 * @param {import("./types.js").TripConstraints} constraints
 * @returns {{ score: number, reasons: string[] }}
 */
export function scoreTrip(profile, trip, constraints) {
  const reasons = [];
  const p = profile?.tags ?? emptyTags();
  const t = trip.tags ?? {};

  // --- Tag overlap, 45 points -------------------------------------------
  // Cosine-style closeness per dimension, weighted by how much the traveler
  // cares about it. Someone who scored 0 on beach is not penalised for a trip
  // with no beach; they are simply not rewarded for one.
  let weighted = 0;
  let weightTotal = 0;
  for (const key of SHARED_TAGS) {
    const want = p[key] ?? 0;
    const has = t[key] ?? 0;
    if (want <= 0) continue;
    const closeness = 1 - Math.abs(want - has) / 5; // 0..1
    weighted += want * Math.max(0, closeness);
    weightTotal += want;
  }
  const overlap = weightTotal > 0 ? weighted / weightTotal : 0.5;
  let score = overlap * 45;

  // Name the two dimensions the traveler cares most about that this trip delivers.
  const delivered = SHARED_TAGS.filter((k) => (p[k] ?? 0) >= 3 && (t[k] ?? 0) >= 4).sort(
    (a, b) => (t[b] ?? 0) - (t[a] ?? 0),
  );
  for (const key of delivered.slice(0, 2)) {
    reasons.push(REASON_COPY[key]);
  }

  // --- Budget fit, 25 points --------------------------------------------
  // profile.budgetSensitivity (how much they care) vs trip.budgetFriendly (how cheap it is).
  const sensitivity = p.budgetSensitivity ?? 0;
  const friendly = t.budgetFriendly ?? 3;
  // Being cheap must never COST a trip points. The old form of this was
  // `1 - |sensitivity - friendly| / 5`, which scored an expensive trip highest
  // for a mid-budget traveler and pushed genuinely cheap matches down the deck.
  // Instead: how much you care scales how much an expensive trip hurts.
  const care = sensitivity / 5; // 0 = money is no object, 1 = every dollar counts
  const cheap = friendly / 5; // 0 = expensive, 1 = very budget-friendly
  const budgetFit = Math.max(0, 1 - care * (1 - cheap));
  score += budgetFit * 25;
  if (sensitivity >= 4 && friendly >= 4) {
    reasons.push("stretches a tight budget");
  }

  // --- Stay-length fit, 20 points ---------------------------------------
  const nights = constraints?.nights ?? 3;
  const [minStay, maxStay] = trip.idealStay;
  let nightsOff = 0;
  if (nights < minStay) nightsOff = minStay - nights;
  else if (nights > maxStay) nightsOff = nights - maxStay;
  score += Math.max(0, 20 - nightsOff * 7);
  if (nightsOff === 0) {
    reasons.push(`built for ${minStay}–${maxStay} nights`);
  }

  // --- Group and age fit, 10 points -------------------------------------
  const travelers = travelerCount(constraints);
  const kids = constraints?.children ?? 0;
  let groupPoints = 10;

  if (kids > 0) {
    const familyScore = t.familyFriendly ?? 2;
    groupPoints -= (5 - familyScore) * 1.6;
    if (familyScore >= 4) reasons.push("works with kids along");
  }
  if (travelers >= 3 && !trip.groupFriendly) {
    groupPoints -= 4;
  }
  groupPoints -= Math.min(3, Math.abs(travelers - trip.recommendedGroupSize) * 0.6);
  score += Math.max(0, groupPoints);

  if (travelers >= 3 && trip.groupFriendly && travelers === trip.recommendedGroupSize) {
    reasons.push(`sized right for ${travelers}`);
  }

  return { score: Math.max(0, Math.min(100, score)), reasons: reasons.slice(0, 3) };
}

const REASON_COPY = {
  food: "food-forward",
  nightlife: "stays up late",
  nature: "gets you outside",
  culture: "dense with things to see",
  beach: "real beach time",
  relaxation: "genuinely restorative",
  activity: "matches your pace",
};

/**
 * Rank every trip. Returns all of them, sorted best-first — the deck is the
 * full set reordered, not a filtered subset.
 *
 * Displayed scores are compressed into 62–97 so nothing reads as a dead card
 * or a suspicious 100%. Ordering is unaffected.
 *
 * @returns {import("./types.js").RankedTrip[]}
 */
export function rankTrips(trips, profile, constraints) {
  const scored = trips.map((trip) => {
    const { score, reasons } = scoreTrip(profile, trip, constraints);
    return { trip, rawScore: score, reasons };
  });

  scored.sort((a, b) => {
    if (b.rawScore !== a.rawScore) return b.rawScore - a.rawScore;
    return a.trip.city.localeCompare(b.trip.city); // stable, alphabetical tiebreak
  });

  const raws = scored.map((s) => s.rawScore);
  const lo = Math.min(...raws);
  const hi = Math.max(...raws);
  const span = hi - lo;

  return scored.map((s) => {
    const t = span > 0 ? (s.rawScore - lo) / span : 0.5;
    return {
      trip: s.trip,
      matchScore: Math.round(62 + t * 35),
      reasons: s.reasons.length ? s.reasons : ["a reasonable all-rounder for your answers"],
    };
  });
}
