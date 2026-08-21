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
    <rect x="220" y="56" width="760" height="300" rx="28" fill="${warmWhite}"/>
    <rect x="360" y="414" width="480" height="8" rx="4" fill="${orange}"/>
    <text x="600" y="500" fill="${warmWhite}" font-family="Arial, sans-serif" font-size="46" font-weight="700" text-anchor="middle">Professional Silicone Sealing in Jersey</text>
    <text x="600" y="554" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="24" text-anchor="middle">Silicone Solutions C.I. Ltd</text>
  </svg>
`);

const logo = await sharp(path.join(publicDirectory, "images", "logo-clean.webp"))
  .resize({ width: 620, height: 250, fit: "contain", background: warmWhite })
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
    { input: logo, top: 81, left: 290 },
  ])
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
  .toFile(path.join(publicDirectory, "og-image-v2.jpg"));
