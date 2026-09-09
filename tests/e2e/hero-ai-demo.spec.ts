import { test, expect } from "@playwright/test";

test.describe("Hero conversational AI demo", () => {
  test("TC-04: each popular topic pill reveals its matching canned response", async ({ page }) => {
    await page.goto("/");
    const pills = page.locator(".ai-topic-btn");
    const count = await pills.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const pill = pills.nth(i);
      const topic = await pill.getAttribute("data-topic");
      await pill.click();
      await expect(page.locator("#ai-response-box")).toBeVisible();
      await expect(page.locator("#ai-prompt-input")).toHaveValue(topic!);
      const responseText = await page.locator("#ai-response-text").textContent();
      expect(responseText!.length).toBeGreaterThan(0);
    }
  });

  test("TC-05: free-text query reveals the interpolated fallback response", async ({ page }) => {
    await page.goto("/");
    await page.locator("#ai-prompt-input").fill("pricing strategy");
    await page.locator("#ai-prompt-submit").click();
    await expect(page.locator("#ai-response-box")).toBeVisible();
    await expect(page.locator("#ai-response-text")).toContainText("pricing strategy");
  });
});
