import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

const exportRoot = path.resolve(process.cwd(), "out");
const port = Number(process.env.PORT ?? 4173);

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mp4", "video/mp4"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
]);

async function resolveExportFile(pathname) {
  const relativePath = decodeURIComponent(pathname).replace(/^[/\\]+/, "");
  let filePath = path.resolve(exportRoot, relativePath || "index.html");
  const relativeToRoot = path.relative(exportRoot, filePath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return null;
  }

  try {
    if ((await stat(filePath)).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    if (!path.extname(filePath)) {
      filePath = `${filePath}.html`;
    }
  }

  return filePath;
}

function parseRange(rangeHeader, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());

  if (!match || (!match[1] && !match[2]) || size === 0) {
    return null;
  }

  if (!match[1]) {
    const suffixLength = Number(match[2]);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
      return null;
    }

    return {
      start: Math.max(0, size - suffixLength),
      end: size - 1,
    };
  }

  const start = Number(match[1]);
  if (!Number.isSafeInteger(start) || start >= size) {
    return null;
  }

  if (!match[2]) {
    return { start, end: size - 1 };
  }

  const requestedEnd = Number(match[2]);
  if (!Number.isSafeInteger(requestedEnd) || requestedEnd < start) {
    return null;
  }

  return { start, end: Math.min(requestedEnd, size - 1) };
}

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? "/", `http://127.0.0.1:${port}`).pathname;
    const filePath = await resolveExportFile(pathname);

    if (!filePath) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) {
      throw new Error("Not a file");
    }

    const size = fileStats.size;
    const extension = path.extname(filePath);
    const headers = {
      "Content-Type": contentTypes.get(path.extname(filePath)) ?? "application/octet-stream",
      "Accept-Ranges": "bytes",
      "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=3600",
    };
    const rangeHeader = request.headers.range;
    const range = rangeHeader ? parseRange(rangeHeader, size) : undefined;

    if (rangeHeader && !range) {
      response.writeHead(416, {
        ...headers,
        "Content-Range": `bytes */${size}`,
        "Content-Length": 0,
      });
      response.end();
      return;
    }

    const status = range ? 206 : 200;
    const start = range?.start ?? 0;
    const end = range?.end ?? size - 1;
    const contentLength = range ? end - start + 1 : size;

    response.writeHead(status, {
      ...headers,
      ...(range ? { "Content-Range": `bytes ${start}-${end}/${size}` } : {}),
      "Content-Length": contentLength,
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath, range ? { start, end } : undefined)
      .on("error", () => response.destroy())
      .pipe(response);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving static export at http://127.0.0.1:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
