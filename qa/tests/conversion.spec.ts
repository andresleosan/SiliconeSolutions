import { expect, test, type Page } from "@playwright/test";

type BrowserCapture = {
  consoleMessages: Array<{ type: string; text: string; args: unknown[] }>;
  pageErrors: string[];
  requests: Array<{ url: string; postData: string }>;
  pendingCaptures: Array<Promise<void>>;
};

type Rgba = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

async function openConversionPage(page: Page): Promise<BrowserCapture> {
  const capture: BrowserCapture = {
    consoleMessages: [],
    pageErrors: [],
    requests: [],
    pendingCaptures: [],
  };

  page.on("console", (message) => {
    const pendingCapture = Promise.all(
      message.args().map(async (argument) => {
        try {
          return await argument.jsonValue();
        } catch (error) {
          return {
            unserializable: error instanceof Error ? error.message : String(error),
          };
        }
      }),
    ).then((args) => {
      capture.consoleMessages.push({ type: message.type(), text: message.text(), args });
    });
    capture.pendingCaptures.push(pendingCapture);
  });
  page.on("pageerror", (error) => capture.pageErrors.push(error.message));
  page.on("request", (request) => {
    capture.requests.push({
      url: request.url(),
      postData: request.postData() ?? "",
    });
  });

  await page.addInitScript(() => {
    (window as unknown as Window & { __openedWindows: string[][] }).__openedWindows = [];
    window.open = (...args) => {
      (window as unknown as Window & { __openedWindows: string[][] }).__openedWindows.push(
        args.map((value) => String(value ?? "")),
      );
      return null;
    };
  });
  await page.goto("/");

  return capture;
}

async function flushBrowserCapture(page: Page, capture: BrowserCapture): Promise<void> {
  await page.evaluate(() => Promise.resolve());

  let capturedPromiseCount = -1;
  while (capturedPromiseCount !== capture.pendingCaptures.length) {
    capturedPromiseCount = capture.pendingCaptures.length;
    await Promise.all(capture.pendingCaptures.slice(0, capturedPromiseCount));
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
}

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

test("renders benefits, process, and honest testimonial states", async ({ page }) => {
  await openConversionPage(page);

  await expect(page.getByRole("heading", { name: "Why Jersey Chooses Silicone Solutions" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A clear route to a perfect finish" })).toBeVisible();
  await expect(page.locator("section[aria-labelledby='benefits-title'] article")).toHaveCount(6);
  await expect(page.locator("section[aria-labelledby='process-title'] ol > li")).toHaveCount(4);
  await expect(page.getByText("Verified recommendation")).toHaveCount(1);
  await expect(page.getByText("Example review", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Example review - replace before launch", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Kate Forde", { exact: true })).toBeVisible();
  await expect(page.locator("section[aria-labelledby='testimonials-title'] blockquote").first()).not.toContainText("👌");

  const benefitNumbers = page.locator("section[aria-labelledby='benefits-title'] article > span");
  await expect(benefitNumbers).toHaveCount(6);

  for (const number of await benefitNumbers.all()) {
    await expect(number).toHaveAttribute("aria-hidden", "true");
    const colors = await number.evaluate((element) => ({
      foreground: getComputedStyle(element).color,
      background: getComputedStyle(element.closest("section") as Element).backgroundColor,
    }));
    const background = parseCssColor(colors.background);
    expect(
      contrastRatio(composite(parseCssColor(colors.foreground), background), background),
    ).toBeGreaterThanOrEqual(4.5);
  }
});

test("blocks invalid quote submission and opens only an encoded valid request", async ({ page }) => {
  const capture = await openConversionPage(page);
  const expectedErrors = {
    name: "Enter your name.",
    contact: "Enter a phone number or email address.",
    service: "Choose a type of work.",
    message: "Tell us what needs sealing.",
  } as const;

  await page.getByRole("button", { name: "Build my free quote request" }).click();
  await expect(page.locator("#quote-name")).toBeFocused();

  for (const [field, message] of Object.entries(expectedErrors)) {
    const control = page.locator(`#quote-${field}`);
    await expect(control).toHaveAttribute("aria-invalid", "true");
    await expect(control).toHaveAttribute("aria-describedby", `quote-${field}-error`);
    await expect(page.locator(`#quote-${field}-error`)).toHaveText(message);
  }

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as Window & { __openedWindows: string[][] }).__openedWindows.length,
      ),
    )
    .toBe(0);

  await page.getByLabel("Name", { exact: true }).fill(" Test Visitor ");
  await expect(page.locator("#quote-name-error")).toHaveCount(0);
  await expect(page.locator("#quote-name")).toHaveAttribute("aria-invalid", "false");
  await expect(page.locator("#quote-name")).not.toHaveAttribute("aria-describedby", /.+/);

  for (const field of ["contact", "service", "message"] as const) {
    await expect(page.locator(`#quote-${field}-error`)).toHaveText(expectedErrors[field]);
    await expect(page.locator(`#quote-${field}`)).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator(`#quote-${field}`)).toHaveAttribute(
      "aria-describedby",
      `quote-${field}-error`,
    );
  }

  await page.getByLabel("Phone or email", { exact: true }).fill(" test@example.com ");
  await page
    .getByLabel("Type of work", { exact: true })
    .selectOption({ label: "Bathroom Silicone Sealing" });
  await page.getByLabel("Message", { exact: true }).fill(" Please quote a bathroom reseal. ");

  const privateValues = [
    "Test Visitor",
    "test@example.com",
    "Bathroom Silicone Sealing",
    "Please quote a bathroom reseal.",
  ];
  const requestContainsPrivateValue = (request: { url: string; postData: string }) =>
    [request.url, request.postData].some((content) =>
      privateValues.some(
        (value) => content.includes(value) || content.includes(encodeURIComponent(value)),
      ),
    );

  await flushBrowserCapture(page, capture);

  expect.soft(capture.requests.filter(requestContainsPrivateValue)).toEqual([]);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  expect(await page.context().cookies(page.url())).toEqual([]);
  expect(new URL(page.url()).search).toBe("");
  expect.soft(capture.consoleMessages).toEqual([]);
  expect(capture.pageErrors).toEqual([]);

  await page.getByRole("button", { name: "Build my free quote request" }).click();

  const openedWindows = await page.evaluate(
    () => (window as unknown as Window & { __openedWindows: string[][] }).__openedWindows,
  );
  const expectedMessage = [
    "Hello Silicone Solutions, I would like a free quote.",
    "Name: Test Visitor",
    "Contact: test@example.com",
    "Service: Bathroom Silicone Sealing",
    "Message: Please quote a bathroom reseal.",
  ].join("\n");
  const expectedUrl = `https://wa.me/447700323453?text=${encodeURIComponent(expectedMessage)}`;
  expect(openedWindows).toEqual([[expectedUrl, "_blank", "noopener,noreferrer"]]);

  const parsedUrl = new URL(openedWindows[0][0]);
  expect(parsedUrl.origin + parsedUrl.pathname).toBe("https://wa.me/447700323453");
  expect([...parsedUrl.searchParams.entries()]).toEqual([["text", expectedMessage]]);
  await flushBrowserCapture(page, capture);
  expect.soft(capture.requests.filter(requestContainsPrivateValue)).toEqual([]);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  expect(await page.context().cookies(page.url())).toEqual([]);
  expect(new URL(page.url()).search).toBe("");
  expect.soft(capture.consoleMessages).toEqual([]);
  expect(capture.pageErrors).toEqual([]);
});

