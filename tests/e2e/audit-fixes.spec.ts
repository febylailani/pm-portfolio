import { test, expect } from "@playwright/test";

test.describe("UX audit — Important fixes (P-01 … P-09)", () => {
  test("TC-24: modal badges no longer overlap the close button at mobile width (P-01)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.locator(".case-study-lock-btn").first().click();

    const badge = page.locator("#confidentialModal").getByText("Production Architecture");
    const closeBtn = page.locator(".confidential-modal-close").first();
    const badgeBox = await badge.boundingBox();
    const closeBox = await closeBtn.boundingBox();

    expect(badgeBox).not.toBeNull();
    expect(closeBox).not.toBeNull();
    expect(badgeBox!.x + badgeBox!.width).toBeLessThanOrEqual(closeBox!.x);
  });

  test("TC-25: the page has exactly one <h1> (P-02)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("TC-26: the confidential modal is inert while closed and interactive while open (P-03)", async ({ page }) => {
    await page.goto("/");
    const modal = page.locator("#confidentialModal");

    await expect(async () => {
      const inert = await modal.evaluate((el) => (el as HTMLElement & { inert: boolean }).inert);
      expect(inert).toBe(true);
    }).toPass();

    await page.locator(".case-study-lock-btn").first().click();
    await expect(async () => {
      const inert = await modal.evaluate((el) => (el as HTMLElement & { inert: boolean }).inert);
      expect(inert).toBe(false);
    }).toPass();

    await page.locator(".confidential-modal-close").first().click();
    await expect(async () => {
      const inert = await modal.evaluate((el) => (el as HTMLElement & { inert: boolean }).inert);
      expect(inert).toBe(true);
    }).toPass();
  });

  test("TC-27: the hero AI-demo input shows a visible focus ring (P-04)", async ({ page }) => {
    await page.goto("/");
    await page.locator("#ai-prompt-input").focus();
    const boxShadow = await page.locator("#ai-prompt-input").evaluate((el) => getComputedStyle(el).boxShadow);
    expect(boxShadow).not.toBe("none");
    expect(boxShadow).toMatch(/37, 99, 235/); // brand-blue ring color
  });

  test("TC-28: anchor-scroll CTAs use a down arrow, not the external-link arrow (P-06)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-purpose="nav-cta"]')).toHaveText("Book Intro ↓");
    await expect(page.getByRole("link", { name: /Schedule Call/ })).toHaveText("Schedule Call ↓");

    await page.locator(".case-study-lock-btn").first().click();
    await expect(page.locator(".confidential-modal-schedule")).toHaveText("Schedule 30-min Interview Call ↓");

    // the genuinely external Cal.com link keeps its correct ↗
    await expect(page.getByRole("link", { name: /Open ↗/ })).toHaveAttribute("target", "_blank");
  });

  test("TC-29: meta description and Open Graph tags are present (P-07)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\//);
  });

  test("TC-30: dynamic response regions announce via aria-live (P-08)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#ai-response-box")).toHaveAttribute("aria-live", "polite");
    await expect(page.locator("#form-success-banner")).toHaveAttribute("aria-live", "polite");
  });

  test("TC-31: the two previously-failing color pairs now clear 4.5:1 contrast (P-09)", async ({ page }) => {
    await page.goto("/");
    const statChipColor = await page.evaluate(() => {
      const p = Array.from(document.querySelectorAll("p")).find((el) => el.textContent?.trim() === "Extreme Rigor");
      return p ? getComputedStyle(p).color : null;
    });
    expect(statChipColor).toBe("rgb(71, 85, 105)"); // slate-600

    await page.locator(".case-study-lock-btn").first().click();
    const badgeColor = await page.evaluate(() => {
      const span = Array.from(document.querySelectorAll("span")).find((el) => el.textContent?.trim() === "Production Architecture");
      return span ? getComputedStyle(span).color : null;
    });
    expect(badgeColor).toBe("rgb(29, 78, 216)"); // blue-700
  });

  test("TC-32: mobile tap targets meet the 44px minimum (P-05)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const selectors = [
      '[data-purpose="footer-links"] a >> nth=0',
      'footer a[aria-label="LinkedIn"]',
      ".ai-topic-btn >> nth=0",
    ];
    for (const selector of selectors) {
      const box = await page.locator(selector).boundingBox();
      expect(box, selector).not.toBeNull();
      expect(box!.height, selector).toBeGreaterThanOrEqual(44);
    }

    await page.locator("#contact").scrollIntoViewIfNeeded();
    const copyBox = await page.locator(".contact-copy-btn").boundingBox();
    expect(copyBox!.height).toBeGreaterThanOrEqual(44);
    const topicBox = await page.locator(".topic-btn").first().boundingBox();
    expect(topicBox!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("UX audit — Nice-to-have fixes (N-01, N-03, N-05)", () => {
  test("TC-33: 'Skills, Stack & Explorations' and 'Academic Foundations' headings match the 36px section-heading scale (N-01)", async ({ page }) => {
    await page.goto("/");
    const sizes = await page.evaluate(() => {
      const find = (text: string) =>
        Array.from(document.querySelectorAll("h2")).find((h) => h.textContent?.trim() === text);
      return {
        toolbox: find("Skills, Stack & Explorations") ? getComputedStyle(find("Skills, Stack & Explorations")!).fontSize : null,
        education: find("Academic Foundations") ? getComputedStyle(find("Academic Foundations")!).fontSize : null,
      };
    });
    expect(sizes.toolbox).toBe("36px");
    expect(sizes.education).toBe("36px");
  });

  test("TC-34: 'Skip to main content' is the first focusable element and targets #main-content (N-03)", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => ({
      text: document.activeElement?.textContent?.trim(),
      href: document.activeElement?.getAttribute("href"),
    }));
    expect(focused.text).toBe("Skip to main content");
    expect(focused.href).toBe("#main-content");
    await expect(page.locator("#main-content")).toHaveCount(1);
  });

  test("TC-35: the AI-demo response box discloses that responses are curated, not live (N-05)", async ({ page }) => {
    await page.goto("/");
    await page.locator(".ai-topic-btn").first().click();
    await expect(page.locator("#ai-response-box")).toContainText("curated preview, not a live model");
  });
});
