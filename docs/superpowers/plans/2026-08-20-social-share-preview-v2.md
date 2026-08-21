# Social Share Preview V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cached Open Graph PNG with a more legible, versioned JPEG while keeping the shared URL exactly `https://siliconesolutions.pages.dev/`.

**Architecture:** Extend the existing Sharp generator to produce `public/og-image-v2.jpg` without deleting the existing `public/og-image.png`. Update root Open Graph/Twitter metadata and the E2E contract to reference the new JPEG; the versioned filename forces WhatsApp to fetch a new image for the clean URL.

**Tech Stack:** Next.js 16 App Router metadata, static export, Node.js ESM, Sharp, Playwright.

## Global Constraints

- Canvas: static `1200 x 630` pixels.
- Background: the site's navy `#0F172A`.
- Brand mark: the existing Silicone Solutions logo, substantially larger and centered inside a light `#FAFAF8` panel.
- Accent: a restrained orange `#F97316` line and brand detail.
- Image text: one short, high-legibility line, `Professional Silicone Sealing in Jersey`.
- Supporting brand: `Silicone Solutions C.I. Ltd` only; do not repeat the domain or long description inside the image because WhatsApp renders those outside the thumbnail.
- No small footer copy, no photo background, and no dense multi-line text.
- Generate a new repository-owned image at `public/og-image-v2.jpg`.
- Update Open Graph and Twitter metadata to reference `/og-image-v2.jpg` while keeping the existing absolute production URL and dimensions.
- Keep `/og-image.png` available for rollback until the new deployment is confirmed.
- Keep the implementation compatible with the static export; no runtime image service or external dependency.
- The versioned image URL is the cache-busting mechanism. The shared URL remains exactly `https://siliconesolutions.pages.dev/`.
- Do not modify the visible landing page.
- Do not change the canonical URL or add query parameters to the shared link.

---

### Task 1: Change The Social Preview Contract To V2

**Files:**
- Modify: `qa/tests/social-preview.spec.ts`.
- Read: `playwright.config.ts` and the existing `app/layout.tsx` metadata.

**Interfaces:**
- Consumes: the root static HTML and both image paths served by `qa/serve-static.mjs`.
- Produces: a failing contract requiring the new absolute JPEG URL while confirming the existing PNG remains available for rollback.

- [ ] **Step 1: Update the test expectations first**

In `qa/tests/social-preview.spec.ts`, change the image URL assertions to:

```ts
await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
  "content",
  "https://siliconesolutions.pages.dev/og-image-v2.jpg",
);
await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute(
  "content",
  "image/jpeg",
);
await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
  "content",
  "https://siliconesolutions.pages.dev/og-image-v2.jpg",
);
```

Replace the image request block with:

```ts
const imageResponse = await page.request.get("/og-image-v2.jpg");
expect(imageResponse.ok()).toBe(true);
expect(imageResponse.headers()["content-type"]).toContain("image/jpeg");
const imageMetadata = await sharp(await imageResponse.body()).metadata();
expect(imageMetadata.format).toBe("jpeg");
expect(imageMetadata.width).toBe(1200);
expect(imageMetadata.height).toBe(630);

const rollbackImageResponse = await page.request.get("/og-image.png");
expect(rollbackImageResponse.ok()).toBe(true);
expect(rollbackImageResponse.headers()["content-type"]).toContain("image/png");
```

Keep the existing title, description, canonical, Twitter, alt, and real-dimension assertions unchanged.

- [ ] **Step 2: Run the focused test to verify it fails for the missing V2 asset**

Run: `corepack pnpm run build`

Run: `corepack pnpm exec playwright test qa/tests/social-preview.spec.ts`

Expected: FAIL because the current metadata still references `/og-image.png` and `/og-image-v2.jpg` does not exist. The failure must be an assertion or missing resource, not a test-runner error.

- [ ] **Step 3: Commit the red contract**

```sh
git add qa/tests/social-preview.spec.ts
git commit -m "test: require versioned social preview image"
```

### Task 2: Generate The V2 JPEG Without Removing The Rollback PNG

**Files:**
- Modify: `scripts/generate-social-preview.mjs`.
- Create: `public/og-image-v2.jpg` by running the generator.
- Preserve: `public/og-image.png` unchanged.

**Interfaces:**
- Consumes: `public/images/logo-clean.webp` and the approved colors/copy.
- Produces: `public/og-image-v2.jpg`, exactly `1200 x 630` pixels, encoded as JPEG.

- [ ] **Step 1: Replace the generator composition**

Keep the existing project-root path resolution and replace the SVG/image composition with this layout:

