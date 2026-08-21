# Remove Decorative Framer Motion From the Landing Route

## Goal

Reduce the JavaScript cost of the landing route identified by controlled Lighthouse diagnostics, without changing copy, section order, layout, contacts, hero video loading, or interactive carousel behavior.

## Scope

- Remove `framer-motion` imports and animation props from `Hero`, `ServicesCarousel`, and `WorkGallery`.
- Preserve the existing HTML elements, classes, data attributes, aria attributes, event handlers, and state transitions.
- Keep carousel navigation, autoplay, pause controls, drag/swipe behavior, and reduced-motion behavior unchanged.
- Let the existing CSS provide the stable visual presentation. Decorative entrance, hover, and spring animations are intentionally removed.
- Remove `framer-motion` from `package.json` only if the production graph has no remaining imports.

## Non-goals

- No copy, visual layout, section order, image/video source, contact route, or form behavior changes.
- No dynamic import, viewport placeholder, or below-the-fold content deferral in this iteration.
- No Lighthouse audit suppression or threshold change.

## Testing Contract

1. Add a source contract test that fails while any of the three scoped components imports `framer-motion`.
2. Run that test before implementation and record the expected RED failure.
3. Remove the imports and only the animation-specific props/hooks that become unused.
4. Run the contract test GREEN, then run the existing unit, lint, typecheck, audit, build, E2E, media, and Lighthouse checks.
5. Compare mobile and desktop Performance/LCP against the latest accepted baseline: mobile `77` / `6.2s`, desktop `97` / `1.3s`.

## Rollback

Restore the three component imports/animation props and the dependency if the functional suite regresses or the Lighthouse result does not materially improve. Do not combine this iteration with another performance hypothesis.
