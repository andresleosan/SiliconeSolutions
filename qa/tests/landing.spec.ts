import { expect, test, type Page } from "@playwright/test";

type Rgba = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

type HeroTestWindow = Window & {
  runHeroIdle?: () => void;
  heroPlayAttempts: number;
};

const sectionIdentifiers = [
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
];

function parseCssColor(value: string): Rgba {
  const components = value.match(/-?[\d.]+/g)?.map(Number);
  if (!components || components.length < 3) {
    throw new Error(`Unsupported CSS color: ${value}`);
  }

  if (value.startsWith("oklab")) {
    const [lightness, axisA, axisB, alpha = 1] = components;
    const lRoot = lightness + 0.3963377774 * axisA + 0.2158037573 * axisB;
    const mRoot = lightness - 0.1055613458 * axisA - 0.0638541728 * axisB;
    const sRoot = lightness - 0.0894841775 * axisA - 1.291485548 * axisB;
    const l = lRoot ** 3;
    const m = mRoot ** 3;
    const s = sRoot ** 3;
    const linearChannels = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
    const [red, green, blue] = linearChannels.map((channel) => {
      const srgb =
        channel <= 0.0031308
          ? 12.92 * channel
          : 1.055 * channel ** (1 / 2.4) - 0.055;
      return Math.min(255, Math.max(0, srgb * 255));
    });

    return { red, green, blue, alpha };
  }

  const usesSrgbUnits = value.startsWith("color(srgb");
  const multiplier = usesSrgbUnits ? 255 : 1;

  return {
    red: components[0] * multiplier,
    green: components[1] * multiplier,
    blue: components[2] * multiplier,
    alpha: components[3] ?? 1,
  };
}

function composite(foreground: Rgba, background: Rgba): Rgba {
  return {
    red: foreground.red * foreground.alpha + background.red * (1 - foreground.alpha),
    green: foreground.green * foreground.alpha + background.green * (1 - foreground.alpha),
    blue: foreground.blue * foreground.alpha + background.blue * (1 - foreground.alpha),
    alpha: 1,
  };
}

function relativeLuminance(color: Rgba): number {
  const channels = [color.red, color.green, color.blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(first: Rgba, second: Rgba): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

async function openLanding(page: Page): Promise<void> {
  await page.goto("/", { waitUntil: "load" });
  await expect(page.locator("main")).toBeVisible();
}

test("exposes the exact landing structure and confirmed contact routes", async ({ page }) => {
  await openLanding(page);

  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.getByText("The Perfect Finish. Every Time.", { exact: true })).toBeVisible();

  const identifiers = await page.locator("main > section").evaluateAll((sections) =>
    sections.map(
      (section) => section.getAttribute("aria-labelledby") ?? section.getAttribute("aria-label"),
    ),
  );
  expect(identifiers).toEqual(sectionIdentifiers);
  await expect(page.getByRole("link", { name: "Call Now", exact: true }).first()).toHaveAttribute(
    "href",
    "tel:+447700323453",
  );
  await expect(page.locator("a[href*='wa.me/447700323453']").first()).toHaveAttribute(
    "href",
    /wa\.me\/447700323453/,
  );

  const defaultWhatsAppMessage =
    "Hello, I have just seen your website and I would like to hire your services, please.";
  const whatsappLinks = page.locator("a[href^='https://wa.me/447700323453']");
  for (const link of await whatsappLinks.all()) {
    const href = await link.getAttribute("href");
    expect(new URL(href ?? "").searchParams.get("text")).toBe(defaultWhatsAppMessage);
  }
});

test("fits mobile and desktop viewports without browser errors or an obscured footer", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => browserErrors.push(`pageerror: ${error.message}`));

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 1000 },
  ]) {
    browserErrors.length = 0;
    await page.setViewportSize(viewport);
    await openLanding(page);

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    const contactBar = page.getByRole("navigation", { name: "Quick contact actions" });
    if (viewport.width === 390) {
      await expect(contactBar).toBeVisible();

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

      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const footerBox = await page.locator("footer").boundingBox();
      const contactBarBox = await contactBar.boundingBox();
      expect(footerBox).not.toBeNull();
      expect(contactBarBox).not.toBeNull();
      expect((footerBox?.y ?? 0) + (footerBox?.height ?? 0)).toBeLessThanOrEqual(
        contactBarBox?.y ?? 0,
      );
    } else {
      await expect(contactBar).toBeHidden();
    }

    await page.waitForTimeout(100);
    expect(browserErrors).toEqual([]);
  }
});

