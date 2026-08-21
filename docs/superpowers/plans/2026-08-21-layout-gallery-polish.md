# Layout And Gallery Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the remaining spacing, contrast, service-card, benefit-card, and gallery interaction issues shown in the latest review screenshots.

**Architecture:** Preserve the current component boundaries. Use named CSS variants for reliable button contrast, keep service media inside a shared 3:4 frame, align the problem-section image grid to its top edge, remove decorative labels/icons that consume space, and make gallery autoplay state change only from an active-image click or accessibility focus.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Playwright.

## Global Constraints

- Do not add dependencies, endpoints, or data migrations.
- Preserve the existing contact routes and responsive behavior.
- The gallery continues indefinitely in normal motion and has no visible pause button.
- A click on the active gallery image stops autoplay; keyboard focus and reduced motion remain respected.
- Decorative UI icons removed from benefit cards must not be replaced with emoji or text labels.

---

### Task 1: Add failing regression coverage

**Files:**
- Modify: `qa/tests/landing.spec.ts`
- Modify: `qa/tests/work-gallery.spec.ts`
- Modify: `qa/tests/work-gallery-interactions.spec.ts`

**Interfaces:**
- Consumes: Existing landing selectors, computed styles, and gallery controls.
- Produces: Regression checks for CTA hover contrast, problem-image alignment, service-media consistency, icon/label removal, absent pause control, and click-to-stop autoplay.

- [x] **Step 1: Update tests to the approved visual contract**

Assert the hero `Call Now` link becomes navy text on a warm-white background while hovered, the problem figures begin at the image-column top, all service image frames have equal height, the service overlay/name labels are absent, benefit cards contain no SVG icons, the gallery has no autoplay control, and clicking the active card keeps its project active after one interval.

- [x] **Step 2: Run the focused tests and verify they fail against the current implementation**

Run: `corepack pnpm exec playwright test qa/tests/landing.spec.ts qa/tests/work-gallery.spec.ts qa/tests/work-gallery-interactions.spec.ts`

Expected: FAIL because the current hero relies on arbitrary hover utilities, the problem grid vertically centers its figures, service image ratios differ, labels/icons remain, the pause control is rendered, and clicking the image does not disable autoplay.

### Task 2: Correct static layout and card presentation

**Files:**
- Modify: `app/globals.css`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/ProblemSection.tsx`
- Modify: `src/components/ServicesCarousel.tsx`
- Modify: `src/components/WhyChooseUs.tsx`

**Interfaces:**
- Consumes: Existing service and benefit props.
- Produces: Same accessible page structure with explicit contrast, compact benefit cards, aligned problem figures, uniform service frames, and no redundant visual labels.

- [x] **Step 1: Add a named ghost button variant**

Define `.button--ghost` with transparent background, warm-white text, and a translucent warm-white border. Define its hover state with warm-white background and navy text. Replace the hero `Call Now` utility-only styling with `button button--ghost`.

- [x] **Step 2: Force the problem image grid content to its top edge**

Add top content alignment to the nested image grid and keep both figures at the same starting y-coordinate on desktop. Do not change the mobile single-column flow.

- [x] **Step 3: Use a common service media frame**

Wrap each service image in a `3:4` aspect-ratio container and render the source with `object-contain` so the tall flyer remains visible while every card receives the same image height. Remove the `Service NN` overlay and the textual icon-name span, keeping the actual Lucide icon and service title.

- [x] **Step 4: Remove benefit-card decorative icons**

Delete the benefit icon imports/map and render only the number, title, and description with compact spacing.

- [x] **Step 5: Run focused layout tests**

Run: `corepack pnpm exec playwright test qa/tests/landing.spec.ts -g "reported visual|compact and aligned"`

Expected: PASS.

### Task 3: Make gallery autoplay click-to-stop

**Files:**
- Modify: `src/components/WorkGallery.tsx`
- Modify: `src/lib/gallery.ts`
- Modify: `qa/tests/work-gallery.spec.ts`
- Modify: `qa/tests/work-gallery-interactions.spec.ts`

**Interfaces:**
- Consumes: `canAutoAdvance` and existing active-card navigation.
- Produces: An autoplay loop that remains enabled after arrow/dot navigation, stops on an active-card click, pauses while keyboard focus/reduced motion requires it, and exposes no pause/start control.

- [x] **Step 1: Remove the visible autoplay toggle**

Delete the Pause/Play import and button. Keep `autoPlayEnabled` as internal state only so an active image click can stop the loop and the live-region announcement can remain accurate.

- [x] **Step 2: Stop autoplay only from the active image click**

Remove section-wide pointer-enter pausing and remove the `navigate` side effect that disables autoplay. Add an active-card click handler that sets `autoPlayEnabled` to false. Keep focus and dragging guards in `canAutoAdvance`.

- [x] **Step 3: Update the autoplay predicate and interaction tests**

Remove `pointerInside` from `AutoAdvanceState` and its test fixture. Replace pause-control assertions with no-control assertions and verify that clicking the active card prevents the next automatic transition.

- [x] **Step 4: Run gallery tests**

Run: `corepack pnpm exec playwright test qa/tests/work-gallery.spec.ts qa/tests/work-gallery-interactions.spec.ts`

Expected: PASS.

### Task 4: Full verification and self-critique

**Files:**
- Inspect: All modified files and the generated Playwright report.

**Interfaces:**
- Consumes: The corrected landing page and regression suite.
- Produces: Build, lint, media, security, and full browser evidence.

- [x] **Step 1: Run lint and the complete E2E suite**

Run: `corepack pnpm lint`

Run: `corepack pnpm test:e2e`

Expected: Lint exits 0 and all browser tests pass.

- [x] **Step 2: Run media and dependency checks**

Run: `corepack pnpm media:verify`

Run: `corepack pnpm audit --audit-level=high`

Expected: Media verification passes and no high-severity dependency vulnerabilities are reported.

- [x] **Step 3: Review the final diff**

Run: `git diff --check`

Inspect the diff for scope, secrets, new network calls, and accidental changes outside the six requested visual behaviors.
