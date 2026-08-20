# Natural Media and Brand Assets Design

## Status

Approved by the operator on 2026-08-20.

## Objective

Improve the landing page media presentation so every photo, video, and brand asset is visible without unintended cropping, remains accessible, and continues working after the local source folder is deleted.

## Persistence Strategy

- `F:\Proyectos\SiliconeSolutions\Varios` is an import source only.
- Runtime code must never reference the local source folder.
- Final assets and optimized derivatives live under the repository's `public/` directory.
- GitHub is the durable source of truth for deployed assets.
- `pnpm run build` copies public assets into the static `out/` artifact.
- Cloudflare Pages deploys `out/` to its CDN.
- Deleting the local project folder after a successful push and deployment must not remove media from the live site.
- Cloudflare R2 and manual dashboard uploads are out of scope because the current media volume does not justify a separate storage integration.

## Selected Direction

### Natural Dimensions

The operator selected natural media proportions rather than fixed-ratio crops or cover thumbnails with a lightbox.

- Images render at their natural aspect ratio with responsive width and automatic height.
- Video renders at its intrinsic aspect ratio without `object-fit: cover`.
- Containers may constrain maximum width, but they must not crop source content.
- Page sections may have different media heights; preserving the complete work is more important than uniform cards.

## Updated Video

- Replace `public/video/silicone-solutions.mp4` with the updated `Video.mp4` from the source folder.
- The updated file has a different SHA-256 hash from the currently committed video and must be verified after import.
- Preserve autoplay, muted playback, looping, `playsInline`, and `preload="metadata"`.
- Respect reduced motion by pausing autoplay.
- Use natural sizing and retain a local poster fallback.
- Confirm the video exists inside `out/video/` after the static build.

## Images

- Replace fixed `aspect-[4/3]`, `aspect-[4/5]`, and `object-cover` presentation where those rules crop meaningful content.
- Use intrinsic dimensions or explicit width/height values that match each source.
- Use responsive `width: 100%` and `height: auto`.
- Generate optimized WebP derivatives without cropping where this reduces transfer size.
- Keep original or replacement files in the repository when required as fallbacks.
- Confirm every referenced image exists inside `out/images/` after the static build.

## Before and After

- The finished result appears on the left and is labelled `After`.
- The original condition appears on the right and is labelled `Before`.
- Use `banera.jpg` for the finished result and `banera-antes.jpg` for the original condition.
- Preserve the natural portrait ratio of both source images.
- Keep the draggable divider, native range input, mouse, touch, and keyboard behavior.
- Keep a no-JavaScript two-image fallback in the same left/right orientation.
- Expose both Before and After descriptions to assistive technology after progressive enhancement.
- Use a focus indicator with at least 3:1 non-text contrast.
- Clamp the visual handle so it remains completely visible at values `0` and `100`.

## Gallery Corrections

- `Servicios.jpg` is a service overview flyer, not a project photograph.
- `Poceta.jpg` shows sealing around a toilet base, not a sink.
- `Lavamanos.jpg` shows washbasin sealing.
- Gallery headings and descriptions must not imply that the flyer is photographed project work.
- Captions and alt text must describe only what is visibly supported by each asset.

## Logo and Favicon

- Create a clean wordmark derivative from `Logo.jpg`.
- Remove only the empty black letterbox bands; preserve the complete visible logo artwork.
- Display the clean wordmark without cropping through an intrinsic-ratio image.
- Create a compact favicon from the orange crescent mark.
- Add the favicon through the Next.js App Router metadata file convention.
- Verify the favicon is included in `out/` and removes the current `/favicon.ico` 404.

## Accessibility

- Preserve descriptive alt text for visible images.
- Avoid duplicate or contradictory image descriptions.
- Ensure the enhanced Before/After comparison exposes descriptions for both states.
- Maintain keyboard support, visible focus, reduced-motion handling, and WCAG AA text contrast.
- Labels must remain visible and must not rely on color alone.

## Performance

- Do not introduce Cloudflare R2, a CMS, or remote image hosting.
- Optimize derived images without altering their framing.
- Keep the updated video local to the repository and avoid autoplay audio.
- Confirm the static build succeeds with `pnpm` and that no npm lockfile is introduced.

## Verification

- Compare source and repository video SHA-256 hashes after import.
- Run `corepack pnpm run lint`.
- Run `corepack pnpm exec tsc --noEmit`.
- Run `corepack pnpm run build`.
- Run `corepack pnpm audit --audit-level=high`.
- Verify `out/index.html`, the updated video, optimized images, clean logo, and favicon exist.
- Test desktop and mobile layouts for natural sizing and horizontal overflow.
- Test Before/After with mouse, touch, keyboard, values `0` and `100`, reduced motion, and JavaScript disabled.
- Inspect console and network requests for missing assets.

## Out of Scope

- Cloudflare R2.
- Manual uploads through the Cloudflare dashboard.
- A media CMS.
- Deleting media from GitHub after deployment.
- Production deployment without the operator's explicit confirmation.
