/**
 * Button — the only action element in Roamance.
 *
 * A thin wrapper over the `.btn` classes in index.css. It adds no styling of
 * its own: the point is that a screen can never accidentally ship a button
 * that isn't one of the three sanctioned variants.
 *
 * `type` defaults to "button". React does not do this — a bare <button> inside
 * a <form> submits it — and the onboarding form is exactly where that bites.
 *
 * @param {Object} props
 * @param {"default"|"primary"|"ghost"} [props.variant]
 * @param {boolean} [props.block] Full width. One per screen at most.
 * @param {string} [props.className]
 */
export function Button({ variant = "default", block = false, className = "", type = "button", ...rest }) {
  const classes = [
    "btn",
    variant === "primary" && "btn--primary",
    variant === "ghost" && "btn--ghost",
    block && "btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...rest} />;
}

export default Button;
