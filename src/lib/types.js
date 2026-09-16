/**
 * Roamance — shared data contract.
 *
 * This file is the integration checkpoint. It has no runtime behavior; it exists
 * so every screen agrees on the same shapes. Editors read these JSDoc typedefs
 * and give you autocomplete without TypeScript.
 *
 * If you need a new field: change trips.json, this file, and DATA-SCHEMA.md in
 * the SAME commit, and tell the team.
 */

/**
 * Tag dimensions a TRIP is scored on. 0–5.
 * These seven are shared with the traveler profile and drive tag-overlap scoring.
 * @typedef {"food"|"nightlife"|"nature"|"culture"|"beach"|"relaxation"|"activity"} SharedTagKey
 */

/**
 * @typedef {Object} TripTags
 * @property {number} [food]
 * @property {number} [nightlife]
 * @property {number} [nature]
 * @property {number} [culture]
 * @property {number} [beach]
 * @property {number} [relaxation]
 * @property {number} [activity]
 * @property {number} [familyFriendly] Trip-only. Compared against traveler ages, not a profile tag.
 * @property {number} [budgetFriendly] Trip-only. Compared against profile.budgetSensitivity.
 */

/**
 * Tag dimensions a TRAVELER is scored on. 0–5.
 * Note the deliberate asymmetry with TripTags: `budgetSensitivity` and
 * `planningStyle` describe the person, not the place.
 * @typedef {Object} ProfileTags
 * @property {number} food
 * @property {number} nightlife
 * @property {number} nature
 * @property {number} culture
 * @property {number} beach
 * @property {number} relaxation
 * @property {number} activity
 * @property {number} budgetSensitivity 5 = very price-driven.
 * @property {number} planningStyle 5 = wants a fixed itinerary, 0 = follows the moment.
 */

/**
 * Per-person cost line items, in `currency`, EXCEPT lodgingPerNight.
 * lodgingPerNight is the nightly rate for the whole party's unit and is divided
 * by traveler count in cost.js — that is what makes group-splitting visible.
 * @typedef {Object} TripCost
 * @property {number} airfare Round trip, per person. For travelMode "drive", this is that person's share of gas and tolls.
 * @property {number} lodgingPerNight WHOLE-UNIT nightly rate. Divided by travelers.
 * @property {number} foodPerDay Per person, per night of stay.
 * @property {number} localTransit Per person, whole trip.
 * @property {number} fees Per person. Cleaning, resort, and booking fees.
 */

/**
 * Stated assumptions behind the estimate. Rendered verbatim on the true-cost
 * card — this is the honesty layer, not flavor text.
 * @typedef {Object} TripAssumptions
 * @property {string} baggage
 * @property {string} airportTransfer
 * @property {number} transitHours Door-to-door travel time one way, in hours.
 */

/**
 * Conditions under which a hack may be OFFERED. An unsatisfied condition hides
 * the hack entirely — a solo traveler never sees "split a rental".
 * @typedef {Object} HackRequires
 * @property {boolean} [flexibleDates] Requires constraints.flexibleDates === true.
 * @property {number} [minTravelers] Requires total travelers >= this.
 * @property {number} [minNights] Requires constraints.nights >= this.
 */

/**
 * @typedef {"dateFlex"|"altAirport"|"altLodgingArea"|"groupSplit"|"offSeason"|"transportChoice"|"packing"|"misc"} HackType
 */

/**
 * @typedef {Object} Hack
 * @property {string} id Unique within its trip.
 * @property {string} title Imperative and specific: "Fly Tuesday instead of Friday".
 * @property {string} description One sentence on the mechanism.
 * @property {HackType} type
 * @property {number} [savingsAmount] Takes precedence if both are present.
 * @property {number} [savingsPercent] Percent of base total.
 * @property {boolean} [appliesPerPerson] true: savings is per person. false: split across the group.
 * @property {string} tradeoff What it actually costs you. REQUIRED, non-empty.
 * @property {string} risk Short label for the card chip: "carry-on only", "arrives late". REQUIRED, non-empty.
 * @property {HackRequires} requires Empty object means always offered.
 */

/**
 * @typedef {Object} TripArt
 * @property {string} sky Background base color, hex.
 * @property {string} accent Foreground/highlight color, hex.
 * @property {"brass"|"mural"|"rowhouse"|"skyline"|"oak"|"waves"|"palm"|"dune"|"ferry"|"ridge"} motif Selects the generated SVG scene.
 */

/**
 * @typedef {Object} Trip
 * @property {string} id kebab-case, unique.
 * @property {string} city
 * @property {string} region
 * @property {"city"|"beach"|"outdoors"} archetype
 * @property {"fly"|"drive"} travelMode Controls whether the cost line reads "Airfare" or "Gas & tolls".
 * @property {TripArt} art
 * @property {TripTags} tags
 * @property {[number, number]} idealStay [minNights, maxNights]
 * @property {boolean} groupFriendly
 * @property {number} recommendedGroupSize
 * @property {string} currency
 * @property {TripCost} cost
 * @property {TripAssumptions} assumptions
 * @property {string} tripBio Pre-authored. Never generated at runtime.
 * @property {Hack[]} hacks 3–4 per trip.
 */

/**
 * @typedef {Object} TripConstraints
 * @property {string} departure
 * @property {"specific"|"region"|"surprise"} destinationPref
 * @property {string} [destinationValue]
 * @property {number} nights
 * @property {number} adults
 * @property {number} children
 * @property {number[]} childAges
 * @property {1|2|3} budgetTier
 * @property {boolean} flexibleDates Gates every dateFlex and offSeason hack.
 */

/**
 * @typedef {Object} TravelerProfile
 * @property {Record<string, string>} answers questionId -> optionId
 * @property {ProfileTags} tags Derived from answers via quiz.json weights.
 */

/**
 * @typedef {Object} SavedTrip
 * @property {string} tripId
 * @property {number} savedAt
 * @property {string[]} selectedHackIds
 */

/**
 * @typedef {Object} AppState
 * @property {TripConstraints|null} constraints
 * @property {TravelerProfile|null} travelerProfile
 * @property {SavedTrip[]} savedTrips
 * @property {number} deckIndex
 * @property {boolean} hydrated false until localStorage has been read.
 * @property {"landing"|"onboarding"|"quiz"|"matches"|"detail"|"saved"} screen
 * @property {string|null} activeTripId
 */

/**
 * Result of scoring one trip. All fields DERIVED — never persisted.
 * @typedef {Object} RankedTrip
 * @property {Trip} trip
 * @property {number} matchScore 0–100, already clamped for display.
 * @property {string[]} reasons Short "why you match" phrases.
 */

/**
 * Result of applying hacks. All fields DERIVED — never persisted.
 * @typedef {Object} CostResult
 * @property {number} baseTotal Group total before hacks.
 * @property {number} hackedTotal Group total after hacks. Never below the floor.
 * @property {number} perPerson hackedTotal / travelers, rounded once.
 * @property {number} basePerPerson
 * @property {number} savings baseTotal - hackedTotal.
 * @property {{label: string, amount: number, note: string}[]} lines Itemized group-total breakdown.
 * @property {{title: string, tradeoff: string, risk: string}[]} tradeoffs One per enabled hack.
 */

export {};
