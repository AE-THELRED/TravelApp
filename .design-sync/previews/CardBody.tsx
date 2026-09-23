import { Art, Card, CardBody, Chip } from "roamance";

// CardBody is only ever meaningful inside a Card — on its own it is an unpadded
// flex column against the page ground, which tells you nothing. Both cells show
// it in the parent that gives it meaning.

/** What CardBody is for: the padded region under art that runs to the edges. */
export const UnderArt = () => (
  <div style={{ maxWidth: "320px" }}>
    <Card>
      <Art
        art={{ sky: "#1E6F8C", accent: "#F4E3C4", motif: "waves" }}
        caption="board / white cubes above water"
        className="art--wide"
      />
      <CardBody>
        <strong>Isla Mujeres</strong>
        <p className="muted" style={{ margin: 0, fontSize: "13px" }}>
          Quintana Roo, Mexico · 4–6 nights
        </p>
        <Chip tone="match">97%</Chip>
      </CardBody>
    </Card>
  </div>
);

/**
 * The contrast worth seeing: with CardBody the content is inset on all four
 * sides; without it, text sits hard against the card's border. That asymmetry
 * is the whole reason the two are separate components — Art needs the flush
 * edge, text never does.
 */
export const AgainstAnUnpaddedCard = () => (
  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start", flexWrap: "wrap" }}>
    <div style={{ width: "220px" }}>
      <span className="eyebrow">With CardBody</span>
      <Card>
        <CardBody>
          <p style={{ margin: 0, fontSize: "13px" }}>
            Inset by --space-4 on all four sides.
          </p>
        </CardBody>
      </Card>
    </div>
    <div style={{ width: "220px" }}>
      <span className="eyebrow">Without</span>
      <Card>
        <p style={{ margin: 0, fontSize: "13px" }}>
          Text runs into the border. Correct for art, wrong for copy.
        </p>
      </Card>
    </div>
  </div>
);
