# Deferred Hero Video Loading Design

## Goal

Reduce the mobile Lighthouse LCP cost of the 3.1 MB hero MP4 without removing the approved hero video experience.

## Design

`Hero` will render the existing poster immediately. The video element will start with `preload="none"` and without a source URL, so the browser cannot compete for bandwidth during the initial render. After the page load has completed, the component will schedule a low-priority load using `requestIdleCallback`, with a short timeout fallback for browsers without that API. The source will then be assigned, and the existing autoplay effect will start playback when motion is allowed.

Users who prefer reduced motion will keep the poster only: the MP4 source will not be assigned and playback will not start. Normal-motion users still receive muted, looping, inline autoplay once the browser is idle. No copy, layout, contact flow, persistence, analytics, or backend behavior changes.

## Verification

- Playwright verifies the poster is present and the video has no active source before the deferred load window.
- Playwright verifies the video source is assigned and playback is attempted for normal motion.
- Existing reduced-motion and browser-error suites remain green.
- Lighthouse mobile and desktop are rerun through the existing CDP path; no release claim is made unless mobile Performance reaches the configured threshold.

## Scope

Only `src/components/Hero.tsx` and its focused browser test coverage should change for this performance attempt. Existing uncommitted Task 8 changes remain part of the release-readiness working tree and are not reverted.
