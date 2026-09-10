import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("TC-17: zero critical/serious violations on page load", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrWorse = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? "")
    );
    expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
  });

  test("TC-45: zero critical/serious violations with the PUBLIC modal open", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-purpose="case-study-card"]', { hasText: "Iqro Land" }).locator(".case-study-lock-btn").click();
    await expect(page.locator("#publicModal")).toHaveClass(/opacity-100/);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(serious).toEqual([]);
  });

  test("TC-18: zero critical violations with the confidential modal open", async ({ page }) => {
    await page.goto("/");
    await page.locator(".case-study-lock-btn").first().click();
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-100/);

    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);

    await expect(page.locator("#confidentialModal")).toHaveAttribute("role", "dialog");
    await expect(page.locator("#confidentialModal")).toHaveAttribute("aria-modal", "true");
  });

  test("TC-19: every image has a non-empty alt attribute", async ({ page }) => {
    await page.goto("/");
    const missingAlt = await page.locator("img").evaluateAll((imgs) =>
      imgs.filter((img) => !img.getAttribute("alt")?.trim()).map((img) => img.getAttribute("src"))
    );
    expect(missingAlt).toEqual([]);
  });
});
