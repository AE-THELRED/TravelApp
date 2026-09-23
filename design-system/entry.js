/**
 * The design system's public surface — what Claude Design imports and what the
 * design agent builds with.
 *
 * Every export here is a thin wrapper over classes in src/index.css. None of
 * them carry styling of their own; index.css stays the single design surface,
 * and these exist so a screen cannot accidentally ship an unsanctioned variant
 * or forget the bookkeeping a control needs.
 *
 * Adding a component means editing BOTH this file and componentSrcMap in
 * .design-sync/config.json — nothing here can be discovered automatically.
 * See .design-sync/NOTES.md.
 */
export { Button } from "../src/components/Button.jsx";
export { Chip } from "../src/components/Chip.jsx";
export { Card, CardBody } from "../src/components/Card.jsx";
export { Field } from "../src/components/Field.jsx";
export { Segmented } from "../src/components/Segmented.jsx";
export { Art } from "../src/components/Art.jsx";
export { EstimateBadge } from "../src/components/EstimateBadge.jsx";
