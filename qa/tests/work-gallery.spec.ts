import { expect, test } from "@playwright/test";

const gallery = {
  section: "section[aria-roledescription='carousel']",
  activeCard: "[data-gallery-card][data-active='true']",
};

test("keeps rotating until the active image is clicked", async ({ page }) => {
  await page.goto("/");

  const section = page.locator(gallery.section);
  const liveRegion = section.locator("[data-gallery-live]");
  const activeCard = section.locator(gallery.activeCard);
  await expect(section.locator("[data-gallery-autoplay-control]")).toHaveCount(0);
  await expect(liveRegion).toHaveAttribute("aria-live", "off");

  const activeProject = await section.locator(gallery.activeCard).getAttribute("aria-label");
  await page.waitForTimeout(5_000);
  await expect(section.locator(gallery.activeCard)).not.toHaveAttribute("aria-label", activeProject ?? "");

  const clickedProject = await activeCard.getAttribute("aria-label");
  await activeCard.click();
  await expect(liveRegion).toHaveAttribute("aria-live", "polite");
  await page.waitForTimeout(5_000);
  await expect(section.locator(gallery.activeCard)).toHaveAttribute("aria-label", clickedProject ?? "");
});

test("pauses rotation while keyboard focus enters the carousel", async ({ page }) => {
  await page.goto("/");

  const section = page.locator(gallery.section);
  const liveRegion = section.locator("[data-gallery-live]");
  const rotationButton = section.locator("[data-gallery-autoplay-control]");
  await expect(rotationButton).toHaveCount(0);

  const activeProject = await section.locator(gallery.activeCard).getAttribute("aria-label");
  await section.locator("#work-gallery-deck").focus();
  await page.waitForTimeout(5_000);
  await expect(section.locator(gallery.activeCard)).toHaveAttribute("aria-label", activeProject ?? "");

  await expect(liveRegion).toHaveAttribute("aria-live", "off");
});

test("provides 32px targets for every project dot", async ({ page }) => {
  await page.goto("/");

  const dots = page.locator(`${gallery.section} [data-gallery-dot]`);
  await expect(dots).toHaveCount(4);

  for (const dot of await dots.all()) {
    const box = await dot.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(32);
    expect(box?.height).toBeGreaterThanOrEqual(32);
  }
});

test("hydrates the services carousel without server-client drift", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });

  await page.goto("/");
  await expect(page.locator("#services-rail")).toBeVisible();

  expect(hydrationErrors.join("\n")).not.toContain("services-rail");
});

test("hydrates the enhanced comparison without mutating React markup", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });

  await page.goto("/");
  await expect(page.locator("[data-comparison-enhanced]")).toBeVisible();
  await page.waitForTimeout(100);

  expect(hydrationErrors).toEqual([]);
});

test("shows the two-image comparison fallback without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("[data-service-card]").first()).toBeVisible();
  await expect(page.locator("[data-comparison-fallback]")).toBeVisible();
  await expect(page.locator("[data-comparison-enhanced]")).toBeHidden();

  await context.close();
});

test("hydrates reduced-motion markup without server-client drift", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-gallery-card]")).toHaveCount(4);
  await page.waitForTimeout(100);

  expect(hydrationErrors).toEqual([]);
});
