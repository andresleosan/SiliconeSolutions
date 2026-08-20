# Conversion Sections and Quote Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the landing page with benefits, process, honest testimonial presentation, a validated WhatsApp quote flow, final calls to action, and confirmed footer contact routes.

**Architecture:** Keep `app/page.tsx` server-rendered and implement every new section as a focused Server Component except `QuoteForm`, which owns browser-only form state and `window.open`. Put normalization, validation, and WhatsApp URL construction in pure functions under `src/lib/contact.ts`; `QuoteForm` imports these helpers directly because Next.js cannot serialize a function prop from a Server Component into a Client Component.

**Tech Stack:** Next.js 16 App Router static export, React 19, TypeScript, Tailwind CSS 4, Lucide React, Node 24 test runner, Playwright 1.62, pnpm 11.21.0.

## Global Constraints

- Use pnpm exclusively and do not introduce npm artifacts.
- Keep all visible copy in English.
- Preserve the approved `Precision Seal` palette: `#0F172A`, `#F97316`, `#FAFAF8`, and `#E7E5E4`.
- Preserve Manrope, the existing editorial hierarchy, rounded media treatment, and orange seam-line visual signature.
- Use only confirmed contact data: `+44 7700 323453`, `davidcameron481@yahoo.com`, and `Jersey, Channel Islands`.
- Use `15+ years of experience`; do not invent awards, ratings, guarantees, response times, or qualifications.
- Present Kate Forde's supplied recommendation with source context.
- Label both unverified testimonial placeholders as `Example review`; never imply that they are verified customers.
- Do not add social links because none are confirmed.
- Do not store or transmit form data to a backend; valid submission may only open a prefilled WhatsApp URL.
- Trim and URL-encode form values before including them in WhatsApp text.
- Keep visible focus, semantic landmarks, WCAG AA contrast, mobile layout down to `320px`, and no horizontal page overflow.
- Keep the static Cloudflare export self-contained and do not deploy.
- Push only after task-scoped review and a fresh verification pass.

---

### Task 1: Build the conversion sections and quote flow

**Files:**
- Create: `src/lib/contact.test.mjs`
- Modify: `src/lib/contact.ts`
- Create: `src/components/WhyChooseUs.tsx`
- Create: `src/components/ProcessSteps.tsx`
- Create: `src/components/Testimonials.tsx`
- Create: `src/components/QuoteForm.tsx`
- Create: `src/components/FinalCTA.tsx`
- Create: `src/components/Footer.tsx`
- Create: `qa/tests/conversion.spec.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- `normalizeQuoteFormValues(values: QuoteFormValues): QuoteFormValues` trims all four fields.
- `validateQuoteForm(values: QuoteFormValues): QuoteFormErrors` returns exact inline error messages for blank fields.
- `buildQuoteWhatsAppUrl(values: QuoteFormValues): string` uses normalized values and the confirmed WhatsApp number.
- `WhyChooseUs({ benefits: Benefit[] })` renders six approved benefits.
- `ProcessSteps({ steps: ProcessStep[] })` renders the four approved sequential steps.
- `Testimonials({ testimonials: Testimonial[] })` distinguishes the real recommendation from examples in visible text.
- `QuoteForm({ services: Service[]; phoneHref: string; emailHref: string; whatsappHref: string })` validates and opens WhatsApp without persistence.
- `FinalCTA({ title: string; description: string; phoneHref: string })` links to `#contact` and phone.
- `Footer({ phoneHref: string; whatsappHref: string; emailHref: string; serviceArea: string })` exposes only confirmed contact routes.

- [ ] **Step 1: Write failing unit tests for normalized quote data and validation**

Create `src/lib/contact.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

import * as contact from "./contact.ts";

const validValues = {
  name: "  Test Visitor  ",
  contact: "  test@example.com  ",
  service: "  Bathroom Silicone Sealing  ",
  message: "  Please quote a bathroom reseal.  ",
};

test("buildQuoteWhatsAppUrl trims and encodes every field", () => {
  const url = new URL(contact.buildQuoteWhatsAppUrl(validValues));
  assert.equal(url.origin + url.pathname, "https://wa.me/447700323453");
  assert.equal(
    url.searchParams.get("text"),
    [
      "Hello Silicone Solutions, I would like a free quote.",
      "Name: Test Visitor",
      "Contact: test@example.com",
      "Service: Bathroom Silicone Sealing",
      "Message: Please quote a bathroom reseal.",
    ].join("\n"),
  );
});

test("validateQuoteForm reports each whitespace-only field", () => {
  assert.equal(typeof contact.validateQuoteForm, "function");
  assert.deepEqual(
    contact.validateQuoteForm({ name: " ", contact: "", service: "  ", message: "" }),
    {
      name: "Enter your name.",
      contact: "Enter a phone number or email address.",
      service: "Choose a type of work.",
      message: "Tell us what needs sealing.",
    },
  );
});

test("validateQuoteForm accepts normalized non-empty values", () => {
  assert.equal(typeof contact.validateQuoteForm, "function");
  assert.deepEqual(contact.validateQuoteForm(validValues), {});
});
```

