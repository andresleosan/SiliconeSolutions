import { expect, test } from "@playwright/test";

const gallery = {
  section: "section[aria-roledescription='carousel']",
  activeCard: "[data-gallery-card][data-active='true']",
};

test("offers persistent rotation control with appropriate announcements", async ({ page }) => {
  await page.goto("/");

  const section = page.locator(gallery.section);
  const liveRegion = section.locator("[data-gallery-live]");
  const rotationButton = section.locator("[data-gallery-autoplay-control]");

  await expect(rotationButton).toHaveAccessibleName("Pause automatic rotation");
  await expect(liveRegion).toHaveAttribute("aria-live", "off");

  await rotationButton.click();
  await expect(rotationButton).toHaveAccessibleName("Start automatic rotation");
  await expect(liveRegion).toHaveAttribute("aria-live", "polite");

  const activeProject = await section.locator(gallery.activeCard).getAttribute("aria-label");
  await page.waitForTimeout(5_000);
  await expect(section.locator(gallery.activeCard)).toHaveAttribute("aria-label", activeProject ?? "");

  await page.keyboard.press("Space");
  await expect(liveRegion).toHaveAttribute("aria-live", "off");
  await page.mouse.move(0, 0);
  await page.keyboard.press("Tab");
  await expect(rotationButton).toHaveAccessibleName("Pause automatic rotation");

  for (let step = 0; step < 10; step += 1) {
    const focusInside = await section.evaluate((element) =>
      element.contains(document.activeElement),
    );
    if (!focusInside) break;
    await page.keyboard.press("Tab");
  }

  await expect
    .poll(() => section.evaluate((element) => element.contains(document.activeElement)))
    .toBe(false);
  await expect
    .poll(() => section.locator(gallery.activeCard).getAttribute("aria-label"), { timeout: 6_000 })
    .not.toBe(activeProject);
});

test("stops rotation after keyboard focus enters the carousel", async ({ page }) => {
  await page.goto("/");

  const section = page.locator(gallery.section);
  await section.locator("#work-gallery-deck").focus();
  await expect(section.getByRole("button", { name: "Start automatic rotation" })).toBeVisible();

  const activeProject = await section.locator(gallery.activeCard).getAttribute("aria-label");
  await page.locator("#work-gallery-deck").evaluate((element) => (element as HTMLElement).blur());
  await page.waitForTimeout(5_000);
  await expect(section.locator(gallery.activeCard)).toHaveAttribute("aria-label", activeProject ?? "");
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
