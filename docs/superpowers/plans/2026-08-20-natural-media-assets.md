# Natural Media and Brand Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace and persist the updated media, show all media at natural proportions, correct the Before/After orientation and accessibility, and add clean logo/favicon assets for the static Cloudflare build.

**Architecture:** Keep GitHub as the durable source of truth by committing every production asset under `public/` or `app/`. Use a reproducible Sharp script to create uncropped optimized derivatives, then consume explicit intrinsic dimensions in React components so Next.js static export needs no runtime image service.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Sharp, pnpm 11.21.0, static export to `out/`, Playwright browser verification.

## Global Constraints

- Use pnpm exclusively; keep `pnpm-lock.yaml` and do not create `package-lock.json`.
- Runtime code must not reference `F:\Proyectos\SiliconeSolutions\Varios`.
- Final assets must be committed under `public/` or `app/` and included in `out/`.
- Preserve complete media content; no meaningful photo, video, flyer, or logo content may be cropped.
- Finished result is `After` on the left; original condition is `Before` on the right.
- `banera.jpg` is After and `banera-antes.jpg` is Before.
- Keep the palette `#0F172A`, `#F97316`, `#FAFAF8`, and `#E7E5E4`.
- Keep all visible copy in English.
- Respect keyboard input, touch input, visible focus, reduced motion, and WCAG AA.
- Do not introduce Cloudflare R2, a CMS, remote image hosting, backend storage, or production deployment.
- Do not push until the complete Task 6A review is clean.

---

### Task 1: Persist, optimize, and present natural media

**Files:**
- Create: `scripts/prepare-media.mjs`
- Create: `scripts/verify-media.mjs`
- Create: `public/images/logo-clean.png`
- Create: `public/images/services.webp`
- Create: `public/images/poceta.webp`
- Create: `public/images/lavamanos.webp`
- Create: `public/images/banera-antes.webp`
- Create: `public/images/banera.webp`
- Create: `app/icon.png`
- Replace: `public/video/silicone-solutions.mp4`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `src/content.ts`
- Modify: `src/components/LogoMark.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/ProblemSection.tsx`
- Modify: `src/components/AboutSection.tsx`
- Modify: `src/components/ServicesCarousel.tsx`
- Modify: `src/components/BeforeAfterSlider.tsx`
- Modify: `src/components/WorkGallery.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `scripts/prepare-media.mjs` reads committed JPG sources and writes uncropped derivatives with deterministic names and dimensions.
- `scripts/verify-media.mjs` verifies required files, expected dimensions, and the updated video SHA-256.
- `Service` and `GalleryItem` expose `width: number` and `height: number` with source paths pointing to committed optimized assets.
- `BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt })` keeps the existing public API while rendering After-left and Before-right.

- [ ] **Step 1: Write the failing media verifier**

Create `scripts/verify-media.mjs` with built-in `fs`, `crypto`, and Sharp metadata checks. It must fail unless all of these conditions hold:

```js
const expectedAssets = new Map([
  ["public/images/logo-clean.png", [1284, 805]],
  ["public/images/services.webp", [947, 2048]],
  ["public/images/poceta.webp", [1200, 1600]],
  ["public/images/lavamanos.webp", [1200, 1600]],
  ["public/images/banera-antes.webp", [1200, 1600]],
  ["public/images/banera.webp", [1200, 1600]],
  ["app/icon.png", [512, 512]],
]);

const expectedVideoHash =
  "8A4753019AC7F39E446E94E5F6A5634ED047199CCD5E87E274754D715DE577E2";
```

The verifier must also search `app/` and `src/` text files and fail if they contain `F:\\Proyectos\\SiliconeSolutions\\Varios`.

- [ ] **Step 2: Run the verifier and confirm failure**

Run: `corepack pnpm exec node scripts/verify-media.mjs`

Expected: non-zero exit because the clean logo, favicon, WebP derivatives, and updated video hash are not present yet.

- [ ] **Step 3: Add Sharp and deterministic media scripts**

Run: `corepack pnpm add -D sharp`

Add these scripts to `package.json`:

```json
{
  "media:prepare": "node scripts/prepare-media.mjs",
  "media:verify": "node scripts/verify-media.mjs"
}
```

Create `scripts/prepare-media.mjs` to perform these exact transformations without cropping the work photos:

```js
await sharp("public/images/logo.jpg")
  .extract({ left: 0, top: 250, width: 1284, height: 805 })
  .png({ compressionLevel: 9 })
  .toFile("public/images/logo-clean.png");

await sharp("public/images/logo.jpg")
  .extract({ left: 55, top: 285, width: 275, height: 445 })
  .resize({ width: 512, height: 512, fit: "contain", background: "#FAFAF8" })
  .png({ compressionLevel: 9 })
  .toFile("app/icon.png");
