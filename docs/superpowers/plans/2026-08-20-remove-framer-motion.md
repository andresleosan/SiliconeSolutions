# Remove Decorative Framer Motion From the Landing Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended for inline execution) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the landing route's `framer-motion` dependency while preserving content, layout, contact behavior, carousel navigation, autoplay, reduced-motion behavior, and hero video loading.

**Architecture:** Replace Hero and ServicesCarousel motion wrappers with ordinary semantic elements. Replace WorkGallery's Framer Motion drag/animation layer with native pointer events and an explicit CSS transform, while retaining the existing gallery state machine and thresholds. Centralize reduced-motion detection in a small SSR-safe React hook so interactive behavior does not depend on Framer Motion.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, Tailwind CSS, Playwright, Node test runner.

## Global Constraints

- No copy, visual layout, section order, image/video source, contact route, or form behavior changes.
- Keep carousel navigation, autoplay, pause controls, drag/swipe behavior, and reduced-motion behavior unchanged.
- No dynamic import, viewport placeholder, or below-the-fold content deferral in this iteration.
- No Lighthouse audit suppression or threshold change.
- Production code must have a failing test before implementation.

## File Map

- Create: `qa/tests/framer-motion-contract.mjs` — source contract proving the three scoped components no longer import the dependency.
- Create: `src/lib/use-prefers-reduced-motion.ts` — SSR-safe media-query hook used by the two interactive carousels.
- Modify: `src/components/Hero.tsx` — replace two motion wrappers with semantic elements and remove animation-only code.
- Modify: `src/components/ServicesCarousel.tsx` — remove Framer Motion wrappers while retaining carousel state and reduced-motion scroll behavior.
- Modify: `src/components/WorkGallery.tsx` — remove Framer Motion and implement native pointer drag with the existing `50px` threshold.
- Modify: `package.json` and lockfile — remove `framer-motion` only after the source graph is clean.
- Modify: `.superpowers/sdd/2026-08-20-release-readiness-qa/task-1-report.md` and `progress.md` — record the before/after evidence and final gate status.

### Task 1: Add the failing contracts

**Files:**
- Create: `qa/tests/framer-motion-contract.mjs`

**Interfaces:**
- The source contract reads the exact three component files and rejects `from "framer-motion"` and `from 'framer-motion'` imports.
- The hook contract checks that the implementation uses `useSyncExternalStore`, subscribes to the reduced-motion media query, and returns `false` for the server snapshot.

- [ ] **Step 1: Write the source contracts**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const componentPaths = [
  "src/components/Hero.tsx",
  "src/components/ServicesCarousel.tsx",
  "src/components/WorkGallery.tsx",
];

