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
