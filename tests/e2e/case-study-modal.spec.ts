import { test, expect } from "@playwright/test";

test.describe("Confidential case study modal", () => {
  // These target a GATED card explicitly rather than .first(). Iqro Land is now the first
  // card in the grid and it is public, so .first() opens #publicModal and every assertion
  // about the confidential dialog silently tests the wrong thing.
  test("TC-06: each lock button opens the modal with the correct interpolated title", async ({ page }) => {
    await page.goto("/");
    const buttons = page.locator('.case-study-lock-btn[data-modal-target="confidentialModal"]');
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

    await page.locator('.case-study-lock-btn[data-modal-target="confidentialModal"]').first().click();
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-100/);
    await page.locator(".confidential-modal-close").first().click();
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-0/);

    // The backdrop spans the full viewport, but the dialog card sits on top of
    // its center, so a real click must land outside the card (near a corner)
    // to actually hit the backdrop rather than the card above it.
    await page.locator('.case-study-lock-btn[data-modal-target="confidentialModal"]').first().click();
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-100/);
    await page.locator("#confidentialModalBackdrop").click({ position: { x: 5, y: 5 } });
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-0/);

    await page.locator('.case-study-lock-btn[data-modal-target="confidentialModal"]').first().click();
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-100/);
    await page.keyboard.press("Escape");
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-0/);
  });

  test("TC-08: modal intro copy is in English, not the original Indonesian text", async ({ page }) => {
    await page.goto("/");
    await page.locator('.case-study-lock-btn[data-modal-target="confidentialModal"]').first().click();
    const modalText = await page.locator("#confidentialModal").textContent();
    expect(modalText).toContain("Bank Indonesia (BI) and OJK regulations");
    expect(modalText).not.toMatch(/kerahasiaan|kepatuhan|regulasi/i);
  });

  test("TC-09: the modal CTA is a mailto: request naming the case study that was unlocked", async ({ page }) => {
    await page.goto("/");
    const buttons = page.locator('.case-study-lock-btn[data-modal-target="confidentialModal"]');
    const count = await buttons.count();
    expect(count).toBe(4);

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const title = (await btn.getAttribute("data-modal-title"))!;
      await btn.click();

      const href = (await page.locator(".confidential-modal-schedule").getAttribute("href"))!;
      expect(href.startsWith("mailto:febylail.work@gmail.com?")).toBe(true);

      const params = new URLSearchParams(new URL(href).search);
      // Each card must name ITS OWN case study , not a generic "one of your case studies",
      // otherwise Feby cannot tell which dossier was requested.
      expect(params.get("subject")).toBe(`Case study request: ${title}`);
      expect(params.get("body")).toContain(title);

      await page.locator(".confidential-modal-close").first().click();
      await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-0/);
    }
  });

  test("TC-43: the modal CTA is already a usable mailto: before any JavaScript runs", async ({ browser }) => {
    // The href is rendered by the template, not only patched in by openConfidentialModal(),
    // so a visitor with JS blocked still gets a pre-filled request rather than a dead button.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    const href = (await page.locator(".confidential-modal-schedule").getAttribute("href"))!;
    expect(href.startsWith("mailto:febylail.work@gmail.com?")).toBe(true);
    const params = new URLSearchParams(new URL(href).search);
    expect(params.get("subject")).toBe("Case study request: Confidential Case Study Dossier");
    expect(params.get("body")).toContain("Confidential Case Study Dossier");

    await context.close();
  });
});
