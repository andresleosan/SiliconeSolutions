import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const expectedAssets = new Map([
  ["public/images/logo-clean.png", [1284, 805]],
  ["public/images/services.webp", [947, 2048]],
  ["public/images/poceta.webp", [1200, 1600]],
  ["public/images/lavamanos.webp", [1200, 1600]],
  ["public/images/banera-antes.webp", [1200, 1600]],
  ["public/images/banera.webp", [1200, 1600]],
  ["app/icon.png", [512, 512]],
]);

const videoPath = "public/video/silicone-solutions.mp4";
const expectedVideoHash =
  "8A4753019AC7F39E446E94E5F6A5634ED047199CCD5E87E274754D715DE577E2";
const forbiddenSourcePath = String.raw`F:\Proyectos\SiliconeSolutions\Varios`;
const textExtensions = new Set([".css", ".js", ".jsx", ".json", ".md", ".mjs", ".ts", ".tsx"]);

async function sha256(filePath) {
  const hash = createHash("sha256");

  await new Promise((resolve, reject) => {
    createReadStream(filePath)
      .on("data", (chunk) => hash.update(chunk))
      .on("error", reject)
      .on("end", resolve);
  });

  return hash.digest("hex").toUpperCase();
}

async function findTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findTextFiles(entryPath)));
    } else if (entry.isFile() && textExtensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

const failures = [];

for (const [assetPath, [expectedWidth, expectedHeight]] of expectedAssets) {
  try {
    const { width, height } = await sharp(assetPath).metadata();

    if (width !== expectedWidth || height !== expectedHeight) {
      failures.push(
        `${assetPath}: expected ${expectedWidth}x${expectedHeight}, received ${width ?? "unknown"}x${height ?? "unknown"}`,
      );
    } else {
      console.log(`OK ${assetPath} ${width}x${height}`);
    }
  } catch (error) {
    failures.push(`${assetPath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  const actualVideoHash = await sha256(videoPath);

  if (actualVideoHash !== expectedVideoHash) {
    failures.push(`${videoPath}: expected SHA-256 ${expectedVideoHash}, received ${actualVideoHash}`);
  } else {
    console.log(`OK ${videoPath} SHA-256 ${actualVideoHash}`);
  }
} catch (error) {
  failures.push(`${videoPath}: ${error instanceof Error ? error.message : String(error)}`);
}

for (const sourceDirectory of ["app", "src"]) {
  for (const filePath of await findTextFiles(sourceDirectory)) {
    const contents = await readFile(filePath, "utf8");

    if (contents.includes(forbiddenSourcePath)) {
      failures.push(`${filePath}: contains forbidden source path ${forbiddenSourcePath}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Media verification failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Media verification passed.");
}
