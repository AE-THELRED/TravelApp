import { SHARED_TAGS } from "../lib/scoring.js";

const LABEL = {
  food: "Food",
  nightlife: "Nightlife",
  nature: "Nature",
  culture: "Culture",
  beach: "Beach",
  relaxation: "Slow pace",
  activity: "Activity",
};

/**
 * The live "your vibe profile" readout beside the swipe deck.
 *
 * Bar width is the tag weight normalised to the 0–5 scale scoring uses, so what
 * the user watches move here is literally the vector their matches are ranked
 * against — not a decorative summary of it.
 *
 * @param {Object} props
 * @param {import("../lib/types.js").ProfileTags} props.tags
 */
export default function TagMeters({ tags }) {
  const rows = SHARED_TAGS.map((key) => ({ key, value: tags?.[key] ?? 0 })).sort(
    (a, b) => b.value - a.value,
  );

  return (
    <div className="meters">
      {rows.map(({ key, value }) => (
        <div className="meter" key={key}>
          <span className="meter__label">{LABEL[key]}</span>
          <span className="meter__track">
            <span className="meter__fill" style={{ width: `${(value / 5) * 100}%` }} />
          </span>
        </div>
      ))}
    </div>
  );
}
