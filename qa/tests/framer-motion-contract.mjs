import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const componentPaths = [
  "src/components/Hero.tsx",
  "src/components/ServicesCarousel.tsx",
  "src/components/WorkGallery.tsx",
];

for (const path of componentPaths) {
  const source = await readFile(path, "utf8");
  assert.doesNotMatch(
    source,
    /from ["']framer-motion["']/u,
    `${path} still imports framer-motion`,
  );
}

const hook = await readFile("src/lib/use-prefers-reduced-motion.ts", "utf8");
assert.match(hook, /useSyncExternalStore/u);
assert.match(hook, /prefers-reduced-motion: reduce/u);
assert.match(hook, /getServerSnapshot = \(\) => false/u);