test("renders the desktop hero poster immediately and loads the desktop video after idle", async ({
  page,
}) => {
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/video/")) videoRequests.push(request.url());
  });
  await page.addInitScript(() => {
    let idleCallback: (() => void) | undefined;
    const browserWindow = window as unknown as HeroTestWindow;

    Object.defineProperty(window, "requestIdleCallback", {
      configurable: true,
      value: (callback: IdleRequestCallback) => {
        idleCallback = () => callback({ didTimeout: false, timeRemaining: () => 50 });
        return 1;
      },
    });
    Object.defineProperty(browserWindow, "runHeroIdle", {
      configurable: true,
      value: () => idleCallback?.(),
    });
    browserWindow.heroPlayAttempts = 0;
    HTMLMediaElement.prototype.play = function () {
      browserWindow.heroPlayAttempts += 1;
      return Promise.resolve();
    };
  });

  await openLanding(page);
  const video = page.locator("video");
  await expect(video).toHaveAttribute("poster", "/images/services.webp");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("src", /.+/);
  await expect(video.locator("source")).toHaveCount(2);
  await expect(video.locator("source").nth(0)).toHaveAttribute("media", "(max-width: 767px)");
  await expect(video.locator("source").nth(0)).not.toHaveAttribute("src", /.+/);
  await expect(video.locator("source").nth(1)).not.toHaveAttribute("src", /.+/);
  expect(await video.evaluate((element) => (element as HTMLVideoElement).currentSrc)).toBe("");
  expect(videoRequests).toEqual([]);

  await page.evaluate(() => {
    (window as unknown as HeroTestWindow).runHeroIdle?.();
  });

  await expect
    .poll(() => videoRequests)
    .toContain("http://127.0.0.1:4173/video/silicone-solutions.mp4");
  await expect(video.locator("source").nth(1)).toHaveAttribute("src", "/video/silicone-solutions.mp4");
  expect(videoRequests.some((request) => request.endsWith("silicone-solutions-mobile.mp4"))).toBe(
    false,
  );
  expect(await video.evaluate((element) => (element as HTMLVideoElement).currentSrc)).toBe(
    "http://127.0.0.1:4173/video/silicone-solutions.mp4",
  );
  await expect
    .poll(() => page.evaluate(() => (window as unknown as HeroTestWindow).heroPlayAttempts))
    .toBe(1);
  expect(await video.evaluate((element) => ({
    autoplay: (element as HTMLVideoElement).autoplay,
    muted: (element as HTMLVideoElement).muted,
    loop: (element as HTMLVideoElement).loop,
    playsInline: (element as HTMLVideoElement).playsInline,
  }))).toEqual({ autoplay: true, muted: true, loop: true, playsInline: true });
});

