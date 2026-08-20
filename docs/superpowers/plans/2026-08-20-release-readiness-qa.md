# Release Readiness QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close Task 8 with reproducible release-level browser coverage, measured accessibility and performance fixes, accurate local static-export instructions, and Lighthouse scores of at least 95 in every requested category on mobile and desktop.

**Architecture:** Keep the existing Next.js static export and the established `qa/tests` Playwright layout. Extend the local static server so video requests behave like a real static host, add one release-readiness browser suite, correct only the issues demonstrated by the Lighthouse baseline, and record fresh final measurements in `README.md`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Playwright 1.62, Sharp 0.35, Lighthouse 13.4.1, pnpm 11.21.0.

## Global Constraints

- Keep `app/page.tsx` server-rendered and preserve the currently approved order, including `WorkGallery` between `BeforeAfterSlider` and `WhyChooseUs`.
- Keep the site as `output: "export"`; do not add a backend, storage, analytics, cookies, payments, CMS, or deployment.
- Use only confirmed contact details: `+44 7700 323453`, `davidcameron481@yahoo.com`, and `Jersey, Channel Islands`.
- Keep `15+ years of experience`; do not invent claims, social profiles, or reviews.
- Keep the two provisional testimonials visibly labelled `Example review` and `Example review - replace before launch`.
- Preserve the original local media assets. Performance derivatives may change format or dimensions only when they preserve the source aspect ratio and visible composition.
- Keep autoplay muted, looping and inline for users without reduced motion; reduced-motion users must continue to receive a paused poster state.
- Lighthouse must score at least 95 for Performance, Accessibility, Best Practices, and SEO in both mobile and desktop runs before completion is claimed.
- Use `corepack pnpm`; do not introduce npm or yarn artifacts.
- Do not deploy. Subagents must not use Git, read secrets, delegate, or approve the task.

## Measured Baseline

Lighthouse 13.4.1 was run against the production export at `http://127.0.0.1:4173` before any Task 8 code changes.

| Profile | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| Mobile | 73 | 87 | 100 | 100 |
| Desktop | 91 | 87 | 100 | 100 |

Measured causes:

- Mobile LCP is the hero video at `10.7s`; desktop LCP is `1.9s`.
- `qa/serve-static.mjs` always reads and returns the whole MP4 with status `200`; it does not implement byte ranges.
- `public/images/logo-clean.png` is `620,718` bytes and Lighthouse estimates more than `600 KiB` waste at its rendered size.
- Service icon wrappers apply `aria-label` to roleless `<div>` elements.
- `AboutSection` nests each `<dt>/<dd>` pair below a second `<div>`, which breaks definition-list semantics.
- The four solution step numbers use orange small text on warm white at `2.68:1`.
- The visible email address is omitted from the links' `aria-label` values.

---

### Task 1: Build and verify the release gate

**Files:**
- Create: `qa/tests/landing.spec.ts`
- Modify: `qa/serve-static.mjs`
- Modify: `package.json`
- Modify: `src/components/ServicesCarousel.tsx`
- Modify: `src/components/AboutSection.tsx`
- Modify: `src/components/ProblemSection.tsx`
- Modify: `src/components/QuoteForm.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/LogoMark.tsx`
- Modify: `scripts/prepare-media.mjs`
- Modify: `scripts/verify-media.mjs`
- Create: `public/images/logo-clean.webp`
- Modify: `app/layout.tsx`
- Create: `README.md`

**Interfaces:**
- `qa/serve-static.mjs` serves `out/` on `PORT` or `4173`, rejects traversal, supports `HEAD`, and returns valid single byte ranges for static assets.
- `qa/tests/landing.spec.ts` runs through the existing `playwright.config.ts` and never follows a real WhatsApp handoff.
- `pnpm start` serves a previously generated `out/` directory with `qa/serve-static.mjs`; `pnpm run build` remains the export command.
- `public/images/logo-clean.webp` is a `512x321` same-aspect derivative generated from `logo-clean.png`; the source PNG remains present.
- `README.md` records actual final Lighthouse values, not targets or estimates.

- [ ] **Step 1: Write the release-readiness browser tests**

Create `qa/tests/landing.spec.ts` with four tests:

1. Verify the exact direct-child section sequence under `main`:

```ts
expect(
  await page.locator("main > section").evaluateAll((sections) =>
    sections.map(
      (section) => section.getAttribute("aria-labelledby") ?? section.getAttribute("aria-label"),
    ),
  ),
).toEqual([
  "hero-title",
  "Why customers choose us",
  "problem-title",
  "about-title",
  "services-title",
  "comparison-title",
  "gallery-title",
  "benefits-title",
  "process-title",
  "testimonials-title",
  "quote-title",
  "final-cta-title",
]);
```

Also assert exactly one `main`, one `footer`, the hero heading `The Perfect Finish. Every Time.`, the first `Call Now` route `tel:+447700323453`, and the first WhatsApp route containing `wa.me/447700323453`.

2. At `390x844` and `1440x1000`, assert `document.documentElement.scrollWidth <= window.innerWidth`, no `console` errors, no `pageerror`, and that the fixed mobile contact bar is visible only at the mobile width. At mobile width, assert the footer can be scrolled above the contact bar rather than being permanently covered.

3. Assert the measured accessibility regressions cannot return:
   - Service icon wrappers have `aria-hidden="true"` and no `aria-label`.
   - Every direct child of the About `<dl>` contains a direct `<dt>` and `<dd>`.
   - Each email link's accessible name includes the visible address `davidcameron481@yahoo.com`.
   - Each of the four solution step numbers has an effective text/background contrast ratio of at least `4.5:1`.

4. Request `/video/silicone-solutions.mp4` with `Range: bytes=0-99` and assert status `206`, body length `100`, `accept-ranges: bytes`, `cache-control: public, max-age=3600`, and `content-range: bytes 0-99/4078835`. Repeat with `Range: bytes=-100` and assert the final 100 bytes are returned as `bytes 4078735-4078834/4078835`. Send `HEAD` without a range and assert status `200`, `content-length: 4078835`, and an empty body. Send an unsatisfiable range and assert status `416` with `content-range: bytes */4078835`.

- [ ] **Step 2: Run the release suite and confirm RED**

Run:

```powershell
corepack pnpm run test:e2e qa/tests/landing.spec.ts
```

Expected: FAIL on current accessibility findings and MP4 range behavior. Existing composition and route assertions may already pass.

- [ ] **Step 3: Implement realistic static range responses**

Update `qa/serve-static.mjs` to use `createReadStream` and file size from `stat`. Accept only one `bytes=start-end` range, clamp an omitted end to `size - 1`, support suffix ranges, and reject malformed or unsatisfiable ranges with `416` and `Content-Range: bytes */<size>`.

For a valid range, return:

```ts
{
  status: 206,
  headers: {
    "Accept-Ranges": "bytes",
    "Content-Range": `bytes ${start}-${end}/${size}`,
    "Content-Length": String(end - start + 1),
  },
}
```

For a full response, return `200`, `Accept-Ranges: bytes`, and the complete `Content-Length`. A `HEAD` request returns identical headers without a body. Preserve the existing traversal guard and MIME types. Apply `Cache-Control: no-cache` to HTML and `Cache-Control: public, max-age=3600` to other local static assets; do not claim immutable caching for unhashed public files.

Change only the `start` script in `package.json`:

```json
"start": "node qa/serve-static.mjs"
```

- [ ] **Step 4: Correct the measured accessibility findings**

Apply these minimal markup changes:

- `ServicesCarousel`: replace the icon wrapper's `aria-label` with `aria-hidden="true"`; the adjacent service text already conveys its meaning.
- `AboutSection`: remove the inner wrapper around each `<dt>/<dd>` pair. Keep each direct `<dl>` child as the layout wrapper containing the decorative icon, `<dt>`, and `<dd>` directly; use grid columns so the icon and text retain their current visual alignment.
- `ProblemSection`: render each step number as an `inline-flex` navy badge with orange text, sufficient padding, and `aria-hidden="true"`. The following visible heading preserves the meaningful step content.
- `QuoteForm` and `Footer`: use `aria-label="Email Silicone Solutions: davidcameron481@yahoo.com"` so the accessible name contains the visible address and remains descriptive.

