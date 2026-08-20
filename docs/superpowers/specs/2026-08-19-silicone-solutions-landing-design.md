# Silicone Solutions Landing Page Design

## Estado

Approved by the operator on 2026-08-19.

## Objective

Create a premium, English-language landing page for Silicone Solutions C.I. Ltd that turns local Jersey traffic into quote requests and direct contact through WhatsApp, phone, and email.

Primary conversion actions:

- Get a Free Quote
- Call Now
- Start a WhatsApp conversation

## Product Context

Silicone Solutions C.I. Ltd provides domestic and commercial silicone sealing services in Jersey, Channel Islands. The business has more than 15 years of experience and positions itself around clean workmanship, durable results, fast response, competitive pricing, and specialist attention to detail.

Confirmed contact details:

- Phone and WhatsApp: +44 7700 323453
- Email: davidcameron481@yahoo.com
- Service area: Jersey, Channel Islands

## Design Direction

### Precision Seal

The page uses a dark editorial hero, warm orange accents, generous white space, and a tactile portfolio presentation. It should feel precise and premium without looking like a generic construction template.

The visual language is inspired by:

- The referenced Mobbin card/carousel interaction pattern, used as an interaction pattern rather than copied as a screen.
- PureSeal Services UK, for the category convention of grouping specialist surface services, proof points, and direct contact routes.
- The existing Silicone Solutions marketing artwork and Facebook profile, for the established orange, navy, and white brand palette and local-service positioning.

### Design DNA

- Palette: midnight navy `#0F172A`, signal orange `#F97316`, warm white `#FAFAF8`, and stone gray `#E7E5E4`.
- Typography: Manrope for body and interface text; a restrained editorial display face for large headlines if it remains legible and performant.
- Tone: precise, trusted, premium, local.
- Motion: smooth reveals, restrained parallax, horizontal service movement, and a direct before/after comparison.
- Avoid: six identical service cards in a static grid, excessive glassmorphism, stock bathroom imagery, and motion that competes with the call to action.

## Page Structure

### 1. Header

- Compact logo lockup.
- Navigation links: Services, About, Our Work, Contact.
- Orange `Get a Free Quote` action.
- Mobile navigation with a fixed bottom contact bar for WhatsApp and phone.

### 2. Hero

Dark navy background with a two-column layout on desktop and a stacked layout on mobile.

Copy:

- Eyebrow: `Jersey's silicone sealing specialists`
- Heading: `The Perfect Finish. Every Time.`
- Supporting text: `Professional silicone sealing across Jersey for homes and businesses. Clean workmanship, durable results and competitive pricing.`
- Actions: `Get a Free Quote` and `Call Now`.
- Trust badge: `15+ years of experience`.

`Video.mp4` appears in a tall rounded media card. It uses autoplay, muted playback, looping, and `playsInline`. It must have a poster or image fallback and must be disabled or reduced for users who prefer reduced motion.

### 3. Trust Bar

Four compact proof points:

- Local Jersey Service
- 15+ Years Experience
- Fast Response
- Professional Finish

### 4. Problem Section

Introduce the customer pain clearly:

- Black mould around baths and showers
- Cracked or peeling silicone
- Water damage and leaks
- Poor finishing from previous contractors

The section should use the real work photography where it helps demonstrate the problem, without implying that every visible mark is a current customer defect.

### 5. Solution and About Us

Explain the specialist process: remove failed sealant, prepare the surface, apply a clean bead, and leave a durable finish. Include an About Us panel for David and Silicone Solutions C.I. Ltd, focusing on 15+ years of experience, local Jersey service, domestic and commercial work, and reliable communication.

### 6. Services Reel

Use an animated horizontal card reel rather than a generic six-card grid. Each card includes an icon, service name, short description, and customer benefit.

Initial services:

- Bathroom Silicone Sealing
- Kitchen Silicone Sealing
- Shower Resealing
- Window Sealing
- Commercial Sealing
- Sealant Replacement

The reel auto-advances slowly, pauses on hover/focus, supports touch scrolling, and offers visible controls. It must remain usable with keyboard navigation and reduced motion.

### 7. Before and After

Create an accessible comparison slider using `BañeraAntes.jpg` and `Bañera.jpg`.

