# Silicone Solutions Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, English-language Next.js landing page for Silicone Solutions C.I. Ltd that converts Jersey visitors into quote requests through WhatsApp, phone, and email.

**Architecture:** Create a single-page App Router experience with small presentational sections, typed content arrays, and two client-side interactive islands: the animated services carousel and the accessible Before/After slider. The page remains static and stores no visitor data; the quote form creates a prefilled WhatsApp URL in the browser.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Lucide React, `next/font`, Playwright browser checks, and Lighthouse verification.

## Global Constraints

- All visible copy must be in English.
- The visual direction is `Precision Seal`: midnight navy `#0F172A`, signal orange `#F97316`, warm white `#FAFAF8`, and stone gray `#E7E5E4`.
- Use the confirmed contact details: `+44 7700 323453`, `davidcameron481@yahoo.com`, and Jersey, Channel Islands.
- Use `15+ years of experience`; do not invent a more exact number.
- Use local assets from `F:\Proyectos\SiliconeSolutions\Varios` and copy them into the app's public asset folders.
- Do not present provisional testimonials as verified reviews.
- Do not add backend storage, payments, CMS integration, or production deployment.
- Respect `prefers-reduced-motion`, keyboard access, visible focus, WCAG AA contrast, and semantic landmarks.
- Do not push or commit until the operator explicitly requests integration; the provided GitHub repository is only the future remote destination.

---

### Task 1: Bootstrap the Next.js application and asset folders

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `public/images/logo.jpg`
- Create: `public/images/services.jpg`
- Create: `public/images/poceta.jpg`
- Create: `public/images/lavamanos.jpg`
- Create: `public/images/banera-antes.jpg`
- Create: `public/images/banera.jpg`
- Create: `public/video/silicone-solutions.mp4`

**Interfaces:**
- Produces a runnable Next.js App Router shell with `pnpm run dev`, `pnpm run lint`, and `pnpm run build` scripts.
- Exposes assets under `/images/*` and `/video/silicone-solutions.mp4`.

- [ ] **Step 1: Scaffold the package manifest**

Run:

```powershell
pnpm install
pnpm add next react react-dom framer-motion lucide-react
pnpm add -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss eslint eslint-config-next
```

Set the scripts to:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  }
}
```

- [ ] **Step 2: Add the App Router and styling configuration**

Create `app/layout.tsx` with the root metadata shell and `app/page.tsx` with a temporary `<main>Silicone Solutions</main>`. Import `app/globals.css` from the layout. Configure Tailwind through `postcss.config.mjs` and use CSS variables in `globals.css` for `--navy`, `--orange`, `--warm-white`, and `--stone`.

- [ ] **Step 3: Copy the supplied media into public assets**

Copy the six images and `Video.mp4` from `F:\Proyectos\SiliconeSolutions\Varios` to the exact public paths listed above. Keep the original files untouched. Use lowercase ASCII filenames in the app paths so imports and URLs are predictable.

- [ ] **Step 4: Verify the shell**

Run: `pnpm run lint`

Expected: PASS with no ESLint errors.

Run: `pnpm run build`

Expected: PASS and a generated Next.js production build.

### Task 2: Define typed content, metadata, and contact helpers

**Files:**
- Create: `src/content.ts`
- Create: `src/lib/contact.ts`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `src/content.ts` exports `services`, `benefits`, `processSteps`, `testimonials`, `galleryItems`, and `siteCopy`.
- `src/lib/contact.ts` exports `phoneHref`, `whatsappHref`, `emailHref`, and `buildQuoteWhatsAppUrl(values: QuoteFormValues): string`.

- [ ] **Step 1: Add content types and arrays**

Use these types:

```ts
export type Service = {
  title: string;
  description: string;
  benefit: string;
  image: string;
  icon: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  source: string;
  verified: boolean;
};

export type GalleryItem = {
  src: string;
  alt: string;
  label: string;
};
```

Define six services, six benefits, four process steps, the supplied Kate Forde review with `verified: true`, and two provisional testimonials with `verified: false`. Use explicit copy from the approved design spec; do not add invented awards, ratings, or guarantees.

- [ ] **Step 2: Add contact URL helpers**

Implement:

```ts
export type QuoteFormValues = {
  name: string;
  contact: string;
  service: string;
  message: string;
};

export function buildQuoteWhatsAppUrl(values: QuoteFormValues): string {
  const body = [
    "Hello Silicone Solutions, I would like a free quote.",
    `Name: ${values.name}`,
    `Contact: ${values.contact}`,
    `Service: ${values.service}`,
    `Message: ${values.message}`,
  ].join("\n");

  return `https://wa.me/447700323453?text=${encodeURIComponent(body)}`;
}
```

Export `tel:+447700323453`, `https://wa.me/447700323453`, and `mailto:davidcameron481@yahoo.com` constants from the same file.

- [ ] **Step 3: Add SEO metadata and JSON-LD**

Update `app/layout.tsx` with an English title, description, and Open Graph values for Silicone Solutions in Jersey. Add a `LocalBusiness` JSON-LD script using only the confirmed business name, phone, email, and service area. Do not invent a canonical domain or social image URL; add those only after the operator confirms the production domain.

