/**
 * True-cost and Hack Stack math — done, verified.
 *
 * Every number the user sees comes from here. Two rules:
 *   1. Round once, at the end. Rounding per line item makes the group total
 *      disagree with per-person × travelers, and someone will notice on stage.
 *   2. A hack is only OFFERED if its `requires` are satisfied. Availability is
 *      computed here, not in the component, so the deck and the detail agree.
 */

/** Hacked totals never fall below this share of base. Nothing is ever free. */
const FLOOR_RATIO = 0.35;

/** Total humans on the trip. */
export function travelerCount(constraints) {
  if (!constraints) return 1;
  return Math.max(1, (constraints.adults || 0) + (constraints.children || 0));
}

/**
 * Itemised GROUP total before any hacks.
 *
 * lodgingPerNight is the whole-unit nightly rate, so it is NOT multiplied by
 * traveler count — that is exactly why splitting a rental gets cheaper per head.
 * Everything else is per person.
 *
 * @returns {{ total: number, lines: {label: string, amount: number, note: string}[] }}
 */
export function baseCost(trip, constraints) {
  const travelers = travelerCount(constraints);
  const nights = Math.max(1, constraints?.nights ?? 3);
  const c = trip.cost;

  const lines = [
    {
      label: trip.travelMode === "drive" ? "Gas & tolls" : "Airfare",
      amount: c.airfare * travelers,
      note:
        trip.travelMode === "drive"
          ? `$${c.airfare} each, round trip`
          : `$${c.airfare} per person, round trip`,
    },
    {
      label: "Lodging",
      amount: c.lodgingPerNight * nights,
      note: `$${c.lodgingPerNight}/night × ${nights} ${nights === 1 ? "night" : "nights"}, split ${travelers} ${travelers === 1 ? "way" : "ways"}`,
    },
    {
      label: "Food",
      amount: c.foodPerDay * nights * travelers,
      note: `$${c.foodPerDay} per person per day`,
    },
    {
      label: "Local transit",
      amount: c.localTransit * travelers,
      note: `$${c.localTransit} per person`,
    },
    {
      label: "Fees",
      amount: c.fees * travelers,
      note: "Cleaning, resort, and booking fees",
    },
  ].filter((line) => line.amount > 0);

  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  return { total, lines };
}

/**
 * Is this hack offered, given the user's constraints?
 * An unmet requirement hides the hack entirely rather than greying it out —
 * a solo traveler should never see "split a two-bedroom" at all.
 */
export function isHackAvailable(hack, constraints) {
  const req = hack.requires ?? {};
  if (req.flexibleDates && !constraints?.flexibleDates) return false;
  if (req.minTravelers && travelerCount(constraints) < req.minTravelers) return false;
  if (req.minNights && (constraints?.nights ?? 0) < req.minNights) return false;
  return true;
}

/** Only the hacks this user can actually take. */
export function availableHacks(trip, constraints) {
  return trip.hacks.filter((hack) => isHackAvailable(hack, constraints));
}

/** Group-level savings from one hack. */
function hackSavings(hack, constraints, baseTotal) {
  const travelers = travelerCount(constraints);
  if (typeof hack.savingsAmount === "number") {
    return hack.appliesPerPerson ? hack.savingsAmount * travelers : hack.savingsAmount;
  }
  if (typeof hack.savingsPercent === "number") {
    return (baseTotal * hack.savingsPercent) / 100;
  }
  return 0;
}

/**
 * Apply the enabled hacks and return everything the UI needs to render both
 * the true-cost card and the tradeoff list.
 *
 * Unavailable hacks are ignored even if their id is still in enabledHackIds —
 * a user can save a trip for four, then edit down to one, and the stale
 * group-split id must not keep discounting the total.
 *
 * @returns {import("./types.js").CostResult}
 */
export function applyHacks(trip, constraints, enabledHackIds = []) {
  const travelers = travelerCount(constraints);
  const { total: baseTotal, lines } = baseCost(trip, constraints);

  const enabled = availableHacks(trip, constraints).filter((h) => enabledHackIds.includes(h.id));

  const rawSavings = enabled.reduce(
    (sum, hack) => sum + hackSavings(hack, constraints, baseTotal),
    0,
  );

  const floor = baseTotal * FLOOR_RATIO;
  const hackedTotal = Math.max(floor, baseTotal - rawSavings);
  const savings = baseTotal - hackedTotal;

  return {
    baseTotal: Math.round(baseTotal),
    hackedTotal: Math.round(hackedTotal),
    perPerson: Math.round(hackedTotal / travelers),
    basePerPerson: Math.round(baseTotal / travelers),
    savings: Math.round(savings),
    lines: lines.map((line) => ({ ...line, amount: Math.round(line.amount) })),
    tradeoffs: enabled.map((h) => ({ title: h.title, tradeoff: h.tradeoff, risk: h.risk })),
  };
}

/** Per-person total with no hacks applied. Used on deck cards. */
export function basePerPerson(trip, constraints) {
  const { total } = baseCost(trip, constraints);
  return Math.round(total / travelerCount(constraints));
}

/**
 * Best-case per-person price if every available hack were taken.
 * Shown on the deck as "as low as" — the promise the Hack Stack then delivers.
 */
export function bestPerPerson(trip, constraints) {
  const ids = availableHacks(trip, constraints).map((h) => h.id);
  return applyHacks(trip, constraints, ids).perPerson;
}

/** $1,234 */
export function money(amount) {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}
