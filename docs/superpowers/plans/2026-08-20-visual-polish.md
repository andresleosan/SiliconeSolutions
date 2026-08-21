# Landing Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the visible layout defects reported in the landing page while preserving the existing navy/orange visual identity and copy.

**Architecture:** Keep the existing component boundaries. Fix the logo treatment in `LogoMark`, use a named navy button variant for reliable contrast, make the benefits and service cards content-driven, align the before/after figures from their shared grid, and remove the emoji at the content source.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Playwright.

## Global Constraints

- Do not add dependencies, endpoints, or data migrations.
- Preserve the existing public copy except for removing the requested emoji.
- Keep keyboard focus, reduced-motion behavior, responsive layouts, and existing contact routes intact.
- Use explicit CSS color rules when a utility class could inherit an unsafe contrast value.

---

### Task 1: Add regression coverage for the reported visual defects

**Files:**
- Modify: `qa/tests/landing.spec.ts`
- Modify: `qa/tests/conversion.spec.ts`

**Interfaces:**
- Consumes: Existing landing page selectors and computed browser styles.
- Produces: Failing regression checks for logo overflow, CTA contrast, compact benefit cards, service-card alignment, aligned before/after figures, and the removed emoji.

- [x] **Step 1: Add assertions for the visual contracts**

Add tests that assert:

```ts
await expect(page.locator(".logo-mark")).toHaveCSS("overflow", "hidden");
await expect(page.locator("section[aria-labelledby='final-cta-title'] a").first()).toHaveCSS(
  "color",
  "rgb(250, 250, 248)",
);
await expect(page.locator("section[aria-labelledby='benefits-title'] article").first()).toHaveCSS(
  "min-height",
  "0px",
);
await expect(page.locator("#services-rail")).toHaveCSS("align-items", "flex-start");
await expect(page.locator("section[aria-labelledby='testimonials-title'] blockquote").first()).not.toContainText("👌");
```

For the before/after figures, compare the desktop bounding-box `y` values and require them to match within one pixel.

- [x] **Step 2: Run the focused tests and verify they fail for the current implementation**

Run: `pnpm exec playwright test qa/tests/landing.spec.ts qa/tests/conversion.spec.ts`

Expected: FAIL on the new visual assertions because the current logo is not clipped, the benefit cards have a fixed minimum height, the carousel rail stretches its cards, the comparison figures are offset, and the testimonial still contains the emoji.

### Task 2: Implement the minimal visual corrections

**Files:**
- Modify: `src/components/LogoMark.tsx`
- Modify: `src/components/FinalCTA.tsx`
- Modify: `src/components/ServicesCarousel.tsx`
- Modify: `src/components/WhyChooseUs.tsx`
- Modify: `src/components/ProblemSection.tsx`
- Modify: `src/content.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: Existing component props, service data, testimonial data, and CSS variables.
- Produces: The same public landing structure with corrected visual geometry and accessible CTA contrast.

- [x] **Step 1: Clip the logo inside its oval surface**

Add `overflow: hidden` and a solid white surface to `.logo-mark`. Keep the existing image dimensions and rounded shape so the original logo artwork remains legible without a visible rectangular edge.

- [x] **Step 2: Give the navy CTA a named contrast-safe variant**

Add `.button--navy` to `app/globals.css` with `background: var(--navy)` and `color: var(--warm-white)`, then replace the CTA's arbitrary color utilities with `button button--navy`.

- [x] **Step 3: Make cards content-driven**

Remove the forced benefit-card minimum height. Add `items-start` to the services rail so cards no longer stretch to the tallest sibling. Keep the card body and benefit border, but let each card end after its own content.

- [x] **Step 4: Align the before/after figures**

Use top alignment on the desktop image grid and remove the extra bottom offset from the second figure. Preserve the existing mobile single-column flow.

- [x] **Step 5: Remove the requested emoji at the content source**

Delete only the `👌` character from the verified testimonial quote.

- [x] **Step 6: Run the focused tests and verify they pass**

Run: `pnpm exec playwright test qa/tests/landing.spec.ts qa/tests/conversion.spec.ts`

Expected: PASS with no failed tests.

### Task 3: Run the full verification cycle

**Files:**
- Inspect: All modified files and the generated test report.

**Interfaces:**
- Consumes: The corrected landing page and regression coverage.
- Produces: Build, lint, media, and full Playwright evidence for review.

- [x] **Step 1: Run lint and production build**

Run: `pnpm lint`

Run: `pnpm build`

Expected: Both commands exit with code 0.

- [x] **Step 2: Run media verification**

Run: `pnpm media:verify`

Expected: The existing media inventory passes without errors.

- [x] **Step 3: Run the complete browser suite**

Run: `pnpm exec playwright test`

Expected: All Playwright tests pass and the HTML report is generated in `qa/reports`.

- [x] **Step 4: Review the diff for scope and security**

Run: `git diff --check`

Inspect the final diff to confirm it contains only presentation/content changes, no secrets, no new network calls, and no unrelated edits.
