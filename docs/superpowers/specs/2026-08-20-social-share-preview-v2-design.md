# Social Share Preview V2 Design

## Goal

Improve the Open Graph image for WhatsApp's compact side-thumbnail layout and force the clean production URL to fetch a new preview instead of reusing the cached `/og-image.png` result.

## Approved Design

- Canvas: static `1200 x 630` pixels.
- Background: the site's navy `#0F172A`.
- Brand mark: the existing Silicone Solutions logo, substantially larger and centered inside a light `#FAFAF8` panel.
- Accent: a restrained orange `#F97316` line and brand detail.
- Image text: one short, high-legibility line, `Professional Silicone Sealing in Jersey`.
- Supporting brand: `Silicone Solutions C.I. Ltd` only; do not repeat the domain or long description inside the image because WhatsApp renders those outside the thumbnail.
- No small footer copy, no photo background, and no dense multi-line text.

## Technical Design

- Generate a new repository-owned image at `public/og-image-v2.jpg`.
- Update Open Graph and Twitter metadata to reference `/og-image-v2.jpg` while keeping the existing absolute production URL and dimensions.
- Keep `/og-image.png` available for rollback until the new deployment is confirmed.
- Keep the implementation compatible with the static export; no runtime image service or external dependency.
- The versioned image URL is the cache-busting mechanism. The shared URL remains exactly `https://siliconesolutions.pages.dev/`.

## Verification

- The generated image must be JPEG, `1200 x 630`, and readable when reduced to WhatsApp's thumbnail size.
- The generated static HTML must reference the new absolute image URL in both Open Graph and Twitter metadata.
- The clean production URL must serve the new metadata and image with `200 OK` after deployment.
- Existing lint, TypeScript, unit, media, dependency-audit, and production-export E2E checks must remain passing.

## Scope Boundaries

- Do not modify the visible landing page.
- Do not change the canonical URL or add query parameters to the shared link.
- Do not delete `/og-image.png` in this iteration; it remains the rollback asset.