test("exposes only confirmed conversion routes", async ({ page }) => {
  await openConversionPage(page);
  const contactAreas = [page.locator("#contact"), page.locator("footer")];
  const defaultWhatsAppHref = `https://wa.me/447700323453?text=${encodeURIComponent(
    "Hello, I have just seen your website and I would like to hire your services, please.",
  )}`;

  for (const area of contactAreas) {
    await expect(area.getByRole("link", { name: "Call +44 7700 323453" })).toHaveAttribute(
      "href",
      "tel:+447700323453",
    );
    await expect(area.getByRole("link", { name: "Email Silicone Solutions" })).toHaveAttribute(
      "href",
      "mailto:davidcameron481@yahoo.com",
    );
    await expect(area.getByRole("link", { name: "Message on WhatsApp" })).toHaveAttribute(
      "href",
      defaultWhatsAppHref,
    );
  }

  await expect(page.locator("footer")).toContainText("Jersey, Channel Islands");
  const footerHrefs = await page.locator("footer a").evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")).sort(),
  );
  expect(footerHrefs).toEqual(
    [
      "tel:+447700323453",
      defaultWhatsAppHref,
      "mailto:davidcameron481@yahoo.com",
    ].sort(),
  );
});

test("renders form controls and benefit numbers with sufficient contrast", async ({ page }) => {
  await openConversionPage(page);

  const fieldColors = await page
    .locator("#quote-name, #quote-contact, #quote-service, #quote-message")
    .evaluateAll((fields) =>
      fields.map((field) => {
        const style = getComputedStyle(field);
        const panel = field.closest("form")?.parentElement;
        return {
          id: field.id,
          border: style.borderTopColor,
          fill: style.backgroundColor,
          panel: panel ? getComputedStyle(panel).backgroundColor : "",
        };
      }),
    );

  expect(fieldColors).toHaveLength(4);
  for (const colors of fieldColors) {
    const panel = parseCssColor(colors.panel);
    const fill = composite(parseCssColor(colors.fill), panel);
    const border = parseCssColor(colors.border);

    expect(
      contrastRatio(composite(border, panel), panel),
      `${colors.id} border against the navy panel`,
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrastRatio(composite(border, fill), fill),
      `${colors.id} border against its fill`,
    ).toBeGreaterThanOrEqual(3);
  }
});
