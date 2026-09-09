import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 1,
  timeout: 30_000,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:8181",
    trace: "on-first-retry",
    permissions: ["clipboard-read", "clipboard-write"],
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
