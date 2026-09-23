/**
 * Card — the surface a match, a vibe board, or a saved trip sits on.
 *
 * Deliberately unpadded: `.card` clips its children, so <Art> can run to the
 * edges of the top of the card. Padding belongs to the content, which is what
 * <CardBody> is for.
 *
 *   <Card>
 *     <Art ... className="art--wide" />
 *     <CardBody> ... </CardBody>
 *   </Card>
 *
 * @param {Object} props
 * @param {string} [props.className]
 */
export function Card({ className = "", ...rest }) {
  return <article className={`card ${className}`.trim()} {...rest} />;
}

/**
 * The padded, vertically-stacked region under a card's art.
 *
 * @param {Object} props
 * @param {string} [props.className]
 */
export function CardBody({ className = "", ...rest }) {
  return <div className={`card__body ${className}`.trim()} {...rest} />;
}

export default Card;