for (const path of componentPaths) {
  const source = await readFile(path, "utf8");
  assert.doesNotMatch(source, /from ["']framer-motion["']/u, `${path} still imports framer-motion`);
}

const hook = await readFile("src/lib/use-prefers-reduced-motion.ts", "utf8");
assert.match(hook, /useSyncExternalStore/u);
assert.match(hook, /prefers-reduced-motion: reduce/u);
assert.match(hook, /return false/u);
```

- [ ] **Step 2: Run RED**

Run: `node qa/tests/framer-motion-contract.mjs`

Expected: FAIL because the three components currently import `framer-motion`; the hook file may not exist yet.

- [ ] **Step 3: Run the existing relevant unit tests to establish the behavior baseline**

Run: `node --experimental-strip-types --test src/lib/contact.test.mjs src/lib/gallery.test.mjs`

Expected: exit `0`, with `7/7` tests passing.

### Task 2: Remove Hero and ServicesCarousel animation dependency

**Files:**
- Create: `src/lib/use-prefers-reduced-motion.ts`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/ServicesCarousel.tsx`

**Interfaces:**
- `usePrefersReducedMotion(): boolean` returns the browser's reduced-motion preference and returns `false` during server rendering.
- `Hero` keeps the same props and video effect.
- `ServicesCarousel` keeps `goTo`, autoplay, keyboard, pointer pause, focus pause, refs, and scroll behavior.

- [ ] **Step 1: Implement the hook**

```ts
import { useSyncExternalStore } from "react";

const subscribe = (onStoreChange: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
};

const getSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerSnapshot = () => false;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

- [ ] **Step 2: Remove Hero animation-only code**

Remove the `framer-motion` import, `Variants` type, `getRevealVariants`, `useReducedMotion`, and `revealVariants`. Change only the two `motion.div`/`motion.figure` wrappers to `div`/`figure` and retain their existing classes and child markup.

- [ ] **Step 3: Remove ServicesCarousel animation-only code**

Replace `useReducedMotion` with `usePrefersReducedMotion`. Keep `motionDisabled` as the boolean used by scroll behavior and autoplay. Change each `motion.article` to `article`, remove `initial`, `whileInView`, `viewport`, `transition`, and `whileHover`, and retain the key, ref, data attribute, class, and child tree.

- [ ] **Step 4: Run the RED contract again**

Run: `node qa/tests/framer-motion-contract.mjs`

Expected: FAIL only because `WorkGallery.tsx` still imports `framer-motion`.

### Task 3: Replace WorkGallery drag and animation layer

**Files:**
- Modify: `src/components/WorkGallery.tsx`

**Interfaces:**
- `navigate(targetIndex: number, nextDirection: 1 | -1)` remains the single state transition entry point.
- Native pointer handlers use `SWIPE_THRESHOLD_PX` and call `navigate` with the same direction semantics as the prior drag handler.

- [ ] **Step 1: Add native drag state and handlers**

Add refs for the pointer id and starting X coordinate, plus `dragOffset` state. Import `type PointerEvent` from React and add handlers that:

```ts
const handlePointerDown = (event: React.PointerEvent<HTMLElement>, isActive: boolean) => {
  if (!isActive || reducedMotion) return;
  pointerIdRef.current = event.pointerId;
  dragStartXRef.current = event.clientX;
  setDragging(true);
  event.currentTarget.setPointerCapture(event.pointerId);
};

const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
  if (!dragging || event.pointerId !== pointerIdRef.current || dragStartXRef.current === null) return;
  setDragOffset(event.clientX - dragStartXRef.current);
};

const finishPointerDrag = (event: PointerEvent<HTMLElement>, shouldNavigate: boolean) => {
  if (event.pointerId !== pointerIdRef.current) return;
  const offset = dragOffset;
  setDragging(false);
  setDragOffset(0);
  pointerIdRef.current = null;
  dragStartXRef.current = null;
  if (shouldNavigate && offset <= -SWIPE_THRESHOLD_PX) navigate(currentIndex + 1, 1);
  if (shouldNavigate && offset >= SWIPE_THRESHOLD_PX) navigate(currentIndex - 1, -1);
};
```

Use `onPointerUp` with `shouldNavigate: true` and `onPointerCancel` with `shouldNavigate: false`. Release pointer capture when available in both paths.

- [ ] **Step 2: Replace motion figure output**

Replace each `motion.figure` with `figure`, preserve all ARIA/data/class attributes and child markup, and replace Framer Motion props with an inline transform/opacity style computed from `transform`, `direction`, `departingIndex`, `reducedMotion`, and `dragOffset`. Keep `style.zIndex` unchanged. Attach the native pointer handlers only to the active card.

- [ ] **Step 3: Preserve reduced-motion and autoplay semantics**

Replace `useReducedMotion` with `usePrefersReducedMotion`, remove the hydration helper that existed only to coordinate that Framer Motion hook, and keep `reducedMotion` as the boolean that disables auto-advance, drag, departure animation, and the autoplay control.

- [ ] **Step 4: Run the full source contract**

Run: `node qa/tests/framer-motion-contract.mjs`

Expected: PASS; no scoped component imports `framer-motion` and the hook contract passes.

### Task 4: Remove the dependency and verify functionality

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Test: `qa/tests/landing.spec.ts`
- Test: `src/lib/contact.test.mjs`, `src/lib/gallery.test.mjs`

- [ ] **Step 1: Remove the unused dependency**

Run: `corepack pnpm remove framer-motion`

Expected: `package.json` and `pnpm-lock.yaml` no longer contain the dependency.

- [ ] **Step 2: Run focused functional checks**

Run: `corepack pnpm exec playwright test qa/tests/landing.spec.ts --reporter=line --output="C:\Users\USER\AppData\Local\Temp\opencode\silicone-framer-motion-focused"`

Expected: all landing release tests pass with no browser console/page errors.

- [ ] **Step 3: Run static and code checks**

Run: `corepack pnpm run build`

Run: `corepack pnpm run lint`

Run: `corepack pnpm exec tsc --noEmit`

Run: `corepack pnpm audit --audit-level=high`

Run: `corepack pnpm run media:verify`

Expected: all commands exit `0`; no lint/type/audit/media regressions.

- [ ] **Step 4: Run the complete E2E matrix**

Run: `corepack pnpm run test:e2e`

Expected: static build passes and the full Playwright suite passes.

### Task 5: Measure and close the performance hypothesis

**Files:**
- Modify: `.superpowers/sdd/2026-08-20-release-readiness-qa/task-1-report.md`
- Modify: `.superpowers/sdd/2026-08-20-release-readiness-qa/progress.md`
- Read: Lighthouse JSON output in `C:\Users\USER\AppData\Local\Temp\opencode\`

- [ ] **Step 1: Confirm the diagnostic Chrome endpoint**

Run: `Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:9225/json/version"`

Expected: HTTP `200`.

- [ ] **Step 2: Run mobile Lighthouse**

Run: `corepack pnpm dlx lighthouse@13.4.1 http://127.0.0.1:4173 --hostname=0.0.0.0 --port=9225 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="C:\Users\USER\AppData\Local\Temp\opencode\silicone-framer-motion-mobile.json" --quiet`

Expected: exit `0`; record Performance, LCP, and all category scores.

- [ ] **Step 3: Run desktop Lighthouse**

Run: `corepack pnpm dlx lighthouse@13.4.1 http://127.0.0.1:4173 --preset=desktop --hostname=0.0.0.0 --port=9225 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="C:\Users\USER\AppData\Local\Temp\opencode\silicone-framer-motion-desktop.json" --quiet`

Expected: exit `0`; record Performance, LCP, and all category scores.

- [ ] **Step 4: Apply the stop rule**

If mobile remains materially near `77`, leave the release `BLOCKED`, document that removing the dependency did not resolve Lighthouse's simulated LCP, and do not attempt another optimization. If mobile reaches the required `95` threshold and all gates pass, document the evidence and mark the performance hypothesis resolved.
