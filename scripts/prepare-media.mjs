import sharp from "sharp";

await sharp("public/images/logo.jpg")
  .extract({ left: 0, top: 250, width: 1284, height: 805 })
  .png({ compressionLevel: 9 })
  .toFile("public/images/logo-clean.png");

await sharp("public/images/logo.jpg")
  .extract({ left: 55, top: 285, width: 275, height: 445 })
  .resize({ width: 512, height: 512, fit: "contain", background: "#FAFAF8" })
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
