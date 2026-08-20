import { expect, test, type Page } from "@playwright/test";

const projectTitles = [
  "Washbasin sealing",
  "Toilet base sealing",
  "Bath reseal result",
  "Before condition",
];

const galleryAssets = [
  "/images/lavamanos.webp",
  "/images/poceta.webp",
  "/images/banera.webp",
  "/images/banera-antes.webp",
];

const sectionSelector = "section[aria-roledescription='carousel']";
const activeCardSelector = "[data-gallery-card][data-active='true']";

async function openGallery(page: Page) {
  await page.goto("/");
  await page.locator(sectionSelector).scrollIntoViewIfNeeded();
  await expect(page.locator("[data-gallery-card]")).toHaveCount(4);
  await expect(page.locator("[data-gallery-dot]")).toHaveCount(4);
}

async function expectActive(page: Page, index: number) {
  await expect(page.locator(`${activeCardSelector} h3`)).toHaveText(projectTitles[index]);
  await expect(page.locator("[data-gallery-dot][aria-current='true']")).toHaveAttribute(
    "aria-label",
    `Show project ${index + 1}`,
  );
}

async function waitForActiveCardToSettle(page: Page) {
  const card = page.locator(activeCardSelector);
  await expect
    .poll(async () => {
      return card.evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
        return (
          Math.abs(matrix.a - 1) < 0.01 &&
          Math.abs(matrix.b) < 0.01 &&
          Math.abs(matrix.c) < 0.01 &&
          Math.abs(matrix.d - 1) < 0.01 &&
          Math.abs(matrix.e) < 1 &&
          Math.abs(matrix.f) < 1
        );
      });
    })
    .toBe(true);
}

async function dragActiveCard(page: Page, distance: number) {
  await waitForActiveCardToSettle(page);

  const card = page.locator(activeCardSelector);
  const box = await card.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  const viewport = page.viewportSize();
  const startX = box.x + box.width / 2;
  const preferredY = box.y + Math.min(box.height / 3, 220);
  const startY = Math.min(Math.max(preferredY, 20), (viewport?.height ?? 720) - 20);
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + distance, startY, { steps: 10 });
  await page.mouse.up();
}

test("auto-advances every 4500ms and pauses while the pointer is inside", async ({ page }) => {
  await openGallery(page);
  await expectActive(page, 0);

  const rotationButton = page.locator("[data-gallery-autoplay-control]");
  await rotationButton.click();
  await rotationButton.click();
  await rotationButton.evaluate((element) => (element as HTMLElement).blur());
  await page.mouse.move(0, 0);

  await page.waitForTimeout(4_200);
  await expectActive(page, 0);
  await expect
    .poll(() => page.locator(`${activeCardSelector} h3`).innerText(), { timeout: 1_500 })
    .toBe(projectTitles[1]);

  const section = page.locator(sectionSelector);
  await section.hover({ position: { x: 20, y: 180 } });
  await page.waitForTimeout(100);
  const pausedTitle = await page.locator(`${activeCardSelector} h3`).innerText();
  await page.waitForTimeout(5_000);
  await expect(page.locator(`${activeCardSelector} h3`)).toHaveText(pausedTitle);
});

test("supports circular controls, keyboard navigation, dots, swipe, and announcements", async ({ page }) => {
  await openGallery(page);

  await page.getByRole("button", { name: "Next project" }).click();
  await expectActive(page, 1);
  await page.getByRole("button", { name: "Previous project" }).click();
  await expectActive(page, 0);

  const deck = page.locator("#work-gallery-deck");
  await deck.focus();
  await page.keyboard.press("ArrowLeft");
  await expectActive(page, 3);
  await page.keyboard.press("ArrowRight");
  await expectActive(page, 0);

  for (let index = 0; index < projectTitles.length; index += 1) {
    await page.getByRole("button", { name: `Show project ${index + 1}`, exact: true }).click();
    await expectActive(page, index);
  }
  await expect(page.locator("[data-gallery-live]")).toHaveText(
    "Showing project 4 of 4: Before condition",
  );

  await page.getByRole("button", { name: "Show project 1", exact: true }).click();
  await dragActiveCard(page, -80);
  await expectActive(page, 1);
  await dragActiveCard(page, 80);
  await expectActive(page, 0);
});

test("exposes only the active card to assistive technology", async ({ page }) => {
  await openGallery(page);

  const states = await page.locator("[data-gallery-card]").evaluateAll((cards) =>
    cards.map((card) => ({
      active: card.getAttribute("data-active"),
      ariaHidden: card.getAttribute("aria-hidden"),
      inert: card.hasAttribute("inert"),
      pointerEvents: getComputedStyle(card).pointerEvents,
    })),
  );

  expect(states.filter((card) => card.active === "true")).toHaveLength(1);
  expect(states.filter((card) => card.ariaHidden === "false")).toHaveLength(1);
  expect(
    states
      .filter((card) => card.active === "false")
      .every((card) => card.ariaHidden === "true" && card.inert && card.pointerEvents === "none"),
  ).toBe(true);

  await expect(page.getByRole("heading", { name: "Washbasin sealing" })).toBeVisible();
  for (const title of projectTitles.slice(1)) {
    await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
  }
});

test("disables autoplay, rotation, and swipe in reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openGallery(page);

  await page.waitForTimeout(5_000);
  await expectActive(page, 0);

  const rotations = await page.locator("[data-gallery-card]").evaluateAll((cards) =>
    cards.map((card) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(card).transform);
      return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    }),
  );
  expect(rotations.every((rotation) => Math.abs(rotation) < 0.01)).toBe(true);

  await dragActiveCard(page, -100);
  await expectActive(page, 0);
  await page.getByRole("button", { name: "Next project" }).click();
  await expectActive(page, 1);
});

test("renders local 3:4 media without crop or horizontal overflow", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => browserErrors.push(`pageerror: ${error.message}`));

  await page.setViewportSize({ width: 320, height: 844 });
  await openGallery(page);

  for (let index = 0; index < projectTitles.length; index += 1) {
    await page.getByRole("button", { name: `Show project ${index + 1}`, exact: true }).click();
    await waitForActiveCardToSettle(page);
    const image = page.locator(`${activeCardSelector} img`);
    await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBe(1200);

    const imageData = await image.evaluate((element) => {
      const imageElement = element as HTMLImageElement;
      const rect = imageElement.getBoundingClientRect();
      return {
        attrHeight: imageElement.getAttribute("height"),
        attrWidth: imageElement.getAttribute("width"),
        className: imageElement.className,
        naturalHeight: imageElement.naturalHeight,
        naturalWidth: imageElement.naturalWidth,
        objectFit: getComputedStyle(imageElement).objectFit,
        ratio: rect.width / rect.height,
      };
    });

    expect(imageData).toMatchObject({
      attrHeight: "1600",
      attrWidth: "1200",
      naturalHeight: 1600,
      naturalWidth: 1200,
    });
    expect(imageData.className).not.toContain("object-cover");
    expect(imageData.objectFit).not.toBe("cover");
    expect(Math.abs(imageData.ratio - 0.75)).toBeLessThan(0.01);
  }

  const statuses = await page.evaluate(async (assets) =>
    Promise.all(assets.map(async (asset) => (await fetch(asset)).status)),
    galleryAssets,
  );
  expect(statuses).toEqual([200, 200, 200, 200]);

  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  }

  expect(browserErrors).toEqual([]);
});
