# Social Share Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a branded `1200 x 630` Open Graph image and complete social metadata so shared Silicone Solutions links render a useful WhatsApp preview.

**Architecture:** Generate one repository-owned PNG with the existing `sharp` dependency and commit the generated asset under `public/`. Set `metadataBase`, canonical metadata, Open Graph image fields, and Twitter summary-card fields in `app/layout.tsx`; the static export will copy both the metadata and PNG into `out/` without runtime services.

**Tech Stack:** Next.js 16 App Router metadata, static export, TypeScript/React, Node.js ESM, Sharp, Playwright.

## Global Constraints

- Canvas: static `1200 x 630` pixels, suitable for WhatsApp, Facebook, and LinkedIn.
- Background: the site's navy `#0F172A`.
- Brand mark: the existing `public/images/logo-clean.webp` in the upper-left area, placed on a light surface for legibility.
- Accent: the site's orange `#F97316` as a restrained divider or edge detail.
- Primary text: `Professional Silicone Sealing in Jersey`.
- Supporting text: `Clean workmanship. Durable results.`.
- Footer: `Silicone Solutions C.I. Ltd` and `siliconesolutions.pages.dev`.
- No photographic background: the clean composition is more legible at WhatsApp's preview size and avoids unpredictable contrast over image detail.
- Add one static, repository-owned Open Graph image under `public/`.
- Extend the root Next.js metadata with an absolute production URL, canonical URL, Open Graph image metadata, and Twitter summary-card metadata.
- Keep the implementation compatible with the existing static export: no runtime image generation, external image service, or new server dependency.
- Use the confirmed production host `https://siliconesolutions.pages.dev` for the canonical URL and absolute image URL.
- Do not add analytics, tracking parameters, a CMS, remote asset hosting, or a new social channel.
- Do not alter the visible landing-page layout.

---

### Task 1: Add The Failing Social Metadata Test

**Files:**
- Create: `qa/tests/social-preview.spec.ts`
- Read: `playwright.config.ts` for the existing static-export web server and reporter.

**Interfaces:**
- Consumes: the root HTML served at `/` by `qa/serve-static.mjs`.
- Produces: a browser-level contract for canonical, Open Graph, Twitter, and image metadata.

- [ ] **Step 1: Write the failing test**

Create `qa/tests/social-preview.spec.ts` with this exact test:

```ts
import { expect, test } from "@playwright/test";

test("exposes complete social sharing metadata and the static preview image", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://siliconesolutions.pages.dev/",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://siliconesolutions.pages.dev/",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://siliconesolutions.pages.dev/og-image.png",
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    "Silicone Solutions professional silicone sealing in Jersey",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    "https://siliconesolutions.pages.dev/og-image.png",
  );

  const imageResponse = await page.request.get("/og-image.png");
  expect(imageResponse.ok()).toBe(true);
  expect(imageResponse.headers()["content-type"]).toContain("image/png");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `corepack pnpm run build`

Expected: the build may pass, because the current page is valid, but the following test must fail because the current metadata has no canonical URL, absolute Open Graph image, or Twitter card:

Run: `corepack pnpm exec playwright test qa/tests/social-preview.spec.ts`

Expected: FAIL on the first missing metadata assertion, not a test-runner error.

- [ ] **Step 3: Commit the red test**

```sh
git add qa/tests/social-preview.spec.ts
git commit -m "test: define social preview metadata contract"
```

### Task 2: Generate The Approved Static Preview Image

**Files:**
- Create: `scripts/generate-social-preview.mjs`
- Create: `public/og-image.png` by running the generator.
- Modify: `package.json` to add the `social:prepare` script.

**Interfaces:**
- Consumes: `public/images/logo-clean.webp` and the approved copy/color constants.
- Produces: `public/og-image.png`, exactly `1200 x 630` pixels, encoded as PNG.

- [ ] **Step 1: Write the generator**

Create `scripts/generate-social-preview.mjs` using the already-installed `sharp` package. It must:

```js
import sharp from "sharp";

const width = 1200;
const height = 630;
const navy = "#0F172A";
const orange = "#F97316";
const warmWhite = "#FAFAF8";

const textOverlay = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="${navy}"/>
    <rect x="64" y="56" width="380" height="154" rx="20" fill="${warmWhite}"/>
    <rect x="86" y="278" width="170" height="8" rx="4" fill="${orange}"/>
    <text x="86" y="360" fill="${warmWhite}" font-family="Arial, sans-serif" font-size="54" font-weight="700">Professional</text>
    <text x="86" y="424" fill="${warmWhite}" font-family="Arial, sans-serif" font-size="54" font-weight="700">Silicone Sealing</text>
    <text x="86" y="474" fill="${warmWhite}" font-family="Arial, sans-serif" font-size="30">in Jersey</text>
    <text x="86" y="535" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="25">Clean workmanship. Durable results.</text>
    <text x="86" y="586" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="20">Silicone Solutions C.I. Ltd</text>
    <text x="1114" y="586" fill="${orange}" font-family="Arial, sans-serif" font-size="20" text-anchor="end">siliconesolutions.pages.dev</text>
  </svg>
