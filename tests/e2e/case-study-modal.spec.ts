import { test, expect } from "@playwright/test";

test.describe("Confidential case study modal", () => {
  test("TC-06: each lock button opens the modal with the correct interpolated title", async ({ page }) => {
    await page.goto("/");
    const buttons = page.locator(".case-study-lock-btn");
    const count = await buttons.count();
    expect(count).toBe(4);

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const expectedTitle = await btn.getAttribute("data-modal-title");
      await btn.click();
      await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-100/);
      await expect(page.locator("#modalCaseTitle")).toHaveText(expectedTitle!);
      await page.locator(".confidential-modal-close").first().click();
      await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-0/);
    }
  });

  test("TC-07: modal closes via close button, backdrop click, and Escape", async ({ page }) => {
    await page.goto("/");

    await page.locator(".case-study-lock-btn").first().click();
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-100/);
    await page.locator(".confidential-modal-close").first().click();
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-0/);

    // The backdrop spans the full viewport, but the dialog card sits on top of
    // its center, so a real click must land outside the card (near a corner)
    // to actually hit the backdrop rather than the card above it.
    await page.locator(".case-study-lock-btn").first().click();
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-100/);
    await page.locator("#confidentialModalBackdrop").click({ position: { x: 5, y: 5 } });
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-0/);

    await page.locator(".case-study-lock-btn").first().click();
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-100/);
    await page.keyboard.press("Escape");
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-0/);
  });

  test("TC-08: modal intro copy is in English, not the original Indonesian text", async ({ page }) => {
    await page.goto("/");
    await page.locator(".case-study-lock-btn").first().click();
    const modalText = await page.locator("#confidentialModal").textContent();
    expect(modalText).toContain("Bank Indonesia (BI) and OJK regulations");
    expect(modalText).not.toMatch(/kerahasiaan|kepatuhan|regulasi/i);
  });

  test("TC-09: schedule button closes the modal and scrolls to #contact", async ({ page }) => {
    await page.goto("/");
    await page.locator(".case-study-lock-btn").first().click();
    await page.locator(".confidential-modal-schedule").click();
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-0/);
    await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.1 });
  });
});