- [ ] **Step 2: Run the contact tests and confirm RED**

Run:

```powershell
node --experimental-strip-types --test src/lib/contact.test.mjs
```

Expected: FAIL because the current URL retains surrounding whitespace and `validateQuoteForm` does not exist.

- [ ] **Step 3: Implement normalization and validation helpers**

Replace `src/lib/contact.ts` with the existing constants plus these contracts:

```ts
export type QuoteFormValues = {
  name: string;
  contact: string;
  service: string;
  message: string;
};

export type QuoteFormErrors = Partial<Record<keyof QuoteFormValues, string>>;

export const phoneHref = "tel:+447700323453";
export const whatsappHref = "https://wa.me/447700323453";
export const emailHref = "mailto:davidcameron481@yahoo.com";

export function normalizeQuoteFormValues(values: QuoteFormValues): QuoteFormValues {
  return {
    name: values.name.trim(),
    contact: values.contact.trim(),
    service: values.service.trim(),
    message: values.message.trim(),
  };
}

export function validateQuoteForm(values: QuoteFormValues): QuoteFormErrors {
  const normalized = normalizeQuoteFormValues(values);
  const errors: QuoteFormErrors = {};

  if (!normalized.name) errors.name = "Enter your name.";
  if (!normalized.contact) errors.contact = "Enter a phone number or email address.";
  if (!normalized.service) errors.service = "Choose a type of work.";
  if (!normalized.message) errors.message = "Tell us what needs sealing.";

  return errors;
}

export function buildQuoteWhatsAppUrl(values: QuoteFormValues): string {
  const normalized = normalizeQuoteFormValues(values);
  const body = [
    "Hello Silicone Solutions, I would like a free quote.",
    `Name: ${normalized.name}`,
    `Contact: ${normalized.contact}`,
    `Service: ${normalized.service}`,
    `Message: ${normalized.message}`,
  ].join("\n");

  return `${whatsappHref}?text=${encodeURIComponent(body)}`;
}
```

- [ ] **Step 4: Run the contact tests and confirm GREEN**

Run:

```powershell
node --experimental-strip-types --test src/lib/contact.test.mjs
```

Expected: `3` tests pass and `0` fail.

- [ ] **Step 5: Write failing browser tests for the conversion path**

Create `qa/tests/conversion.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { __openedWindows: string[][] }).__openedWindows = [];
    window.open = (...args) => {
      (window as Window & { __openedWindows: string[][] }).__openedWindows.push(
        args.map((value) => String(value ?? "")),
      );
      return null;
    };
  });
  await page.goto("/");
});

test("renders benefits, process, and honest testimonial states", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Why Jersey Chooses Silicone Solutions" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A clear route to a perfect finish" })).toBeVisible();
  await expect(page.getByText("Verified recommendation")).toHaveCount(1);
  await expect(page.getByText("Example review", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Kate Forde", { exact: true })).toBeVisible();
});

test("blocks invalid quote submission and opens only an encoded valid request", async ({ page }) => {
  await page.getByRole("button", { name: "Build my free quote request" }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await expect(page.getByText("Enter a phone number or email address.")).toBeVisible();
  await expect(page.getByText("Choose a type of work.")).toBeVisible();
  await expect(page.getByText("Tell us what needs sealing.")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as Window & { __openedWindows: string[][] }).__openedWindows.length,
      ),
    )
    .toBe(0);

  await page.getByLabel("Name").fill(" Test Visitor ");
  await page.getByLabel("Phone or email").fill(" test@example.com ");
  await page.getByLabel("Type of work").selectOption({ label: "Bathroom Silicone Sealing" });
  await page.getByLabel("Message").fill(" Please quote a bathroom reseal. ");
  await page.getByRole("button", { name: "Build my free quote request" }).click();

  const openedWindows = await page.evaluate(
    () => (window as Window & { __openedWindows: string[][] }).__openedWindows,
  );
  expect(openedWindows).toHaveLength(1);
  expect(openedWindows[0][0]).toContain("https://wa.me/447700323453?text=");
  expect(decodeURIComponent(openedWindows[0][0])).toContain("Service: Bathroom Silicone Sealing");
  expect(decodeURIComponent(openedWindows[0][0])).toContain("Message: Please quote a bathroom reseal.");
  expect(openedWindows[0].slice(1)).toEqual(["_blank", "noopener,noreferrer"]);
});

test("exposes only confirmed conversion routes", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Call +44 7700 323453" })).toHaveAttribute(
    "href",
    "tel:+447700323453",
  );
  await expect(page.getByRole("link", { name: "Email Silicone Solutions" })).toHaveAttribute(
    "href",
    "mailto:davidcameron481@yahoo.com",
  );
  await expect(page.getByRole("link", { name: "Message on WhatsApp" })).toHaveAttribute(
    "href",
    "https://wa.me/447700323453",
  );
  await expect(page.locator("footer")).toContainText("Jersey, Channel Islands");
  await expect(page.locator("footer a[href*='facebook'], footer a[href*='instagram']")).toHaveCount(0);
});
```