test("selects the reduced mobile hero video only after the deferred load window", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/video/")) videoRequests.push(request.url());
  });
  await page.addInitScript(() => {
    let idleCallback: (() => void) | undefined;
    const browserWindow = window as unknown as HeroTestWindow;

    Object.defineProperty(window, "requestIdleCallback", {
      configurable: true,
      value: (callback: IdleRequestCallback) => {
        idleCallback = () => callback({ didTimeout: false, timeRemaining: () => 50 });
        return 1;
      },
    });
    Object.defineProperty(browserWindow, "runHeroIdle", {
      configurable: true,
      value: () => idleCallback?.(),
    });
    browserWindow.heroPlayAttempts = 0;
    HTMLMediaElement.prototype.play = function () {
      browserWindow.heroPlayAttempts += 1;
      return Promise.resolve();
    };
  });

  await openLanding(page);
  const video = page.locator("video");
  await expect(video).toHaveAttribute("poster", "/images/services.webp");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("src", /.+/);
  expect(await video.evaluate((element) => (element as HTMLVideoElement).currentSrc)).toBe("");
  expect(videoRequests).toEqual([]);

  await page.evaluate(() => {
    (window as unknown as HeroTestWindow).runHeroIdle?.();
  });

  await expect
    .poll(() => videoRequests)
    .toContain("http://127.0.0.1:4173/video/silicone-solutions-mobile.mp4");
  await expect(video.locator("source").nth(0)).toHaveAttribute(
    "src",
    "/video/silicone-solutions-mobile.mp4",
  );
  expect(videoRequests.some((request) => request.endsWith("silicone-solutions.mp4"))).toBe(false);
  expect(await video.evaluate((element) => (element as HTMLVideoElement).currentSrc)).toBe(
    "http://127.0.0.1:4173/video/silicone-solutions-mobile.mp4",
  );
  await expect
    .poll(() => page.evaluate(() => (window as unknown as HeroTestWindow).heroPlayAttempts))
    .toBe(1);
});

test("keeps the hero poster only when reduced motion is preferred", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/video/")) videoRequests.push(request.url());
  });
  await page.addInitScript(() => {
    const browserWindow = window as unknown as HeroTestWindow;
    browserWindow.heroPlayAttempts = 0;
    HTMLMediaElement.prototype.play = function () {
      browserWindow.heroPlayAttempts += 1;
      return Promise.resolve();
    };
  });

  await openLanding(page);
  const video = page.locator("video");
  await expect(video).toHaveAttribute("poster", "/images/services.webp");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("src", /.+/);
  expect(await video.evaluate((element) => (element as HTMLVideoElement).currentSrc)).toBe("");
  expect(await page.evaluate(() => (window as unknown as HeroTestWindow).heroPlayAttempts)).toBe(0);
  await page.waitForTimeout(250);
  expect(videoRequests).toEqual([]);
});

test("prevents the measured accessibility regressions", async ({ page }) => {
  await openLanding(page);

  const serviceIconWrappers = page.locator(
    "#services-rail article > div:last-child > div:first-child > div:first-child",
  );
  await expect(serviceIconWrappers).toHaveCount(6);
  for (const wrapper of await serviceIconWrappers.all()) {
    await expect(wrapper).toHaveAttribute("aria-hidden", "true");
    await expect(wrapper).not.toHaveAttribute("aria-label", /.+/);
  }

  const aboutItems = page.locator("#about dl > div");
  await expect(aboutItems).toHaveCount(3);
  for (const item of await aboutItems.all()) {
    await expect(item.locator(":scope > svg")).toHaveCount(1);
    await expect(item.locator(":scope > dt")).toHaveCount(1);
    await expect(item.locator(":scope > dd")).toHaveCount(1);
  }

  const emailLinks = page.locator("a[href='mailto:davidcameron481@yahoo.com']");
  await expect(emailLinks).toHaveCount(2);
  for (const emailLink of await emailLinks.all()) {
    await expect(emailLink).toHaveAccessibleName(
      "Email Silicone Solutions: davidcameron481@yahoo.com",
    );
  }

  const solutionNumbers = page.locator("#work ol > li > span");
  await expect(solutionNumbers).toHaveCount(4);
  for (const number of await solutionNumbers.all()) {
    await expect(number).toHaveAttribute("aria-hidden", "true");
    const colors = await number.evaluate((element) => ({
      foreground: getComputedStyle(element).color,
      background: getComputedStyle(element).backgroundColor,
      sectionBackground: getComputedStyle(element.closest("section") as Element).backgroundColor,
    }));
    const sectionBackground = parseCssColor(colors.sectionBackground);
    const background = composite(parseCssColor(colors.background), sectionBackground);
    const foreground = composite(parseCssColor(colors.foreground), background);
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  }
});