```

Generate WebP at quality `82`, preserving aspect ratio:

- `services.jpg` -> `services.webp`, no enlargement, `947x2048`.
- `poceta.jpg` -> `poceta.webp`, width `1200`, resulting `1200x1600`.
- `lavamanos.jpg` -> `lavamanos.webp`, width `1200`, resulting `1200x1600`.
- `banera-antes.jpg` -> `banera-antes.webp`, width `1200`, resulting `1200x1600`.
- `banera.jpg` -> `banera.webp`, width `1200`, resulting `1200x1600`.

- [ ] **Step 4: Import the updated video and generate derivatives**

Copy the binary source once from `F:\Proyectos\SiliconeSolutions\Varios\Video.mp4` to `public/video/silicone-solutions.mp4`, replacing the old file. This is an import operation only; no source-folder path may appear in application code.

Run: `corepack pnpm run media:prepare`

Expected: all seven generated image/brand files exist with the dimensions listed in Step 1.

- [ ] **Step 5: Update typed content and honest gallery descriptions**

Add intrinsic dimensions to `Service` and `GalleryItem`:

```ts
type MediaDimensions = {
  width: number;
  height: number;
};

export type Service = MediaDimensions & {
  title: string;
  description: string;
  benefit: string;
  image: string;
  imageAlt: string;
  icon: string;
};

export type GalleryItem = MediaDimensions & {
  src: string;
  alt: string;
  label: string;
};
```

Point content to `.webp` derivatives and use these gallery facts:

- `services.webp`: label `Services overview`; alt `Silicone Solutions service overview flyer with contact and service information`; dimensions `947x2048`.
- `poceta.webp`: label `Toilet base sealing`; alt `Clean white silicone seal around the base of a toilet`; dimensions `1200x1600`.
- `lavamanos.webp`: label `Washbasin sealing`; alt `Clean white silicone seal between a washbasin and blue splashback`; dimensions `1200x1600`.

- [ ] **Step 6: Render logo, video, and section images at natural proportions**

Update `LogoMark` to use `/images/logo-clean.png`, explicit `1284x805`, `width: 100%`, `height: auto`, and no `fill`, `object-cover`, or fixed aspect wrapper.

Update `Hero` video to remove the fixed `aspect-[4/5]` crop and use:

```tsx
<video className="block h-auto w-full" ... />
```

Keep autoplay, muted, loop, `playsInline`, local poster, and reduced-motion pause behavior.

Update Problem, About, Services, and Gallery images to use explicit dimensions from content or known `1200x1600` dimensions with `className="h-auto w-full"`. Remove `fill`, fixed aspect boxes, and `object-cover` where they crop meaningful content.

Change the gallery heading/body so it describes a mix of service information and close-up sealing details, not three photographed local projects.

- [ ] **Step 7: Correct and harden Before/After**

Render the no-JavaScript fallback in this order:

1. After: `/images/banera.webp`, label `After`.
2. Before: `/images/banera-antes.webp`, label `Before`.

In the enhanced comparison, keep Before as the full base and clip After from the left so the visible left side is After and the right side is Before. Use the natural `3 / 4` aspect ratio, not `4 / 3`.

Add a visually hidden description referenced by the range input that includes both `afterAlt` and `beforeAlt`. Keep the clipped After image decorative only after that equivalent text exists.

Use a navy focus ring with warm-white offset for at least 3:1 contrast. Position the divider line at the exact reveal percentage, but clamp the 48px handle independently:

```tsx
style={{ left: `clamp(1.5rem, ${reveal}%, calc(100% - 1.5rem))` }}
```

- [ ] **Step 8: Run the verifier and static checks**

Run:

```powershell
corepack pnpm run media:verify
corepack pnpm run lint
corepack pnpm exec tsc --noEmit
corepack pnpm run build
corepack pnpm audit --audit-level=high
```

Expected: all commands exit `0`, video hash matches, generated media dimensions match, and no npm lockfile exists.

- [ ] **Step 9: Verify the Cloudflare artifact**

Verify all of these exist after `pnpm run build`:

```text
out/index.html
out/video/silicone-solutions.mp4
out/images/logo-clean.png
out/images/services.webp
out/images/poceta.webp
out/images/lavamanos.webp
out/images/banera-antes.webp
out/images/banera.webp
out/icon.png
```

Inspect `out/index.html` and confirm it references only repository-relative asset URLs, never the `Varios` path.

- [ ] **Step 10: Run browser QA**

Serve `out/` locally and verify:

- Desktop `1440x900` and mobile `390x844` have no horizontal overflow.
- Logo, hero video, service cards, Before/After images, and gallery show complete content without crop.
- Video autoplays muted in normal motion and pauses in reduced motion.
- Before/After shows After-left and Before-right at `50`.
- Range responds to mouse, touch, `ArrowLeft`, `ArrowRight`, `Home`, and `End`.
- Handle remains fully visible at `0` and `100`.
- No-JavaScript fallback shows After-left and Before-right.
- Both media descriptions are available in the accessibility tree.
- Favicon is requested successfully and the console/network log has no missing media assets.

- [ ] **Step 11: Commit after review**

After task-scoped review is clean, commit the implementation and push `feat/silicone-solutions-landing` as the completion point for Tasks 6 and 6A.
