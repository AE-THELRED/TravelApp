/**
 * Persistence — Person 4. The ONLY module in the app that touches localStorage.
 *
 * One namespaced key holding one JSON blob: one read, one write, one place to
 * version. If the shape changes in a breaking way, bump VERSION and old data is
 * dropped rather than migrated.
 *
 * Only inputs are persisted. Match scores, bios, and totals are recomputed on
 * load — storing a derived number is how a demo ends up showing a stale price.
 *
 * Every access is wrapped: storage can be disabled (private windows), full
 * (quota), or hold corrupt JSON, and all three throw.
 */

const KEY = "roamance:v1:state";
const VERSION = 1;

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

/** @returns {Partial<import("./types.js").AppState>} */
export function loadState() {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed?.version !== VERSION) return {}; // drop incompatible data
    return {
      constraints: parsed.constraints ?? null,
      travelerProfile: parsed.travelerProfile ?? null,
      savedTrips: Array.isArray(parsed.savedTrips) ? parsed.savedTrips : [],
      deckIndex: typeof parsed.deckIndex === "number" ? parsed.deckIndex : 0,
    };
  } catch {
    return {}; // corrupt JSON or blocked storage — start clean, stay usable
  }
}

/** @param {import("./types.js").AppState} state */
export function saveState(state) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({
        version: VERSION,
        constraints: state.constraints,
        travelerProfile: state.travelerProfile,
        savedTrips: state.savedTrips,
        deckIndex: state.deckIndex,
      }),
    );
  } catch {
    /* quota exceeded or private-mode denial: fail silently, keep the app usable */
  }
}

export function clearState() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing we can do, and nothing worth breaking the demo over */
  }
}
