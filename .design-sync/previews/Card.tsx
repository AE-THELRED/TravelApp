import { Art, Card, CardBody, Chip, EstimateBadge } from "roamance";

/**
 * The composition the deck actually renders: art to the card's edges, then a
 * padded body. This is the canonical use — art first, CardBody second.
 */
export const MatchCard = () => (
  <div style={{ maxWidth: "340px" }}>
    <Card>
      <Art
        art={{ sky: "#2A1B3D", accent: "#E8B44A", motif: "brass" }}
        caption="board / trumpet under a bar sign"
        className="art--wide"
      />
      <CardBody>
        <div className="row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong>New Orleans</strong>
          <Chip tone="match">97%</Chip>
        </div>
        <p className="muted" style={{ margin: 0, fontSize: "13px" }}>Louisiana, USA · 3–4 nights</p>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          <Chip>food-forward</Chip>
          <Chip>stays up late</Chip>
        </div>
        <p className="tabular" style={{ margin: 0, fontSize: "18px" }}>
          $1,870 <span className="muted" style={{ fontSize: "13px" }}>· $468 per person</span>
        </p>
        <EstimateBadge />
      </CardBody>
    </Card>
  </div>
);

/** Two in a row, which is how the saved screen compares them. */
export const SideBySide = () => (
  <div className="grid-2" style={{ maxWidth: "520px" }}>
    {[
      { city: "Gulf Shores", region: "Alabama, USA", score: "94%", art: { sky: "#1D7E93", accent: "#EFDFC0", motif: "dune" }, caption: "photo / footprints and nothing else", base: "$1,530", each: "$383" },
      { city: "Asheville", region: "North Carolina, USA", score: "91%", art: { sky: "#3B4E63", accent: "#C7D6C0", motif: "ridge" }, caption: "board / blue ridges stacked in haze", base: "$1,300", each: "$325" },
    ].map((t) => (
      <Card key={t.city}>
        <Art art={t.art} caption={t.caption} className="art--wide" />
        <CardBody>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>{t.city}</strong>
            <Chip tone="match">{t.score}</Chip>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: "13px" }}>{t.region}</p>
          <p className="tabular" style={{ margin: 0 }}>{t.base} <span className="muted" style={{ fontSize: "13px" }}>· {t.each} each</span></p>
          <EstimateBadge />
        </CardBody>
      </Card>
    ))}
  </div>
);

/** No art — a card used purely as a surface, as the saved list does. */
export const TextOnly = () => (
  <div style={{ maxWidth: "320px" }}>
    <Card>
      <CardBody>
        <span className="eyebrow">Saved</span>
        <strong>Isla Mujeres</strong>
        <p className="tabular" style={{ margin: 0 }}>
          <span className="muted" style={{ textDecoration: "line-through" }}>$1,790</span> $1,650
        </p>
        <Chip tone="risk">adds transit time</Chip>
        <EstimateBadge />
      </CardBody>
    </Card>
  </div>
);
