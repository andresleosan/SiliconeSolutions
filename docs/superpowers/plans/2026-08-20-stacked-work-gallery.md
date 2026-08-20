# Stacked Work Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static work grid with an accessible auto-advancing stack of four uncropped project cards inspired by the supplied Mobbin interaction structure.

**Architecture:** Keep carousel state and Framer Motion rendering inside `WorkGallery`, while extracting index wrapping and auto-advance eligibility into pure TypeScript helpers with Node test coverage. Continue using typed content arrays and committed `3:4` WebP assets so the static Cloudflare export remains self-contained.

**Tech Stack:** React 19, TypeScript, Framer Motion 13, Next.js 16 static export, Tailwind CSS 4, Node 24 test runner, pnpm 11.21.0.

## Global Constraints

- Use pnpm exclusively; do not introduce npm artifacts.
- Use exactly four gallery cards in this order: washbasin, toilet base, bath After, bath Before.
- Exclude `services.webp` from the stacked gallery.
- Keep every image fully visible at natural `3:4`; do not use `object-cover`.
- Auto-advance every `4500ms` only in normal motion.
- Pause on pointer, focus, and active drag/touch.
- Swipe threshold is `50px`.
- Support previous/next buttons, pagination dots, `ArrowLeft`, and `ArrowRight`.
- Reduced motion disables autoplay, rotation, drag animation, and lateral exit motion.
- Expose only the active card to assistive technology.
- Keep visible copy in English and use only confirmed asset descriptions.
- Do not add a third-party carousel package, backend, remote media service, or deployment action.
- Push only after task-scoped review and fresh verification pass.

---

### Task 1: Build the stacked auto-advancing gallery

**Files:**
- Create: `src/lib/gallery.ts`
- Create: `src/lib/gallery.test.mjs`
- Modify: `src/content.ts`
- Modify: `src/components/WorkGallery.tsx`

**Interfaces:**
- `wrapGalleryIndex(index: number, length: number): number` returns a circular valid index or `0` when length is not positive.
- `relativeGalleryPosition(itemIndex: number, activeIndex: number, length: number): number` returns circular depth from the active card.
- `canAutoAdvance({ reducedMotion, pointerInside, focusInside, dragging, itemCount }): boolean` centralizes autoplay eligibility.
- `WorkGallery({ items: GalleryItem[] })` preserves its existing public component API.

- [ ] **Step 1: Write failing unit tests for deck state**

Create `src/lib/gallery.test.mjs` with Node's test runner:

```ts
import assert from "node:assert/strict";
import test from "node:test";

import {
  canAutoAdvance,
  relativeGalleryPosition,
  wrapGalleryIndex,
} from "./gallery.ts";

test("wrapGalleryIndex wraps in both directions", () => {
  assert.equal(wrapGalleryIndex(4, 4), 0);
  assert.equal(wrapGalleryIndex(-1, 4), 3);
  assert.equal(wrapGalleryIndex(2, 4), 2);
  assert.equal(wrapGalleryIndex(2, 0), 0);
});

test("relativeGalleryPosition places the active card at depth zero", () => {
  assert.equal(relativeGalleryPosition(2, 2, 4), 0);
  assert.equal(relativeGalleryPosition(3, 2, 4), 1);
  assert.equal(relativeGalleryPosition(1, 2, 4), 3);
});

test("canAutoAdvance requires normal motion and no interaction", () => {
  const idle = {
    reducedMotion: false,
    pointerInside: false,
    focusInside: false,
    dragging: false,
    itemCount: 4,
  };

  assert.equal(canAutoAdvance(idle), true);
  assert.equal(canAutoAdvance({ ...idle, reducedMotion: true }), false);
  assert.equal(canAutoAdvance({ ...idle, pointerInside: true }), false);
  assert.equal(canAutoAdvance({ ...idle, focusInside: true }), false);
  assert.equal(canAutoAdvance({ ...idle, dragging: true }), false);
  assert.equal(canAutoAdvance({ ...idle, itemCount: 1 }), false);
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --experimental-strip-types --test src/lib/gallery.test.mjs`

Expected: FAIL because `src/lib/gallery.ts` does not exist.

- [ ] **Step 3: Implement the pure gallery helpers**

Create `src/lib/gallery.ts`:

```ts
type AutoAdvanceState = {
  reducedMotion: boolean;
  pointerInside: boolean;
  focusInside: boolean;
  dragging: boolean;
  itemCount: number;
};

export function wrapGalleryIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export function relativeGalleryPosition(
  itemIndex: number,
  activeIndex: number,
  length: number,
): number {
  return wrapGalleryIndex(itemIndex - activeIndex, length);
}

export function canAutoAdvance(state: AutoAdvanceState): boolean {
  return (
    state.itemCount > 1 &&
    !state.reducedMotion &&
    !state.pointerInside &&
    !state.focusInside &&
    !state.dragging
  );
}
```

