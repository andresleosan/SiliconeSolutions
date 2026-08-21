import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(projectRoot, "public");

const width = 1200;
const height = 630;
const navy = "#0F172A";
const orange = "#F97316";
const warmWhite = "#FAFAF8";

const textOverlay = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="${navy}"/>
    <rect x="64" y="56" width="380" height="154" rx="20" fill="${warmWhite}"/>
    <rect x="86" y="278" width="170" height="8" rx="4" fill="${orange}"/>
    <text x="86" y="360" fill="${warmWhite}" font-family="Arial, sans-serif" font-size="54" font-weight="700">Professional</text>
    <text x="86" y="424" fill="${warmWhite}" font-family="Arial, sans-serif" font-size="54" font-weight="700">Silicone Sealing</text>
    <text x="86" y="474" fill="${warmWhite}" font-family="Arial, sans-serif" font-size="30">in Jersey</text>
    <text x="86" y="535" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="25">Clean workmanship. Durable results.</text>
    <text x="86" y="586" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="20">Silicone Solutions C.I. Ltd</text>
    <text x="1114" y="586" fill="${orange}" font-family="Arial, sans-serif" font-size="20" text-anchor="end">siliconesolutions.pages.dev</text>
  </svg>
`);

const logo = await sharp(path.join(publicDirectory, "images", "logo-clean.webp"))
  .resize({ width: 320, height: 120, fit: "contain", background: warmWhite })
  .png()
  .toBuffer();

await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: navy,
  },
})
  .composite([
    { input: textOverlay, top: 0, left: 0 },
    { input: logo, top: 73, left: 94 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDirectory, "og-image.png"));
