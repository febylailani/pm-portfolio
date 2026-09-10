import { test, expect } from "@playwright/test";

test.describe("Independent Build: Iqro Land (Batch 5)", () => {
  test("TC-36: the section renders with its heading, all 6 cards, and 5 screenshot placeholders", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#iqro-land");
    await expect(section.locator("h2")).toHaveText("Iqro Land");

    const cardLabels = [
      "Problem Statement",
      "Target User",
      "Product Scope",
      "Product Decisions",
      "Applied AI Workflow",
      "Current Result",
    ];
    for (const label of cardLabels) {
      await expect(section.getByText(label, { exact: true })).toBeVisible();
    }

    const screenshotCaptions = ["Iqro Land Homepage", "Hijaiyah Learning Module", "Tahfidz Playback Flow", "Reward / Achievement Screen", "Parent Dashboard / Progress View"];
    for (const caption of screenshotCaptions) {
      await expect(section.getByText(caption, { exact: true })).toBeVisible();
    }
    await expect(section.getByText("Screenshots coming soon", { exact: false })).toBeVisible();
  });

  test("TC-37: the 'Build notes coming soon' CTA is disabled, not a dead link", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator("#iqro-land").getByText("Build notes coming soon");
    await expect(cta).toBeVisible();
    const tagName = await cta.evaluate((el) => el.tagName);
    expect(tagName).not.toBe("A"); // must not be a clickable link to nowhere
  });

  test("TC-38: Iqro Land sits directly after Selected Product Work in page order", async ({ page }) => {
    await page.goto("/");
    const caseStudiesY = await page.locator("#case-studies").evaluate((el) => el.getBoundingClientRect().top);
    const iqroLandY = await page.locator("#iqro-land").evaluate((el) => el.getBoundingClientRect().top);
    const aboutY = await page.locator("#about").evaluate((el) => el.getBoundingClientRect().top);
    expect(iqroLandY).toBeGreaterThan(caseStudiesY);
    expect(aboutY).toBeGreaterThan(iqroLandY);
  });
});
