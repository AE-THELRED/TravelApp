import { Button } from "roamance";

// Copy is taken from the real screens — Landing's call to action, the vibe
// picker's disabled state, the top bar's reset.

/** The three variants side by side. Only one primary belongs on a screen. */
export const Variants = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
    <Button variant="primary">Find your type</Button>
    <Button>Back to your deck</Button>
    <Button variant="ghost">Reset</Button>
  </div>
);

/** Full width, as the landing screen and the end of the swipe deck use it. */
export const Block = () => (
  <div style={{ maxWidth: "320px" }}>
    <Button variant="primary" block>See your matches</Button>
  </div>
);

/**
 * The disabled state, with the copy the vibe picker actually shows before a
 * board is chosen. Disabled drops to 45% and loses the pointer.
 */
export const Disabled = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
    <Button variant="primary" disabled>Pick at least one board</Button>
    <Button disabled>Unavailable</Button>
  </div>
);

/** The top bar: ghost buttons beside the wordmark, which is where they live. */
export const InTheTopBar = () => (
  <header className="topbar">
    <span className="wordmark">Ro<em>a</em>mance</span>
    <div className="topbar__actions">
      <Button variant="ghost">Saved · 2</Button>
      <Button variant="ghost">Reset</Button>
    </div>
  </header>
);