`);

const logo = await sharp("public/images/logo-clean.webp")
  .resize({ width: 320, height: 120, fit: "contain" })
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
    { input: logo, top: 73, left: 94 },
  ])
  .png({ compressionLevel: 9 })
  .toFile("public/og-image.png");
```

The SVG overlay must remain behind the logo so the logo stays on the light panel. The generated file is a release asset, not a runtime artifact.

- [ ] **Step 2: Add the reproducible package script**

Add this entry to the existing `scripts` object in `package.json`:

```json
"social:prepare": "node scripts/generate-social-preview.mjs"
```

- [ ] **Step 3: Generate and inspect the asset**

Run: `corepack pnpm run social:prepare`

Run: `corepack pnpm exec node -e "import('sharp').then(async ({default: sharp}) => console.log(await sharp('public/og-image.png').metadata()))"`

Expected: the output reports `format: 'png'`, `width: 1200`, and `height: 630`.

- [ ] **Step 4: Commit the asset generator and image**

```sh
git add package.json scripts/generate-social-preview.mjs public/og-image.png
git commit -m "feat: add branded social preview image"
```

### Task 3: Add Canonical And Social Metadata

**Files:**
- Modify: `app/layout.tsx:14-26`.

**Interfaces:**
- Consumes: `public/og-image.png` from Task 2 and the confirmed production host.
- Produces: absolute canonical, Open Graph, and Twitter metadata in the generated root HTML.

- [ ] **Step 1: Add the metadata implementation**

Update the metadata block to use one site URL and these fields:

```ts
const siteUrl = "https://siliconesolutions.pages.dev";
const socialImageAlt = "Silicone Solutions professional silicone sealing in Jersey";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Professional Silicone Sealing in Jersey | Silicone Solutions",
  description:
    "Professional silicone sealing across Jersey for homes and businesses. Clean workmanship, durable results and competitive pricing.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Professional Silicone Sealing in Jersey | Silicone Solutions",
    description:
      "Professional silicone sealing across Jersey for homes and businesses. Clean workmanship, durable results and competitive pricing.",
    url: "/",
    type: "website",
    locale: "en_GB",
    siteName: siteCopy.businessName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: socialImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Silicone Sealing in Jersey | Silicone Solutions",
    description:
      "Professional silicone sealing across Jersey for homes and businesses. Clean workmanship, durable results and competitive pricing.",
    images: ["/og-image.png"],
  },
};
```

Keep `siteUrl` and `socialImageAlt` near the metadata declaration, and do not change the visible layout or JSON-LD contact values.

- [ ] **Step 2: Run the focused test to verify it passes**

Run: `corepack pnpm run build`

Run: `corepack pnpm exec playwright test qa/tests/social-preview.spec.ts`

Expected: the focused test passes, including the PNG request from the static server.

- [ ] **Step 3: Commit the metadata change**

```sh
git add app/layout.tsx
git commit -m "feat: add social sharing metadata"
```

### Task 4: Run Full Verification And Review Generated Output

**Files:**
- Read: `out/index.html` and generated `out/og-image.png` after build.
- Modify: no source files unless a verification failure identifies a concrete issue.

**Interfaces:**
- Consumes: all source and generated assets from Tasks 1-3.
- Produces: verified static export ready for a deployment release.

- [ ] **Step 1: Run the complete existing verification suite**

Run each command separately:

```sh
corepack pnpm run lint
corepack pnpm exec tsc --noEmit
node --experimental-strip-types --test src/lib/contact.test.mjs src/lib/gallery.test.mjs
corepack pnpm run media:verify
corepack pnpm run test:e2e
corepack pnpm audit --audit-level=high
```

Expected: every command exits with code `0`; the E2E report includes the new social preview test and no browser errors.

- [ ] **Step 2: Verify the exported metadata directly**

Run: `corepack pnpm exec node -e "import('node:fs/promises').then(async ({readFile}) => { const html = await readFile('out/index.html', 'utf8'); for (const token of ['https://siliconesolutions.pages.dev/', 'https://siliconesolutions.pages.dev/og-image.png', 'og:image:width', 'og:image:height', 'og:image:alt', 'summary_large_image']) { if (!html.includes(token)) throw new Error('Missing metadata: ' + token); } console.log('social metadata verified'); })"`

Expected: `social metadata verified`.

- [ ] **Step 3: Check the public asset dimensions again**

Run: `corepack pnpm exec node -e "import('sharp').then(async ({default: sharp}) => { const {format, width, height} = await sharp('out/og-image.png').metadata(); if (format !== 'png' || width !== 1200 || height !== 630) throw new Error('Invalid exported social image'); console.log({format, width, height}); })"`

Expected: `{ format: 'png', width: 1200, height: 630 }`.

- [ ] **Step 4: Review the final diff and worktree**

Run: `git status --short --branch`

Run: `git diff HEAD~3..HEAD --stat`

Expected: only the social preview spec, implementation plan, generator, generated image, `package.json`, `app/layout.tsx`, and focused test are included in the feature commits; no unrelated files or secrets are present.

- [ ] **Step 5: Commit any final documentation only if needed**

If verification reveals no documentation gap, make no extra commit. If the plan or README needs a concrete correction discovered by verification, edit only that file and use:

```sh
git add <corrected-document>
git commit -m "docs: clarify social preview verification"
```