- [ ] **Step 6: Run the conversion browser tests and confirm RED**

Run:

```powershell
corepack pnpm run test:e2e --grep "benefits|invalid quote|confirmed conversion"
```

Expected: FAIL because the six sections and quote form do not exist yet.

- [ ] **Step 7: Build the three proof sections**

Create `WhyChooseUs.tsx`, `ProcessSteps.tsx`, and `Testimonials.tsx` as Server Components.

`WhyChooseUs` uses this icon mapping and structure:

```tsx
const benefitIcons: Record<string, LucideIcon> = {
  BadgePoundSterling,
  Building2,
  MapPin,
  MessageCircle,
  Sparkles,
  Zap,
};

<section className="bg-[var(--warm-white)] py-20 sm:py-28" aria-labelledby="benefits-title">
  <div className="container">
    <SectionHeading
      eyebrow="Why choose us"
      title="Why Jersey Chooses Silicone Solutions"
      body="Specialist sealing shaped around clean work, clear communication and local service."
      id="benefits-title"
    />
    <div className="mt-12 grid border-l border-t border-[var(--stone)] sm:grid-cols-2 lg:grid-cols-3">
      {benefits.map((benefit, index) => {
        const Icon = benefitIcons[benefit.icon];
        return (
          <article className="relative min-h-64 border-b border-r border-[var(--stone)] p-7 sm:p-8" key={benefit.title}>
            <span className="text-xs font-extrabold tracking-[0.14em] text-[var(--navy)]/45">{String(index + 1).padStart(2, "0")}</span>
            <Icon className="mt-10 text-[var(--orange)]" aria-hidden="true" size={28} strokeWidth={1.8} />
            <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.045em]">{benefit.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--navy)]/70">{benefit.description}</p>
          </article>
        );
      })}
    </div>
  </div>
</section>
```

`ProcessSteps` renders a navy section headed `A clear route to a perfect finish`; each step uses its existing `number`, title, and description along one orange seam line. Use a single-column ordered list on mobile and four columns from `lg`, with the number visible as text rather than decoration.

`Testimonials` renders the verified recommendation as the larger first card with visible `Verified recommendation`, author, and source. Render each unverified entry with lower-contrast stone styling and the exact visible badge `Example review`; keep its source `Example review - replace before launch` visible so launch status cannot be mistaken.

- [ ] **Step 8: Build the validated client quote form**

Create `QuoteForm.tsx` with `"use client"`, controlled state, `noValidate`, inline errors, and these exact field contracts:

```tsx
const initialValues: QuoteFormValues = {
  name: "",
  contact: "",
  service: "",
  message: "",
};

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const nextErrors = validateQuoteForm(values);
  setErrors(nextErrors);

  const firstInvalidField = (Object.keys(nextErrors) as Array<keyof QuoteFormValues>)[0];
  if (firstInvalidField) {
    document.getElementById(`quote-${firstInvalidField}`)?.focus();
    return;
  }

  window.open(buildQuoteWhatsAppUrl(values), "_blank", "noopener,noreferrer");
}
```

