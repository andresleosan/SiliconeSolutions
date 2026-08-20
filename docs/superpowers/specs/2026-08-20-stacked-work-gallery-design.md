# Stacked Work Gallery Design

## Status

Approved by the operator on 2026-08-20.

## Objective

Replace the static work gallery with an auto-advancing stacked-card carousel inspired by the structural interaction shown in the supplied Mobbin/Strava reference. The implementation must use Silicone Solutions media and visual language rather than reproducing the reference content.

## Content Scope

The stack contains four `3:4` work images so every card shares a stable natural ratio without cropping:

1. Washbasin sealing: `lavamanos.webp`.
2. Toilet base sealing: `poceta.webp`.
3. Bath reseal result: `banera.webp`.
4. Original bath condition: `banera-antes.webp`.

The tall `services.webp` flyer is excluded from this stack because its `947x2048` ratio would destabilize the deck. It remains available in the Services section.

## Visual Structure

- One active card appears in front.
- The remaining cards appear behind it with small horizontal offsets, scale changes, and alternating rotations.
- Cards use rounded corners, restrained shadows, and the existing navy/orange/warm-white palette.
- Each card contains the complete uncropped image, title, short description, and sequence number.
- The deck maintains a natural `3:4` media ratio.
- Pagination dots appear below the deck.
- Previous and next controls remain visible and keyboard accessible.

## Motion

- Auto-advance every `4500ms`.
- The active card exits laterally and moves to the back of the stack.
- The next card moves forward while the remaining cards update their depth.
- Pause auto-advance while pointer is inside, keyboard focus is inside, or the user is actively dragging/touching.
- Resume only after interaction leaves the gallery.
- Support horizontal swipe/drag with a threshold of `50px`.
- Support `ArrowLeft` and `ArrowRight` keyboard navigation.
- Clicking a pagination dot selects that card.
- With `prefers-reduced-motion: reduce`, disable auto-advance, drag animation, rotation, and lateral exit motion. Manual buttons, dots, and keyboard navigation remain available with immediate state changes.

## Accessibility

- Use a named carousel region with `aria-roledescription="carousel"`.
- Expose only the active card to the accessibility tree; stacked background cards use `aria-hidden="true"` and cannot receive focus.
- Announce `Showing project X of 4: <title>` through a polite live region after manual or automatic changes.
- Previous/next buttons use explicit accessible names and disabled state only when no movement is possible.
- Pagination controls expose the selected state with `aria-current="true"`.
- Focus indicators use the existing high-contrast navy/warm-white treatment.
- No essential information relies only on card position, rotation, or color.

## Responsive Behavior

- Mobile: one deck centered in the viewport, swipe enabled, controls and dots below.
- Desktop: deck remains the visual focus with supporting copy beside or above it, without stretching the card beyond its natural ratio.
- Back cards remain partially visible without creating horizontal page overflow.
- Minimum viewport width remains `320px`.

## Content Accuracy

- Captions describe only visible assets.
- `poceta.webp` must be identified as toilet base sealing, never a kitchen sink.
- `lavamanos.webp` must be identified as washbasin sealing, never window sealing.
- Before-condition content must be labelled clearly and not presented as a finished result.
- No fabricated customer story, location, rating, or guarantee is added.

## Architecture

- Convert `WorkGallery` to a client component or replace it with `StackedWorkGallery`.
- Continue consuming typed `GalleryItem[]` from `src/content.ts`.
- Add the two bath entries and remove the services flyer from `galleryItems`.
- Keep all images under `public/images/` and preserve static export compatibility.
- Do not add a third-party carousel library; Framer Motion and React state are sufficient.

## Verification

- Run lint, TypeScript, static build, media verifier, and pnpm audit.
- Verify exactly four cards and four pagination dots.
- Verify automatic advance after `4500ms` in normal motion.
- Verify pause on pointer, focus, and drag/touch.
- Verify reduced motion prevents automatic advance for at least `5000ms`.
- Verify previous/next, dots, arrow keys, and swipe.
- Verify active-card announcement and hidden background cards in the accessibility tree.
- Verify all four images render without crop at `3:4`.
- Verify desktop `1440x900`, mobile `390x844`, and minimum `320px` without horizontal overflow.
- Verify static `out/` contains all referenced images and browser console/network logs contain no missing gallery assets.

## Out of Scope

- Copying Strava branding, text, icons, or protected visual assets.
- Adding more source images.
- A remote media service or CMS.
- Production deployment without explicit operator confirmation.
