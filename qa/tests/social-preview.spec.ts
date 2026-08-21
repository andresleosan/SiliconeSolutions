import { expect, test } from "@playwright/test";
import sharp from "sharp";

const socialTitle = "Professional Silicone Sealing in Jersey | Silicone Solutions";
const socialDescription =
  "Professional silicone sealing across Jersey for homes and businesses. Clean workmanship, durable results and competitive pricing.";
const socialImageAlt = "Silicone Solutions professional silicone sealing in Jersey";

test("exposes complete social sharing metadata and the static preview image", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://siliconesolutions.pages.dev/",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", socialTitle);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    socialDescription,
  );
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
    socialImageAlt,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", socialTitle);
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
    "content",
    socialDescription,
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    "https://siliconesolutions.pages.dev/og-image.png",
  );
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
    "content",
    socialImageAlt,
  );

  const imageResponse = await page.request.get("/og-image.png");
  expect(imageResponse.ok()).toBe(true);
  expect(imageResponse.headers()["content-type"]).toContain("image/png");
  const imageMetadata = await sharp(await imageResponse.body()).metadata();
  expect(imageMetadata.format).toBe("png");
  expect(imageMetadata.width).toBe(1200);
  expect(imageMetadata.height).toBe(630);
});
