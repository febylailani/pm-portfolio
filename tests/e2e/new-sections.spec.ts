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

  test("TC-37: the 'View Iqro Land Build Notes' CTA scrolls to Learning in Public", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator("#iqro-land").getByRole("link", { name: /View Iqro Land Build Notes/ });
    await expect(cta).toHaveAttribute("href", "#learning-in-public");
    await cta.click();
    await expect(page.locator("#learning-in-public")).toBeInViewport({ ratio: 0.1 });
  });

  test("TC-38: Iqro Land sits directly after Selected Product Work in page order", async ({ page }) => {
    await page.goto("/");
    const caseStudiesY = await page.locator("#case-studies").evaluate((el) => el.getBoundingClientRect().top);
    const iqroLandY = await page.locator("#iqro-land").evaluate((el) => el.getBoundingClientRect().top);
    const learningY = await page.locator("#learning-in-public").evaluate((el) => el.getBoundingClientRect().top);
    expect(iqroLandY).toBeGreaterThan(caseStudiesY);
    expect(learningY).toBeGreaterThan(iqroLandY);
  });
});

test.describe("Learning in Public (Batch 6)", () => {
  test("TC-39: the section renders its heading, 3 content blocks, and 3 real article cards", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#learning-in-public");
    await expect(section.locator("h2")).toHaveText("Learning in Public");

    for (const label of ["LinkedIn Posts", "Visual Study Notes", "Career Switch Story"]) {
      await expect(section.getByText(label, { exact: true })).toBeVisible();
    }

    const articleTitles = [
      "Challenges in Arabic Letter Tracing with AI",
      "Local-First vs. Cloud: A Vibe-Coding Lesson",
      "Study Notes: Git for Vibe Coding",
    ];
    for (const title of articleTitles) {
      await expect(section.getByText(title, { exact: true })).toBeVisible();
    }
  });

  test("TC-40: each article card links out to the real LinkedIn URL in a new tab", async ({ page }) => {
    await page.goto("/");
    const links = page.locator("#learning-in-public").getByRole("link", { name: /Read on LinkedIn/ });
    await expect(links).toHaveCount(3);

    const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs).toContain("https://lnkd.in/p/gcPqdbXP");
    for (const href of hrefs) {
      expect(href).toMatch(/^https:\/\/(www\.)?(lnkd\.in|linkedin\.com)\//);
    }

    const targets = await links.evaluateAll((els) => els.map((el) => el.getAttribute("target")));
    expect(targets.every((t) => t === "_blank")).toBe(true);
  });
});
