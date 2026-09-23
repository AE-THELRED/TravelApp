/**
 * Generated art — Phase A.
 *
 * Every image slot in this app (vibe boards, swipe photos, trip cards, the
 * detail hero) is drawn, not photographed. There is no `public/images/`, no
 * licensing to track, and nothing to 404 in the demo.
 *
 * THIS IS A STUB. It renders the diagonal-stripe placeholder from the design
 * handoff for every motif, which is deliberately good enough to build against:
 * Phase B can lay out trip cards today without waiting for Phase A to draw ten
 * scenes.
 *
 * Phase A: replace the inside of this component, motif by motif. Do NOT change
 * the props — three other screens already call it. Any motif you have not drawn
 * yet should keep falling through to the stripes, so the app is never broken,
 * only progressively less abstract.
 *
 * See docs/ASSETS.md for the motif list and what each one depicts.
 */

/**
 * @param {Object} props
 * @param {import("../lib/types.js").TripArt} props.art
 * @param {string} props.caption Names the photograph this stands in for. Rendered
 *   as a chip, and read out as the accessible label.
 * @param {string} [props.className]
 */
export default function Art({ art, caption, className = "" }) {
  const { sky = "#2A1B3D", accent = "#E8B44A", motif = "none" } = art ?? {};
  // Pattern ids must be unique per colour pair or two <Art> on one screen share
  // the first one's fill — SVG defs are global to the document.
  const patternId = `stripes-${motif}-${sky.replace("#", "")}-${accent.replace("#", "")}`;

  return (
    <div className={`art ${className}`} data-motif={motif}>
      <svg
        className="art__canvas"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={caption}
      >
        <defs>
          <pattern
            id={patternId}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="28" height="28" fill={sky} />
            <rect width="14" height="28" fill={accent} />
          </pattern>
        </defs>
        <rect width="400" height="300" fill={`url(#${patternId})`} opacity="0.55" />
      </svg>
      {caption && <span className="art__caption">{caption}</span>}
    </div>
  );
}