- [ ] **Step 5: Add the measured image optimization**

In `scripts/prepare-media.mjs`, generate a same-aspect display derivative after `logo-clean.png`:

```js
await sharp("public/images/logo-clean.png")
  .resize({ width: 512, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile("public/images/logo-clean.webp");
```

Add `public/images/logo-clean.webp` at `512x321` to `expectedAssets` in `scripts/verify-media.mjs`. Also read its file size with `stat` and fail media verification if it exceeds `100_000` bytes; this prevents the measured `620,718`-byte regression without modifying the original source asset.

Update `LogoMark` to use `/images/logo-clean.webp` with intrinsic dimensions `512x321` and preserve its existing natural aspect-ratio presentation.

Add this resource hint inside `<head>` in `app/layout.tsx` so the video poster is discoverable at high priority before the autoplay MP4 competes for bandwidth:

```tsx
<link rel="preload" as="image" href="/images/services.webp" fetchPriority="high" />
```

- [ ] **Step 6: Generate media and make the focused suite GREEN**

Run:

```powershell
corepack pnpm run media:prepare
corepack pnpm run media:verify
corepack pnpm run test:e2e qa/tests/landing.spec.ts
```

Expected: derivative generated and verified; release-readiness browser tests pass.

- [ ] **Step 7: Run Lighthouse mobile and desktop against the production export**

Build, start `qa/serve-static.mjs`, then run pinned Lighthouse 13.4.1:

```powershell
corepack pnpm dlx lighthouse@13.4.1 http://127.0.0.1:4173 --quiet --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=qa/reports/lighthouse-mobile.json
corepack pnpm dlx lighthouse@13.4.1 http://127.0.0.1:4173 --quiet --chrome-flags="--headless --no-sandbox" --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=qa/reports/lighthouse-desktop.json
```

Read the four category scores from each JSON result. Every score must be at least `0.95`. If any score remains below `0.95`, do not hide or disable the audit: identify its failed weighted audit and apply one additional measured correction before repeating both profiles.

- [ ] **Step 8: Write accurate project and release instructions**

Create `README.md` in English with:

- Project purpose and confirmed Jersey contact channels.
- Requirements: Node.js compatible with Next.js 16 and Corepack/pnpm `11.21.0`.
- Exact local commands: `corepack pnpm install`, `corepack pnpm run dev`, `corepack pnpm run build`, and `corepack pnpm start` after a build.
- QA commands: unit tests, `media:verify`, lint, `tsc --noEmit`, `audit --audit-level=high`, and `test:e2e`.
- Static deployment settings: Cloudflare Pages preset `Next.js (Static HTML Export)`, build `pnpm run build`, output `out`, root `/`.
- Asset source note: originals came from the operator-provided local source folder and runtime files live under `public/images` and `public/video`; do not publish the operator's absolute filesystem path.
- A Lighthouse table containing the actual final mobile and desktop scores, Lighthouse `13.4.1`, date `2026-08-20`, and local production-export URL.
- An explicit pre-launch warning that the two provisional testimonials labelled `Example review` must be replaced with confirmed customer copy before public launch.

- [ ] **Step 9: Run the complete release matrix**

Run fresh:

```powershell
node --experimental-strip-types --test src/lib/contact.test.mjs src/lib/gallery.test.mjs
corepack pnpm run media:verify
corepack pnpm run lint
corepack pnpm exec tsc --noEmit
corepack pnpm audit --audit-level=high
corepack pnpm run test:e2e
```

Expected: `7/7` Node tests, all media checks, lint, TypeScript and audit pass; the complete Playwright count includes the four new release tests and has zero failures, console errors, page errors, or horizontal-overflow findings.

- [ ] **Step 10: Review and integrate Task 8**

After the independent task review, security baseline, fresh Lighthouse gate, and complete release matrix are clean, Cronos performs manual browser QA at `390px` and `1440px`. Verify landmarks and heading order, visible keyboard focus, keyboard operation of the services carousel and Before/After range, reduced-motion behavior, fixed mobile contact-bar spacing, and no horizontal overflow. Then stage only the Task 8 files and commit:

```powershell
git commit -m "test: verify landing release readiness"
```

Push only the feature branch. Do not deploy.