- [ ] **Step 4: Run unit tests and confirm pass**

Run: `node --experimental-strip-types --test src/lib/gallery.test.mjs`

Expected: `3` tests pass, `0` fail.

- [ ] **Step 5: Define four accurate gallery entries**

Add `description: string` to `GalleryItem`. Replace `galleryItems` with exactly:

```ts
[
  {
    src: "/images/lavamanos.webp",
    alt: "Clean white silicone seal between a washbasin and blue splashback",
    label: "Washbasin sealing",
    description: "A neat white seal following the washbasin and splashback joint.",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/poceta.webp",
    alt: "Clean white silicone seal around the base of a toilet",
    label: "Toilet base sealing",
    description: "A clean silicone bead following the toilet base.",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/banera.webp",
    alt: "Bath edge showing a clean finished silicone seal",
    label: "Bath reseal result",
    description: "The completed bath edge after resealing.",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/banera-antes.webp",
    alt: "Bath edge showing an ageing silicone seal before replacement",
    label: "Before condition",
    description: "The original bath edge before the replacement work.",
    width: 1200,
    height: 1600,
  },
]
```

- [ ] **Step 6: Convert WorkGallery to a client-side stacked deck**

Add `"use client"`, React state, refs, Framer Motion, and the gallery helpers. Maintain:

```ts
const AUTO_ADVANCE_MS = 4500;
const SWIPE_THRESHOLD_PX = 50;
```

Track `activeIndex`, `pointerInside`, `focusInside`, `dragging`, and navigation direction. Use a cleanup-safe interval that advances only when `canAutoAdvance(...)` returns true.

Render a named region:

```tsx
<section
  aria-labelledby="gallery-title"
  aria-roledescription="carousel"
  aria-label="Silicone Solutions work gallery"
>
```

For each card, derive depth using `relativeGalleryPosition`. Use these normal-motion stack transforms:

```ts
const stack = [
  { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 40 },
  { x: 24, y: -12, scale: 0.97, rotate: 3, zIndex: 30 },
  { x: -18, y: -22, scale: 0.94, rotate: -4, zIndex: 20 },
  { x: 10, y: -30, scale: 0.91, rotate: 2, zIndex: 10 },
];
```

In reduced motion use `x: 0`, `rotate: 0`, and zero-duration transitions. Only depth `0` uses `aria-hidden="false"`; all others use `aria-hidden="true"`, `inert`, and `pointer-events: none`.

Render each image with explicit `1200x1600`, `className="h-auto w-full"`, and no fixed crop or `object-cover`. Put title, description, and sequence below the image within the card.

- [ ] **Step 7: Add navigation, swipe, dots, and announcements**

Implement circular previous/next. Attach `ArrowLeft`/`ArrowRight` to the focusable deck. Enable horizontal drag only for the active card in normal motion; on drag end:

- Offset `<= -50` moves next.
- Offset `>= 50` moves previous.
- Smaller offsets return to the current card.

Pause while pointer/focus/drag is active. Add explicit Previous/Next buttons. Add four dot buttons labelled `Show project 1` through `Show project 4`; active dot has `aria-current="true"`.

Add a polite live region with exact format:

```text
Showing project X of 4: <title>
```

- [ ] **Step 8: Run static verification**

Run:

```powershell
node --experimental-strip-types --test src/lib/gallery.test.mjs
corepack pnpm run media:verify
corepack pnpm run lint
corepack pnpm exec tsc --noEmit
corepack pnpm run build
corepack pnpm audit --audit-level=high
```

Expected: all commands exit `0`; unit output reports `3` passed and `0` failed; `out/` is regenerated.

- [ ] **Step 9: Run browser QA against the static export**

Verify:

- Exactly four cards and four dots.
- Initial active card is Washbasin sealing.
- Auto-advance changes the active card after `4500ms` in normal motion.
- Pointer, focus, and drag each prevent advance for at least `5000ms`.
- Reduced motion prevents auto-advance for at least `5000ms` and computes zero rotation.
- Previous/next, `ArrowLeft`, `ArrowRight`, every dot, and both swipe directions select the expected circular index.
- Only the active card appears in the accessibility tree.
- Live region announces the exact project number and title.
- All images render at `3:4` without crop.
- No horizontal overflow at widths `320`, `390`, and `1440`.
- Gallery asset requests return `200`; browser console has no gallery errors.

- [ ] **Step 10: Commit and push after review**

After task-scoped review is clean, commit the implementation and push `feat/silicone-solutions-landing` as the Task 6B completion point.