### Task 3: Build the visual foundation and page shell

**Files:**
- Create: `src/components/SectionHeading.tsx`
- Create: `src/components/LogoMark.tsx`
- Create: `src/components/Navbar.tsx`
- Create: `src/components/MobileContactBar.tsx`
- Modify: `app/globals.css`
- Modify: `app/page.tsx`

**Interfaces:**
- `SectionHeading({ eyebrow, title, body, align })` renders a semantic heading block.
- `Navbar` receives the contact URL constants and renders anchor-based navigation.
- `MobileContactBar` receives `whatsappHref` and `phoneHref`.

- [ ] **Step 1: Add the design tokens and base styles**

Define CSS variables, body colors, selection color, focus ring, container width, button styles, and reduced-motion rules. Add utility classes only for repeated visual primitives; keep section-specific layout in component classes.

- [ ] **Step 2: Add the logo treatment**

Render `Logo.jpg` inside a controlled aspect-ratio wrapper with `object-fit: cover` and a white background so the original black letterbox bars do not appear in the page. Use an accessible `alt="Silicone Solutions C.I. Ltd"`.

- [ ] **Step 3: Add desktop and mobile navigation**

Create anchor links to `#services`, `#about`, `#work`, and `#contact`. Add an orange quote button. On mobile, keep navigation compact and render a fixed bottom bar with WhatsApp and phone actions. Add bottom padding to the page shell so the fixed bar never covers content.

- [ ] **Step 4: Verify layout primitives**

Run `pnpm run lint` and inspect the shell at 390px and 1440px widths. Expected: no horizontal overflow, visible focus states, and readable navigation at both sizes.

### Task 4: Implement hero, trust, problem, solution, and about sections

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/components/TrustBar.tsx`
- Create: `src/components/ProblemSection.tsx`
- Create: `src/components/AboutSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `Hero` receives `siteCopy`, `videoSrc`, `posterSrc`, `phoneHref`, and `quoteHref`.
- `TrustBar` receives the typed trust items.
- `ProblemSection` and `AboutSection` consume image paths and copy from `src/content.ts`.

- [ ] **Step 1: Build the hero media and copy**

Use the approved heading and subheading. Render the local MP4 with `autoPlay muted loop playsInline preload="metadata"`, a poster image, and an accessible label. Add `motion-safe` reveal animations through Framer Motion and keep the primary quote CTA visible before the media on mobile.

- [ ] **Step 2: Add trust proof points**

Render four proof points with line icons and text. Use `15+ Years Experience` exactly; do not claim a specific qualification unless it is confirmed for the company.

- [ ] **Step 3: Add problem and solution storytelling**

Show the four customer problems and the four-part specialist solution. Use the supplied project photos as evidence of work, with captions that describe the visible result rather than inventing a customer story.

- [ ] **Step 4: Add About Us**

Create the About section for David and Silicone Solutions C.I. Ltd with local Jersey coverage, residential and commercial scope, 15+ years of experience, and a direct contact action.

- [ ] **Step 5: Verify hero interactions**

Run the dev server and check that the video loads, the poster is used before playback, the CTA anchors work, and reduced-motion mode suppresses nonessential reveals.

### Task 5: Implement the animated services reel

**Files:**
- Create: `src/components/ServicesCarousel.tsx`
- Modify: `src/content.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- `ServicesCarousel({ services: Service[] })` renders the six service cards.
- Each service card has a stable heading, benefit text, icon label, and image alt text.

- [ ] **Step 1: Render the horizontal card rail**

Use CSS scroll snapping for touch and Framer Motion for entry/hover transitions. Each card must have a meaningful heading and a visible customer benefit.

- [ ] **Step 2: Add accessible controls**

Add previous and next buttons with `aria-label`, keyboard focus, and deterministic scroll behavior. Pause auto-advance on pointer enter, focus within, and reduced motion.

- [ ] **Step 3: Add the service section anchor and CTA**

Wrap the section in `<section id="services">` and add a quote link after the rail. The quote link must use the confirmed WhatsApp URL rather than an inactive link.

- [ ] **Step 4: Verify carousel behavior**

Check mouse, keyboard, touch, narrow viewport, and reduced-motion behavior. Expected: cards never make the page itself horizontally overflow and the controls remain usable at 390px.

### Task 6: Implement Before/After and the work gallery

**Files:**
- Create: `src/components/BeforeAfterSlider.tsx`
- Create: `src/components/WorkGallery.tsx`
- Modify: `app/page.tsx`
- Modify: `src/content.ts`

**Interfaces:**
- `BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt })` renders an accessible comparison with a `0..100` range input.
- `WorkGallery({ items: GalleryItem[] })` renders the remaining local images with alt text.

- [ ] **Step 1: Add the semantic two-image fallback**

Render both labeled images in the DOM so the content remains meaningful without client-side behavior. Layer the After image above the Before image only when the interactive enhancement is active.

- [ ] **Step 2: Add the keyboard and pointer slider**

Bind the range input value to the clip width. Give the input an accessible label such as `Reveal more of the finished result`. Keep the handle large enough for touch and visible against both image states.

- [ ] **Step 3: Add the gallery**

Use `Servicios.jpg`, `Poceta.jpg`, and `Lavamanos.jpg` in a lightweight editorial layout. Add `loading="lazy"` to below-the-fold images and explicit width/height or responsive image sizing.

- [ ] **Step 4: Verify comparison and gallery**

Check range input with keyboard, mouse, touch, and JavaScript disabled fallback. Expected: labels remain visible and no image is stretched beyond its aspect ratio.

### Task 7: Implement benefits, process, testimonials, quote flow, CTA, and footer

**Files:**
- Create: `src/components/WhyChooseUs.tsx`
- Create: `src/components/ProcessSteps.tsx`
- Create: `src/components/Testimonials.tsx`
- Create: `src/components/QuoteForm.tsx`
- Create: `src/components/FinalCTA.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `WhyChooseUs({ benefits })` and `ProcessSteps({ steps })` render typed arrays.
- `Testimonials({ testimonials })` visually distinguishes verified and provisional content in development content data; production copy must not call provisional text verified.
- `QuoteForm({ services, onBuildWhatsAppUrl })` validates fields and opens the generated URL in a new tab.
- `Footer({ contactLinks })` renders confirmed phone, WhatsApp, email, and service area.

