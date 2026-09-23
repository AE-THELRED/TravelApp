/**
 * The design system's public surface — what Claude Design imports and what the
 * design agent builds with.
 *
 * Deliberately small. Most of Roamance's design language is global CSS classes
 * (.btn, .chip, .card, .segmented, .field) rather than React components, and
 * those travel in styles.css, not here. Only pieces with real logic worth
 * shipping as components belong in this file:
 *
 *   Art            generates the SVG that fills every image slot
 *   EstimateBadge  the "estimated prototype data" label required beside prices
 *
 * If a class ever grows behaviour and becomes a component, export it here and
 * add it to componentSrcMap in .design-sync/config.json.
 */
export { Art } from "../src/components/Art.jsx";
export { EstimateBadge } from "../src/components/EstimateBadge.jsx";
