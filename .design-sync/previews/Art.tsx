import { Art } from "roamance";

// Every record below is a real one, lifted from src/data/boards.json,
// src/data/swipes.json and src/data/trips.json — the same objects the app
// renders — so these cards show exactly what Art does in production.
//
// Note what the motif prop is doing here: nothing visible, on purpose. Art is
// a deliberate stub that draws the stripe placeholder for every motif (see
// docs/ASSETS.md). What varies card to card is the sky/accent pair, which is
// what actually carries a destination's colour today. When real motifs land,
// this file is where the sweep belongs.

const frame = (width: string) => ({ width, maxWidth: "100%" });

/** The 4:3 default, as it appears in the "Your Type" vibe-board grid. */
export const VibeBoard = () => (
  <div style={frame("260px")}>
    <Art
      art={{ sky: "#1E6F8C", accent: "#F4E3C4", motif: "waves" }}
      caption="board / white cubes above water"
    />
  </div>
);

/** 16:9, the shape a trip card uses above its title and match score. */
export const TripCard = () => (
  <div style={frame("380px")}>
    <Art
      art={{ sky: "#2A1B3D", accent: "#E8B44A", motif: "brass" }}
      caption="board / trumpet under a bar sign"
      className="art--wide"
    />
  </div>
);

/** 3:4, the portrait shape the swipe deck deals one card at a time. */
export const SwipePhoto = () => (
  <div style={frame("200px")}>
    <Art
      art={{ sky: "#2C8CA6", accent: "#F7E2B8", motif: "palm" }}
      caption="photo / hammock strung between palms"
      className="art--tall"
    />
  </div>
);

/**
 * Four destinations side by side. This is the cell that shows the colour pair
 * doing the work — coastal blue, brass night, ridge haze, southern green — and
 * that the caption chip stays legible on all of them.
 */
export const AcrossTheSet = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
    {[
      { sky: "#1D7E93", accent: "#EFDFC0", motif: "dune", caption: "photo / footprints and nothing else" },
      { sky: "#2A1B3D", accent: "#E8B44A", motif: "brass", caption: "board / trumpet under a bar sign" },
      { sky: "#3B4E63", accent: "#C7D6C0", motif: "ridge", caption: "board / blue ridges stacked in haze" },
      { sky: "#2F4A33", accent: "#D9C89A", motif: "oak", caption: "board / oak branches over a brick lane" },
    ].map(({ caption, ...art }) => (
      <div key={art.motif} style={frame("170px")}>
        <Art art={art} caption={caption} />
      </div>
    ))}
  </div>
);