```js
const textOverlay = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="${navy}"/>
    <rect x="220" y="56" width="760" height="300" rx="28" fill="${warmWhite}"/>
    <rect x="360" y="414" width="480" height="8" rx="4" fill="${orange}"/>
    <text x="600" y="500" fill="${warmWhite}" font-family="Arial, sans-serif" font-size="46" font-weight="700" text-anchor="middle">Professional Silicone Sealing in Jersey</text>
    <text x="600" y="554" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="24" text-anchor="middle">Silicone Solutions C.I. Ltd</text>
  </svg>
`);

const logo = await sharp(path.join(publicDirectory, "images", "logo-clean.webp"))
  .resize({ width: 620, height: 250, fit: "contain", background: warmWhite })
  .png()
  .toBuffer();

await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: navy,
  },
})
  .composite([
    { input: textOverlay, top: 0, left: 0 },
    { input: logo, top: 81, left: 290 },
  ])
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
  .toFile(path.join(publicDirectory, "og-image-v2.jpg"));
```

Do not change the existing `og-image.png` output in this task. The existing PNG is the rollback asset and must remain byte-for-byte available.

- [ ] **Step 2: Generate and validate the V2 asset**

Run: `corepack pnpm run social:prepare`

Run: `corepack pnpm exec node -e "import('sharp').then(async ({default: sharp}) => { const v2 = await sharp('public/og-image-v2.jpg').metadata(); const old = await sharp('public/og-image.png').metadata(); if (v2.format !== 'jpeg' || v2.width !== 1200 || v2.height !== 630) throw new Error('Invalid V2 image'); if (old.format !== 'png' || old.width !== 1200 || old.height !== 630) throw new Error('Rollback image changed'); console.log({v2, old}); })"`

Expected: V2 reports `format: 'jpeg'`, `width: 1200`, `height: 630`; the rollback image reports `format: 'png'`, `width: 1200`, `height: 630`.

- [ ] **Step 3: Confirm the thumbnail-safe composition**

Use Sharp to resize `public/og-image-v2.jpg` to `220 x 116` and inspect the generated preview visually. The logo must remain the dominant element, the title must be legible at thumbnail scale, and no content may be clipped at the image edges.

- [ ] **Step 4: Commit the generator and V2 image**

```sh
git add scripts/generate-social-preview.mjs public/og-image-v2.jpg
git commit -m "feat: add WhatsApp thumbnail social preview"
```

### Task 3: Point Metadata At The Versioned JPEG

**Files:**
- Modify: `app/layout.tsx:29-43`.

**Interfaces:**
- Consumes: `public/og-image-v2.jpg` from Task 2.
- Produces: absolute Open Graph and Twitter image metadata for the new JPEG while preserving the existing canonical URL and copy.

- [ ] **Step 1: Update both metadata image descriptors**

Change the Open Graph image object to:

```ts
{
  url: "/og-image-v2.jpg",
  type: "image/jpeg",
  width: 1200,
  height: 630,
  alt: socialImageAlt,
}
```

Change the Twitter image object to:

```ts
images: [{ url: "/og-image-v2.jpg", alt: socialImageAlt }],
```

Do not modify `siteUrl`, canonical tags, title, descriptions, or the visible layout.

- [ ] **Step 2: Run the focused test to verify it passes**

Run: `corepack pnpm run build`

Run: `corepack pnpm exec playwright test qa/tests/social-preview.spec.ts`

Expected: `1 passed`, including the new JPEG URL, MIME type, dimensions, and rollback PNG checks.

- [ ] **Step 3: Commit the metadata change**

```sh
git add app/layout.tsx
git commit -m "feat: point social metadata to versioned image"
```

### Task 4: Full Verification And Clean-URL Deployment Check

**Files:**
- Modify: `docs/releases/2026-08-20-social-share-preview.md` with the V2 release note and rollback commit range.
- Read: generated `out/index.html`, `out/og-image-v2.jpg`, and the deployed clean URL.

**Interfaces:**
- Consumes: all source and generated assets from Tasks 1-3.
- Produces: verified local export and documented deployment evidence for `https://siliconesolutions.pages.dev/`.

- [ ] **Step 1: Run the full local verification suite**

Run each command separately:

```sh
corepack pnpm run lint
corepack pnpm exec tsc --noEmit
node --experimental-strip-types --test src/lib/contact.test.mjs src/lib/gallery.test.mjs
corepack pnpm run media:verify
corepack pnpm run test:e2e
corepack pnpm audit --audit-level=high
```

Expected: all commands exit `0`; E2E reports `26/26` or the current full suite count with zero failures.

- [ ] **Step 2: Verify the generated HTML and JPEG directly**

Run: `corepack pnpm exec node -e "import('node:fs/promises').then(async ({readFile}) => { const html = await readFile('out/index.html', 'utf8'); for (const token of ['https://siliconesolutions.pages.dev/og-image-v2.jpg', 'og:image:type', 'image/jpeg']) { if (!html.includes(token)) throw new Error('Missing V2 metadata: ' + token); } console.log('V2 metadata verified'); })"`

