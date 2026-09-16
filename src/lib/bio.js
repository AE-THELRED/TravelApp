/**
 * Matchmaker copy — Person 1.
 *
 * No LLM at runtime. `trip.tripBio` is pre-authored and committed; this module
 * only assembles the personalised sentence that follows it, from template
 * fragments keyed on the reasons scoring already produced.
 *
 * Keeping generation out of the runtime is what stops the app from inventing
 * travel claims or prices it cannot back up.
 */

import { travelerCount } from "./cost.js";

/**
 * The line under the bio: why this trip, for this person, right now.
 * @param {import("./types.js").RankedTrip} ranked
 * @param {import("./types.js").TripConstraints} constraints
 * @returns {string}
 */
export function buildMatchLine(ranked, constraints) {
  const { reasons, matchScore } = ranked;
  const travelers = travelerCount(constraints);
  const nights = constraints?.nights ?? 3;

  const who = travelers === 1 ? "you" : `all ${travelers} of you`;
  const list = joinPhrases(reasons);

  if (matchScore >= 90) {
    return `A ${matchScore}% match: ${list}. ${capitalize(who)} for ${nights} ${nights === 1 ? "night" : "nights"}.`;
  }
  if (matchScore >= 75) {
    return `${capitalize(list)} — a strong fit for ${who} over ${nights} ${nights === 1 ? "night" : "nights"}.`;
  }
  return `Worth a look: ${list}. Not your top match, but it fits the ${nights}-night window.`;
}

/**
 * Short chip text for the deck card, e.g. "food-forward · stays up late".
 */
export function reasonChips(reasons) {
  return reasons.slice(0, 2).join(" · ");
}

/** "a, b and c" */
function joinPhrases(items) {
  if (!items.length) return "a reasonable all-rounder";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
