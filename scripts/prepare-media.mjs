import sharp from "sharp";

await sharp("public/images/logo.jpg")
  .extract({ left: 0, top: 250, width: 1284, height: 805 })
  .png({ compressionLevel: 9 })
  .toFile("public/images/logo-clean.png");

const { data: iconRegion, info: iconInfo } = await sharp("public/images/logo.jpg")
  .extract({ left: 40, top: 280, width: 485, height: 490 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let index = 0; index < iconRegion.length; index += iconInfo.channels) {
  const red = iconRegion[index];
  const green = iconRegion[index + 1];
  const blue = iconRegion[index + 2];
  const isOrange =
    red >= 100 && red > green + 5 && red > blue + 10 && green >= blue - 5;

  if (!isOrange) {
    iconRegion.fill(0, index, index + iconInfo.channels);
  }
}

const crescent = await sharp(iconRegion, { raw: iconInfo })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .resize({
    width: 420,
    height: 420,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: "#FAFAF8",
  },
})
  .composite([{ input: crescent, gravity: "center" }])
  .png({ compressionLevel: 9 })
  .toFile("app/icon.png");

const workImages = [
  ["services", 947],
  ["poceta", 1200],
  ["lavamanos", 1200],
  ["banera-antes", 1200],
  ["banera", 1200],
];

for (const [name, width] of workImages) {
  await sharp(`public/images/${name}.jpg`)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`public/images/${name}.webp`);
}