Run: `corepack pnpm exec node -e "import('sharp').then(async ({default: sharp}) => { const {format, width, height} = await sharp('out/og-image-v2.jpg').metadata(); if (format !== 'jpeg' || width !== 1200 || height !== 630) throw new Error('Invalid exported V2 image'); console.log({format, width, height}); })"`

Expected: metadata verification succeeds and the exported image reports JPEG `1200x630`.

- [ ] **Step 3: Verify the clean production URL after deployment**

Request `https://siliconesolutions.pages.dev/` with a cache-busting request header or deployment check, then assert:

```text
HTTP 200 for the HTML
og:image = https://siliconesolutions.pages.dev/og-image-v2.jpg
og:image:type = image/jpeg
HTTP 200 for /og-image-v2.jpg
Content-Type = image/jpeg
```

Do not change the shared URL to include `?v=2`; the filename version is the cache-busting mechanism.

- [ ] **Step 4: Update release notes and review the final state**

Document the V2 asset, deployment verification, and rollback sequence in `docs/releases/2026-08-20-social-share-preview.md`. Run:

```sh
git status --short --branch
```

Expected: clean worktree after the release-note commit, with no unrelated files.

### Task 5: Simplify The Mobile Contact Bar

**Files:**
- Modify: `app/globals.css:326-359`.
- Modify: `qa/tests/landing.spec.ts` in the mobile viewport coverage.
- Read: `src/components/MobileContactBar.tsx` for the existing accessible labels and link structure.

**Interfaces:**
- Consumes: the existing `MobileContactBar` markup and site color variables.
- Produces: a transparent mobile bar with two independently colored buttons, without changing contact URLs or desktop visibility.

- [ ] **Step 1: Add the failing mobile style assertions**

In the mobile viewport loop in `qa/tests/landing.spec.ts`, after locating `contactBar`, add a mobile-only assertion block:

```ts
const barStyles = await contactBar.evaluate((element) => {
  const styles = getComputedStyle(element);
  return {
    backgroundColor: styles.backgroundColor,
    borderWidth: styles.borderWidth,
    borderStyle: styles.borderStyle,
    boxShadow: styles.boxShadow,
  };
});
expect(barStyles.backgroundColor).toBe("rgba(0, 0, 0, 0)");
expect(barStyles.borderWidth).toBe("0px");
expect(barStyles.borderStyle).toBe("none");
expect(barStyles.boxShadow).toBe("none");

const whatsappStyles = await contactBar
  .getByRole("link", { name: "WhatsApp", exact: true })
  .evaluate((element) => {
    const styles = getComputedStyle(element);
    return { backgroundColor: styles.backgroundColor, color: styles.color };
  });
expect(whatsappStyles.backgroundColor).toBe("rgb(15, 23, 42)");
expect(whatsappStyles.color).toBe("rgb(250, 250, 248)");

const callStyles = await contactBar
  .getByRole("link", { name: "Call Now", exact: true })
  .evaluate((element) => {
    const styles = getComputedStyle(element);
    return { backgroundColor: styles.backgroundColor, color: styles.color };
  });
expect(callStyles.backgroundColor).toBe("rgb(249, 115, 22)");
expect(callStyles.color).toBe("rgb(15, 23, 42)");
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `corepack pnpm run build`

Run: `corepack pnpm exec playwright test qa/tests/landing.spec.ts -g "fits mobile and desktop viewports"`

Expected: FAIL because the current bar has navy background, white border, stone shadow, and the WhatsApp action has no navy background.

- [ ] **Step 3: Apply the minimal CSS change**

Update `.mobile-contact-bar` to retain its fixed positioning and two-column layout while using:

```css
padding: 0;
border: 0;
background: transparent;
box-shadow: none;
```

Update `.mobile-contact-bar__action` to use the WhatsApp color treatment by default:

```css
background: var(--navy);
color: var(--warm-white);
```

Keep `.mobile-contact-bar__action--primary` orange with navy text. Replace the combined hover selector so hovering WhatsApp does not turn it orange; the two actions must retain their respective colors in their default state. Do not change markup, labels, hrefs, desktop hiding, or safe-area spacing.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `corepack pnpm run build`

Run: `corepack pnpm exec playwright test qa/tests/landing.spec.ts -g "fits mobile and desktop viewports"`

Expected: PASS with the transparent bar, navy WhatsApp button, orange Call Now button, and unchanged desktop-hidden behavior.

- [ ] **Step 5: Commit the mobile bar task**

```sh
git add app/globals.css qa/tests/landing.spec.ts
git commit -m "fix: simplify mobile contact bar"
```
