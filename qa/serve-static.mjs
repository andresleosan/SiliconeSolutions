import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
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

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? "/", `http://127.0.0.1:${port}`).pathname;
    const filePath = await resolveExportFile(pathname);

    if (!filePath) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes.get(path.extname(filePath)) ?? "application/octet-stream",
    });
    response.end(body);
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