- Label the two states as `Before` and `After`.
- Provide a keyboard-operable range control.
- Keep the comparison understandable when JavaScript or motion is unavailable by showing a normal two-image fallback.

Use the remaining local images as the work gallery, with descriptive alt text and a lightweight horizontal or masonry presentation.

### 8. Why Choose Us

Six benefits with simple line icons:

- Professional Finish
- Local Jersey Specialists
- Fast Turnaround
- Competitive Pricing
- Residential & Commercial
- Reliable Service

### 9. How We Work

Four numbered steps:

1. Request a Quote
2. Site Assessment
3. Professional Application
4. Perfect Finish Delivered

### 10. Testimonials

Show three testimonial cards. The supplied review is real and may be attributed to Kate Forde with its source context. The other two statements are provisional marketing copy and must be clearly marked in the content data so they can be replaced before public launch. They must not be presented as verified customer reviews without confirmation.

### 11. Quote and Final CTA

Use a short quote form with:

- Name
- Phone or email
- Type of work
- Message

Submitting the form creates a prefilled WhatsApp message using `https://wa.me/447700323453`. Direct email and phone actions remain visible beside the form. No form data is stored by this static version.

Final CTA copy:

- Heading: `Ready for a Perfect Finish?`
- Text: `Get your free quote today and give your property the professional finish it deserves.`
- Actions: `Get Free Quote` and `Call Now`.

### 12. Footer

Include the logo, phone, WhatsApp, email, service area, social links if confirmed, and copyright. Do not add unconfirmed social profiles or claims.

## Technical Architecture

### Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React for interface icons
- `next/font` for optimized typography

### Component Boundaries

- `Navbar`
- `Hero`
- `TrustBar`
- `ProblemSection`
- `AboutSection`
- `ServicesCarousel`
- `BeforeAfterSlider`
- `WhyChooseUs`
- `ProcessSteps`
- `Testimonials`
- `QuoteForm`
- `FinalCTA`
- `Footer`
- `MobileContactBar`

Content arrays for services, benefits, steps, and testimonials should live outside the page component. This keeps the copy easy to update and avoids coupling content changes to layout code.

## Responsive Behavior

- Mobile-first layout with no horizontal page overflow.
- Hero media moves below the primary CTA on narrow screens.
- Services reel becomes touch-first with visible snap points.
- Before/After slider uses a comfortable mobile touch target and a two-image fallback.
- Fixed mobile contact bar must not cover content or form controls.
- Desktop layout expands to a centered max-width container with generous section spacing.

## Accessibility

- Use semantic `header`, `main`, `section`, `nav`, and `footer` landmarks.
- Every interactive element must have an accessible name.
- Maintain keyboard access for navigation, carousel controls, form controls, and the comparison slider.
- Respect `prefers-reduced-motion`.
- Use visible focus states and WCAG AA contrast.
- Provide useful alt text for every local image; decorative imagery uses empty alt text.
- Do not rely on color alone for Before/After labels or status.

## SEO and Performance

- English title and description targeting professional silicone sealing in Jersey.
- Open Graph metadata for social sharing.
- `LocalBusiness` JSON-LD with only confirmed company and contact details.
- Lazy-load below-the-fold images.
- Use responsive image sizing and avoid serving oversized assets where possible.
- Keep the video muted, inline, and non-blocking; provide an image poster.
- Verify production build and inspect console errors.

## Verification Plan

- Run the production build.
- Run the app locally and inspect desktop and mobile layouts.
- Verify telephone, WhatsApp, and email links.
- Submit the quote form and verify the generated WhatsApp message without sending it.
- Check carousel keyboard behavior and reduced-motion behavior.
- Check Before/After slider mouse, touch, and keyboard behavior.
- Check image and video loading paths.
- Inspect accessibility semantics and visible focus states.
- Check browser console for errors.

## Out of Scope for This Version

- Backend lead storage.
- Online payments.
- CMS integration.
- Automated review imports.
- Publishing the site to production.
- Presenting provisional testimonials as verified reviews.

## Launch Inputs Still Needed

- Confirmed source or replacement copy for the two provisional testimonials.
- Confirmed social profile URLs, if they should appear in the footer.
- Final decision on hosting and domain before deployment.
