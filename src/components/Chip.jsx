/**
 * Chip — a small label, in one of three roles.
 *
 * The roles are not interchangeable, and this component exists mainly to stop
 * them being mixed up:
 *
 *   neutral  a match reason — "food-forward", "built for 3–4 nights"
 *   match    the % score. Coral. At most one per card.
 *   risk     what a hack costs you — "carry-on only", "adds transit time".
 *            Gold, because gold is the money-and-honesty voice.
 *
 * A risk chip is never decorative. If you are reaching for one, there should be
 * a saving next to it that it qualifies.
 *
 * @param {Object} props
 * @param {"neutral"|"match"|"risk"} [props.tone]
 * @param {string} [props.className]
 */
export function Chip({ tone = "neutral", className = "", ...rest }) {
  const classes = [
    "chip",
    tone === "match" && "chip--match",
    tone === "risk" && "chip--risk",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes} {...rest} />;
}

export default Chip;
