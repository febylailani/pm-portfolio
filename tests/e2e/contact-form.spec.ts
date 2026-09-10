import { test, expect } from "@playwright/test";

test.describe("Contact and dispatch form", () => {
  test("TC-10: topic buttons toggle active styling exclusively", async ({ page }) => {
    await page.goto("/");
    const topicButtons = page.locator(".topic-btn");
    const count = await topicButtons.count();

    for (let i = 0; i < count; i++) {
      await topicButtons.nth(i).click();
      const activeButtons = page.locator(".topic-btn.bg-brand-navy.text-white");
      await expect(activeButtons).toHaveCount(1);
      await expect(activeButtons).toHaveText(await topicButtons.nth(i).textContent() ?? "");
    }
  });

  test("TC-11: valid submit shows the success banner and resets the form", async ({ page }) => {
    await page.goto("/");
    await page.fill("#user-name", "Alex Recruiter");
    await page.fill("#user-email", "alex@example.com");
    await page.fill("#user-msg", "Exploring a senior PM opening.");
    await page.click('#contact-dispatch-form button[type="submit"]');

    await expect(page.locator("#form-success-banner")).toBeVisible();
    await expect(page.locator("#user-name")).toHaveValue("");
  });

  test("TC-12: empty required fields block native submission", async ({ page }) => {
    await page.goto("/");
    await page.click('#contact-dispatch-form button[type="submit"]');
    await expect(page.locator("#form-success-banner")).toBeHidden();

    const nameValidity = await page.locator("#user-name").evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(nameValidity).toBe(false);
  });

  test("TC-13: copy button writes the email address to the clipboard and shows an inline toast (N-02)", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    let dialogFired = false;
    page.once("dialog", (dialog) => {
      dialogFired = true;
      dialog.accept();
    });

    await page.locator(".contact-copy-btn").click();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe("febylailani@gmail.com");

    await expect(page.locator(".copy-toast")).toBeVisible();
    await expect(page.locator(".copy-toast")).toHaveText("Copied ✓");
    expect(dialogFired).toBe(false); // no native alert() blocking the page
  });

  test("TC-23: contact channel values are not truncated at mobile width (K-02 fix)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const values = page.locator('[data-purpose="contact-cta"] .font-bold.text-brand-navy.break-words');
    const count = await values.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const el = values.nth(i);
      const isTruncated = await el.evaluate((node) => node.scrollWidth > node.clientWidth);
      expect(isTruncated).toBe(false);
    }
    await expect(page.locator("text=febylailani@gmail.com")).toBeVisible();
  });
});