Render `<section id="contact" aria-labelledby="quote-title">` as a navy two-column panel. The left column contains direct phone, email, and WhatsApp links with the exact accessible names tested in Step 5. The right column contains:

- `Name`: text input, `id="quote-name"`, `autoComplete="name"`, `maxLength={100}`.
- `Phone or email`: text input, `id="quote-contact"`, `autoComplete="email"`, `maxLength={150}`.
- `Type of work`: select, `id="quote-service"`, empty prompt plus `services.map(service => service.title)`.
- `Message`: textarea, `id="quote-message"`, `maxLength={1000}`, `rows={5}`.
- Submit text: `Build my free quote request`.
- Supporting text: `Nothing is sent until you choose to continue in WhatsApp.`

Each field uses `aria-invalid`, `aria-describedby`, and a stable `<p id="quote-<field>-error">` only when its error exists. Updating a field clears only that field's existing error.

- [ ] **Step 9: Build final CTA and footer**

Create `FinalCTA.tsx` as an orange editorial band with the approved title and description, a primary `Get Free Quote` link to `#contact`, and secondary `Call Now` link to `phoneHref`.

Create `Footer.tsx` with `<footer>`, `LogoMark`, service area, and only these links:

```tsx
<a href={phoneHref} aria-label="Call +44 7700 323453">+44 7700 323453</a>
<a href={whatsappHref} aria-label="Message on WhatsApp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
<a href={emailHref} aria-label="Email Silicone Solutions">davidcameron481@yahoo.com</a>
```

Include `© 2026 Silicone Solutions C.I. Ltd` and no social placeholders.

- [ ] **Step 10: Compose the complete page**

Modify `app/page.tsx` imports to include `benefits`, `testimonials`, `emailHref`, and all six new components. After `WorkGallery`, render in this order:

```tsx
<WhyChooseUs benefits={benefits} />
<ProcessSteps steps={processSteps} />
<Testimonials testimonials={testimonials} />
<QuoteForm
  services={services}
  phoneHref={phoneHref}
  emailHref={emailHref}
  whatsappHref={whatsappHref}
/>
<FinalCTA
  title={siteCopy.finalCta.title}
  description={siteCopy.finalCta.description}
  phoneHref={phoneHref}
/>
```

Remove the empty `#contact` spacer. Render `Footer` after `</main>` and before `MobileContactBar`.

- [ ] **Step 11: Run focused tests and correct only observed failures**

Run:

```powershell
node --experimental-strip-types --test src/lib/contact.test.mjs
corepack pnpm run test:e2e --grep "benefits|invalid quote|confirmed conversion"
```

Expected: contact tests report `3` pass, `0` fail; focused Playwright tests report `3` pass, `0` fail against a newly generated static export.

- [ ] **Step 12: Run the complete verification matrix**

Run:

```powershell
node --experimental-strip-types --test src/lib/contact.test.mjs src/lib/gallery.test.mjs
corepack pnpm run media:verify
corepack pnpm run lint
corepack pnpm exec tsc --noEmit
corepack pnpm audit --audit-level=high
corepack pnpm run test:e2e
```

Expected: Node reports `6` pass and `0` fail; media, lint, TypeScript, and audit exit `0`; static build succeeds; all existing and new Playwright tests pass against `out/`.

- [ ] **Step 13: Run browser QA and accessibility checks**

Against the generated static export, verify:

- Benefits count is six and process step count is four.
- Only one `Verified recommendation` and exactly two `Example review` badges exist.
- Invalid submit focuses `Name`, exposes four linked inline errors, and opens no window.
- Correcting a field removes only its corresponding error.
- Valid submit opens exactly one encoded `wa.me/447700323453` URL with `_blank` and `noopener,noreferrer`.
- Phone, email, WhatsApp, `#contact`, and footer links match confirmed destinations.
- Tab order follows all form fields and direct contact routes; focus is visible.
- No form values appear in localStorage, sessionStorage, cookies, query parameters, logs, or network requests.
- No horizontal overflow at `320`, `390`, and `1440` widths.
- Browser console and page errors are empty.

- [ ] **Step 14: Review, commit, and push Task 7**

After security baseline and independent task review are clean, commit only the Task 7 files with:

```powershell
git commit -m "feat: add conversion and quote sections"
```

Push `feat/silicone-solutions-landing` only after the fresh post-review verification remains green.
