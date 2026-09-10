import { test, expect } from "@playwright/test";

test.describe("Iqro Land as a public case study card", () => {
  test("TC-36: the card is marked open, and its modal carries the migrated section content", async ({ page }) => {
    await page.goto("/");

    // The standalone #iqro-land section was retired; its content now lives in the modal
    // behind the public card, so the section itself must be gone.
    await expect(page.locator("#iqro-land")).toHaveCount(0);

    const card = page.locator('[data-purpose="case-study-card"]', { hasText: "Iqro Land" });
    await expect(card).toHaveCount(1);
    await expect(card.getByText("Open project", { exact: true })).toBeVisible();

    const openBtn = card.locator(".case-study-lock-btn");
    await expect(openBtn).toHaveText("📖 Read the Full Story");
    await expect(openBtn).toHaveAttribute("data-modal-target", "publicModal");
    await openBtn.click();

    const modal = page.locator("#publicModal");
    await expect(modal).toHaveClass(/opacity-100/);
    // The gated dialog must stay shut , a public card that opened the NDA modal would
    // be exactly the wrong story.
    await expect(page.locator("#confidentialModal")).toHaveClass(/opacity-0/);

    for (const label of [
      "Problem Statement",
      "Target User",
      "Product Scope",
      "Product Decisions",
      "Applied AI Workflow",
      "Current Result",
    ]) {
      await expect(modal.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("TC-37: the modal CTA scrolls to Learning in Public and closes the dialog", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-purpose="case-study-card"]', { hasText: "Iqro Land" }).locator(".case-study-lock-btn").click();

    const cta = page.locator(".public-modal-cta");
    await expect(cta).toHaveAttribute("href", "#learning-in-public");
    await cta.click();
    await expect(page.locator("#publicModal")).toHaveClass(/opacity-0/);
    await expect(page.locator("#learning-in-public")).toBeInViewport({ ratio: 0.1 });
  });

  test("TC-38: the visual is labelled a concept visualization, not a product screenshot", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-purpose="case-study-card"]', { hasText: "Iqro Land" }).locator(".case-study-lock-btn").click();

    const figure = page.locator("#publicModal figure");
    const caption = (await figure.locator("figcaption").textContent())!;
    expect(caption).toContain("Concept visualization");
    expect(caption).toContain("not a screenshot of the running pre-alpha");
    // Guards against anyone later relabelling a mockup as a real capture.
    expect(caption).not.toMatch(/^Homepage screenshot/i);

    const img = figure.locator("img");
    // Match the FILENAME, not the whole path. The old exact-path assertion passed locally
    // (served at root) while the deployed page 404'd, because production builds with
    // --pathprefix=/pm-portfolio/ and the src has to carry that prefix.
    expect(await img.getAttribute("src")).toMatch(/\/assets\/images\/iqroland-showcase-1\.webp$/);
    await expect(img).toHaveAttribute("loading", "lazy");
    expect(await img.getAttribute("alt")).toContain("Concept visualization");

    // The assertion that would actually have caught the broken path: a 404 still has a
    // src attribute, but it never decodes.
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth), { timeout: 10000 })
      .toBeGreaterThan(0);
  });

  test("TC-44: 'Pre-Alpha' is the status wording everywhere, and 'beta' appears nowhere", async ({ page }) => {
    await page.goto("/");
    const card = page.locator('[data-purpose="case-study-card"]', { hasText: "Iqro Land" });
    await expect(card.getByText("Pre-Alpha, Real User", { exact: true })).toBeVisible();

    await card.locator(".case-study-lock-btn").click();
    const modal = page.locator("#publicModal");
    await expect(modal.getByText("Pre-Alpha", { exact: true })).toBeVisible();

    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText).not.toContain("beta");
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
