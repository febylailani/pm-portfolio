import { test, expect } from "@playwright/test";

const widths = [375, 768, 1280];

test.describe("Responsive layout", () => {
  for (const width of widths) {
    test(`TC-20: no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1
      );
      expect(overflow).toBe(true);
    });
  }
});