test("keeps the reported visual sections compact and aligned", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openLanding(page);

  await expect(page.locator(".logo-mark").first()).toHaveCSS("overflow", "hidden");
  await expect(page.locator("section[aria-labelledby='final-cta-title'] a").first()).toHaveCSS(
    "color",
    "rgb(250, 250, 248)",
  );
  const finalCall = page.locator("section[aria-labelledby='final-cta-title'] a").nth(1);
  await expect(finalCall).toHaveCSS("color", "rgb(15, 23, 42)");
  await expect(finalCall).toHaveCSS("background-color", "rgb(250, 250, 248)");
  await expect(page.locator("section[aria-labelledby='benefits-title'] article").first()).toHaveCSS(
    "min-height",
    "auto",
  );
  await expect(page.locator("#services-rail")).toHaveCSS("align-items", "flex-start");

  const heroCall = page.getByRole("link", { name: "Call Now", exact: true }).first();
  await heroCall.hover();
  await expect(heroCall).toHaveCSS("color", "rgb(15, 23, 42)");
  await expect(heroCall).toHaveCSS("background-color", "rgb(250, 250, 248)");

  const imageColumn = page.locator("#work > .container > div:first-child > div:last-child");
  const imageColumnBox = await imageColumn.boundingBox();
  const figures = page.locator("#work > .container > div:first-child > div:last-child figure");
  const figureBoxes = await figures.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().y),
  );
  expect(figureBoxes).toHaveLength(2);
  expect(imageColumnBox).not.toBeNull();
  expect(Math.abs(figureBoxes[0] - (imageColumnBox?.y ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs(figureBoxes[0] - figureBoxes[1])).toBeLessThanOrEqual(1);

  const serviceImages = await page.locator("#services-rail article img").evaluateAll((images) =>
    images.map((image) => image.getBoundingClientRect().height),
  );
  expect(Math.max(...serviceImages) - Math.min(...serviceImages)).toBeLessThanOrEqual(1);
  await expect(page.locator("#services-rail").getByText("Service 01", { exact: true })).toHaveCount(0);
  await expect(page.locator("#services-rail").getByText("Bath", { exact: true })).toHaveCount(0);
  await expect(page.locator("section[aria-labelledby='benefits-title'] article svg")).toHaveCount(0);
});

test("serves the static hero video with byte ranges and correct HEAD semantics", async ({
  request,
}) => {
  const videoUrl = "/video/silicone-solutions.mp4";

  const explicitRange = await request.get(videoUrl, {
    headers: { Range: "bytes=0-99" },
  });
  expect(explicitRange.status()).toBe(206);
  expect((await explicitRange.body()).byteLength).toBe(100);
  expect(explicitRange.headers()["accept-ranges"]).toBe("bytes");
  expect(explicitRange.headers()["cache-control"]).toBe("public, max-age=3600");
  expect(explicitRange.headers()["content-range"]).toBe("bytes 0-99/4078835");
  expect(explicitRange.headers()["content-length"]).toBe("100");

  const suffixRange = await request.get(videoUrl, {
    headers: { Range: "bytes=-100" },
  });
  expect(suffixRange.status()).toBe(206);
  expect((await suffixRange.body()).byteLength).toBe(100);
  expect(suffixRange.headers()["content-range"]).toBe("bytes 4078735-4078834/4078835");

  const head = await request.head(videoUrl);
  expect(head.status()).toBe(200);
  expect(head.headers()["content-length"]).toBe("4078835");
  expect((await head.body()).byteLength).toBe(0);

  const unsatisfiableRange = await request.get(videoUrl, {
    headers: { Range: "bytes=4078835-" },
  });
  expect(unsatisfiableRange.status()).toBe(416);
  expect(unsatisfiableRange.headers()["content-range"]).toBe("bytes */4078835");
});
