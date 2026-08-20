import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./qa/tests",
  outputDir: "./qa/test-results",
  fullyParallel: false,
  workers: 1,
  reporter: [["html", { outputFolder: "qa/reports", open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "node qa/serve-static.mjs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
