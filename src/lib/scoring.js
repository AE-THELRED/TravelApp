/**
 * Match scoring — Person 1.
 *
 * Pure and deterministic: the same inputs always produce the same score.
 * No randomness, no Date.now(), no LLM. The "intelligence" the user perceives
 * comes from the reasons being shown, not from the math being clever.
 *
 * Ranking is VIBE-FIRST by design. Savings never enter this function — a cheap
 * trip you would hate is not a match. Money is the second act, in cost.js.
 */

import quiz from "../data/quiz.json";

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

/**
 * Turn quiz answers into a traveler tag vector.
 * Answers are averaged per dimension rather than summed, so a dimension that
 * appears in four questions cannot drown out one that appears in two.
 *
 * @param {Record<string, string>} answers questionId -> optionId
 * @returns {import("./types.js").ProfileTags}
 */
export function buildProfileTags(answers) {
  const totals = emptyTags();
  const counts = emptyTags();

  for (const question of quiz.questions) {
    const chosenId = answers[question.id];
    if (!chosenId) continue;
    const option = question.options.find((o) => o.id === chosenId);
    if (!option) continue;

    for (const [key, value] of Object.entries(option.weights)) {
      if (!(key in totals)) continue;
      totals[key] += value;
      counts[key] += 1;
    }
  }

  const tags = emptyTags();
  for (const key of Object.keys(tags)) {
    tags[key] = counts[key] > 0 ? totals[key] / counts[key] : 0;
  }
  return tags;
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
  const budgetCloseness = 1 - Math.abs(sensitivity - friendly) / 5;
  // A price-driven traveler on a cheap trip scores full marks. An indifferent
  // traveler is not penalised either way, so half marks is the neutral floor.
  const budgetFit = sensitivity >= 3 ? Math.max(0, budgetCloseness) : 0.7;
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