- [ ] **Step 1: Add benefits and process sections**

Render six benefit cards and the four numbered steps with strong hierarchy and no invented proof claims.

- [ ] **Step 2: Add testimonial cards**

Use the Kate Forde quote with its source context. Render the two provisional examples in a visually subdued state that includes `Example review` until replacement copy is supplied. Keep all testimonial text in `src/content.ts`.

- [ ] **Step 3: Add quote form validation**

Require name, contact, service, and message. Show inline English validation messages. On valid submit, call `buildQuoteWhatsAppUrl(values)` and use `window.open(url, "_blank", "noopener,noreferrer")`; do not send the message automatically and do not persist the values.

- [ ] **Step 4: Add final CTA and footer**

Add `#contact` to the quote section and ensure every CTA points to a working WhatsApp, phone, email, or in-page anchor destination. Footer must not include unconfirmed social profile URLs.

- [ ] **Step 5: Verify conversion routes**

Check that phone, WhatsApp, and email anchors expose the correct `href` values and that invalid form submission does not open a new tab.

### Task 8: Integrate the page, run QA, and measure release readiness

**Files:**
- Modify: `app/page.tsx`
- Create: `tests/landing.spec.ts`
- Create: `playwright.config.ts`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- `app/page.tsx` composes the page in this order: Navbar, Hero, TrustBar, ProblemSection, AboutSection, ServicesCarousel, BeforeAfterSlider, WhyChooseUs, ProcessSteps, Testimonials, QuoteForm, FinalCTA, Footer, MobileContactBar.
- `tests/landing.spec.ts` verifies the user-visible conversion and interaction paths.

- [ ] **Step 1: Compose the complete page**

Replace the temporary page with the approved section order and pass content arrays and contact constants explicitly. Keep the root page server-rendered; only interactive components use client boundaries.

- [ ] **Step 2: Add browser tests**

Use Playwright to assert:

```ts
await expect(page.getByRole("heading", { name: "The Perfect Finish. Every Time." })).toBeVisible();
await expect(page.getByRole("link", { name: "Call Now" }).first()).toHaveAttribute("href", "tel:+447700323453");
await expect(page.getByRole("link", { name: /WhatsApp/i }).first()).toHaveAttribute("href", /wa\.me\/447700323453/);
await page.getByLabel("Name").fill("Test visitor");
await page.getByLabel("Phone or email").fill("test@example.com");
await page.getByLabel("Type of work").selectOption({ label: "Bathroom Silicone Sealing" });
await page.getByLabel("Message").fill("Please quote a bathroom reseal.");
await expect(page.getByRole("button", { name: /free quote/i })).toBeEnabled();
```

Stub `window.open` in the form test and assert the generated URL contains the encoded service and message without actually sending anything.

- [ ] **Step 3: Run static verification**

Run:

```powershell
pnpm run lint
pnpm run build
pnpm exec playwright test
```

Expected: all commands exit with code 0 and no browser console errors are reported.

- [ ] **Step 4: Run responsive and accessibility checks**

Open the production build in a browser at 390px and 1440px widths. Check landmarks, heading order, focus states, keyboard carousel controls, Before/After keyboard control, reduced motion, fixed mobile contact bar spacing, and no horizontal overflow.

- [ ] **Step 5: Run Lighthouse checks**

Run Lighthouse against the production build for mobile and desktop. Record the results in `README.md`; target 95+ for Performance, Accessibility, Best Practices, and SEO. If the score misses 95, fix the measured bottleneck before claiming completion rather than hiding or disabling the audit.

- [ ] **Step 6: Update README with local run instructions**

Document `pnpm install`, `pnpm run dev`, `pnpm run build`, `pnpm start`, and the asset source folder. Note that the two provisional testimonials must be replaced before public launch.
