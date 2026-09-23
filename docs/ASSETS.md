# Assets

## Policy

All imagery is **committed to the repository** under `public/images/`. No image APIs, no hotlinking, no key-based providers, no deprecated "random photo" URL services. Every file must be something the team has a clear right to use.

Acceptable sources:
- Photos the team took.
- Explicitly open-licensed / public-domain photos (for example CC0 or CC BY, with attribution recorded when the license requires it).
- Generated images the team produced themselves.

Record every third-party image in `public/images/CREDITS.md` with filename, source URL, author, and license. Do this as you add files, not the night before the demo.

## Folder convention

```text
public/
  images/
    CREDITS.md
    placeholder.jpg           # 1600x1200 neutral fallback
    new-orleans/1.jpg 2.jpg 3.jpg
    mexico-city/1.jpg 2.jpg 3.jpg
    ...
```

- Folder name **must equal the trip `id`** in `trips.json`. This is the integration contract; it lets anyone add a trip without touching component code.
- 2–3 photos per trip. The first is the card hero.
- Paths in `trips.json` are absolute from `public/`: `"/images/new-orleans/1.jpg"`.
- Filenames lowercase, no spaces. Vercel paths are case-sensitive even when macOS is not.

## Sizing and budget

| Use | Target dimensions | Format | Max size |
|---|---|---|---|
| Card hero | 1200 × 900 | `.webp` (fallback `.jpg`) | 250 KB |
| Detail gallery | 1600 × 1200 | `.webp` / `.jpg` | 400 KB |
| Icons / logos | inline SVG in `src/components` | SVG | — |

Keep the whole `public/images` folder under roughly 15 MB. Compress before committing:

```bash
# one-time
brew install imagemagick
# resize + convert every jpg in a folder
mogrify -resize 1600x1200\> -quality 82 -format webp public/images/new-orleans/*.jpg
```

## Using `next/image`

`next/image` extends `<img>` with automatic optimization; `src` and `alt` are required, and `width`/`height` must be set together unless the image is statically imported or you use `fill` ([Next.js Image component](https://nextjs.org/docs/app/api-reference/components/image)).

```tsx
import Image from "next/image";

<div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
  <Image
    src={trip.photos[0]}
    alt={`${trip.city}, ${trip.country}`}
    fill
    sizes="(max-width: 640px) 100vw, 400px"
    priority={isTopCard}
    className="object-cover"
  />
</div>
```

Rules:
- `fill` needs a parent with `position: relative` and a defined height or aspect ratio, or the image collapses.
- Always give a real `alt` describing the destination. `alt=""` only for purely decorative images.
- `priority` on the top deck card and the detail hero only — not on every card, or you defeat lazy loading.
- If you switch to static export for GitHub Pages, set `images: { unoptimized: true }` in `next.config.js` ([static exports](https://nextjs.org/docs/app/guides/static-exports)).

## Missing-image handling

Never let a broken image reach the demo. Resolve photos through a helper:

```ts
// src/lib/photos.ts
export const PLACEHOLDER = "/images/placeholder.jpg";

export function tripPhotos(trip: Trip): string[] {
  return trip.photos?.length ? trip.photos : [PLACEHOLDER];
}
```

Use `tripPhotos(trip)` everywhere instead of `trip.photos` directly. This lets teammates add trip data before their photos exist and keeps parallel work unblocked.

## Fonts and other static files

- Load fonts via `next/font` (self-hosted at build time, no external request), not a CDN `<link>`.
- No video files in the repo.
- If a static map image is wanted on the trip detail, use a committed illustrative image and label it decorative — do not call a maps API.
