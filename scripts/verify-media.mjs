import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const expectedAssets = new Map([
  ["public/images/logo-clean.png", [1284, 805]],
  ["public/images/logo-clean.webp", [512, 321]],
  ["public/images/services.webp", [947, 2048]],
  ["public/images/poceta.webp", [1200, 1600]],
  ["public/images/lavamanos.webp", [1200, 1600]],
  ["public/images/banera-antes.webp", [1200, 1600]],
  ["public/images/banera.webp", [1200, 1600]],
  ["app/icon.png", [512, 512]],
]);
const maximumAssetBytes = new Map([["public/images/logo-clean.webp", 100_000]]);

const videoPath = "public/video/silicone-solutions.mp4";
const expectedVideoHash =
  "8A4753019AC7F39E446E94E5F6A5634ED047199CCD5E87E274754D715DE577E2";
const mobileVideoPath = "public/video/silicone-solutions-mobile.mp4";
const expectedMobileVideo = {
  hash: "05884A4D344E8503F8C90FC1516FA2560C5361CC6AC6FCFFEFB89D29115FD1FA",
  bytes: 1_910_097,
  width: 480,
  height: 854,
  duration: 38.8,
};
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

function childBoxes(buffer, parent) {
  const boxes = [];
  let offset = parent.dataStart;

  while (offset + 8 <= parent.end) {
    const size = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const headerSize = size === 1 ? 16 : 8;
    const boxSize = size === 1 ? Number(buffer.readBigUInt64BE(offset + 8)) : size;
    const end = boxSize === 0 ? parent.end : offset + boxSize;

    if (!Number.isSafeInteger(boxSize) || end > parent.end || end <= offset + headerSize) {
      break;
    }

    boxes.push({ type, dataStart: offset + headerSize, end });
    offset = end;
  }

  return boxes;
}

function firstBox(buffer, parent, type) {
  return childBoxes(buffer, parent).find((box) => box.type === type);
}

function readMp4VideoMetadata(fileBuffer) {
  const root = { dataStart: 0, end: fileBuffer.length };
  const moov = firstBox(fileBuffer, root, "moov");
  if (!moov) {
    throw new Error("missing moov box");
  }

  const videoTrack = childBoxes(fileBuffer, moov).find((track) => {
    if (track.type !== "trak") return false;
    const mdia = firstBox(fileBuffer, track, "mdia");
    const hdlr = mdia && firstBox(fileBuffer, mdia, "hdlr");
    return hdlr && fileBuffer.toString("ascii", hdlr.dataStart + 8, hdlr.dataStart + 12) === "vide";
  });

  if (!videoTrack) {
    throw new Error("missing video track");
  }

  const tkhd = firstBox(fileBuffer, videoTrack, "tkhd");
  const mdia = firstBox(fileBuffer, videoTrack, "mdia");
  const mdhd = mdia && firstBox(fileBuffer, mdia, "mdhd");
  if (!tkhd || !mdhd) {
    throw new Error("missing video timing metadata");
  }

  const version = fileBuffer[tkhd.dataStart];
  const dimensionOffset = version === 1 ? 88 : 76;
  const width = fileBuffer.readUInt32BE(tkhd.dataStart + dimensionOffset) / 65536;
  const height = fileBuffer.readUInt32BE(tkhd.dataStart + dimensionOffset + 4) / 65536;
  const timingVersion = fileBuffer[mdhd.dataStart];
  const timescaleOffset = timingVersion === 1 ? 20 : 12;
  const durationOffset = timingVersion === 1 ? 24 : 16;
  const timescale = fileBuffer.readUInt32BE(mdhd.dataStart + timescaleOffset);
  const duration = timingVersion === 1
    ? Number(fileBuffer.readBigUInt64BE(mdhd.dataStart + durationOffset)) / timescale
    : fileBuffer.readUInt32BE(mdhd.dataStart + durationOffset) / timescale;

  return { width, height, duration };
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

    const maximumBytes = maximumAssetBytes.get(assetPath);
    if (maximumBytes) {
      const { size } = await stat(assetPath);
      if (size > maximumBytes) {
        failures.push(`${assetPath}: expected at most ${maximumBytes} bytes, received ${size}`);
      } else {
        console.log(`OK ${assetPath} ${size} bytes`);
      }
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

try {
  const mobileVideoBuffer = await readFile(mobileVideoPath);
  const actualMobileVideoHash = await sha256(mobileVideoPath);
  const mobileVideoMetadata = readMp4VideoMetadata(mobileVideoBuffer);
  const metadataMatches =
    mobileVideoMetadata.width === expectedMobileVideo.width &&
    mobileVideoMetadata.height === expectedMobileVideo.height &&
    Math.abs(mobileVideoMetadata.duration - expectedMobileVideo.duration) < 0.1;

  if (actualMobileVideoHash !== expectedMobileVideo.hash) {
    failures.push(`${mobileVideoPath}: expected SHA-256 ${expectedMobileVideo.hash}, received ${actualMobileVideoHash}`);
  }
  if (mobileVideoBuffer.byteLength !== expectedMobileVideo.bytes) {
    failures.push(`${mobileVideoPath}: expected ${expectedMobileVideo.bytes} bytes, received ${mobileVideoBuffer.byteLength}`);
  }
  if (!metadataMatches) {
    failures.push(
      `${mobileVideoPath}: expected ${expectedMobileVideo.width}x${expectedMobileVideo.height} ~${expectedMobileVideo.duration}s, received ${mobileVideoMetadata.width}x${mobileVideoMetadata.height} ${mobileVideoMetadata.duration.toFixed(3)}s`,
    );
  }
  if (actualMobileVideoHash === expectedMobileVideo.hash && mobileVideoBuffer.byteLength === expectedMobileVideo.bytes && metadataMatches) {
    console.log(
      `OK ${mobileVideoPath} ${mobileVideoMetadata.width}x${mobileVideoMetadata.height} ${mobileVideoMetadata.duration.toFixed(3)}s ${mobileVideoBuffer.byteLength} bytes SHA-256 ${actualMobileVideoHash}`,
    );
  }
} catch (error) {
  failures.push(`${mobileVideoPath}: ${error instanceof Error ? error.message : String(error)}`);
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
