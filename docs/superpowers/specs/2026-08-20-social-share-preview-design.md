# Social Share Preview Design

## Goal

Make links shared from Silicone Solutions render a branded preview card in WhatsApp and other Open Graph consumers, including an image, title, and description.

## Approved Design

- Canvas: static `1200 x 630` pixels, suitable for WhatsApp, Facebook, and LinkedIn.
- Background: the site's navy `#0F172A`.
- Brand mark: the existing `public/images/logo-clean.webp` in the upper-left area, placed on a light surface for legibility.
- Accent: the site's orange `#F97316` as a restrained divider or edge detail.
- Primary text: `Professional Silicone Sealing in Jersey`.
- Supporting text: `Clean workmanship. Durable results.`.
- Footer: `Silicone Solutions C.I. Ltd` and `siliconesolutions.pages.dev`.
- No photographic background: the clean composition is more legible at WhatsApp's preview size and avoids unpredictable contrast over image detail.

## Technical Design

- Add one static, repository-owned Open Graph image under `public/`.
- Extend the root Next.js metadata with an absolute production URL, canonical URL, Open Graph image metadata, and Twitter summary-card metadata.
- Keep the implementation compatible with the existing static export: no runtime image generation, external image service, or new server dependency.
- Use the confirmed production host `https://siliconesolutions.pages.dev` for the canonical URL and absolute image URL.

## Verification

- The production build must complete successfully.
- The generated `out/index.html` must contain the canonical URL, Open Graph image URL, image dimensions, image alt text, and Twitter card metadata.
- The generated image must be present in the static output at the URL referenced by metadata and retain the approved `1200 x 630` dimensions.
- Existing lint, TypeScript, unit, media, and production-export E2E checks must remain passing.
- The deployed URL should be checked with a social preview/debugger after deployment; WhatsApp may cache previews independently of the web response.

## Scope Boundaries

- This change does not add analytics, tracking parameters, a CMS, remote asset hosting, or a new social channel.
- This change does not alter the visible landing-page layout.
