import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("TC-01: each header nav link scrolls to its matching section", async ({ page }) => {
    await page.goto("/");
    const links = [
      { label: "About", id: "about" },
      { label: "Case Studies", id: "case-studies" },
      { label: "Operating Principles", id: "principles" },
      { label: "Experience", id: "experience" },
      { label: "Contact", id: "contact" },
    ];

    for (const { label, id } of links) {
      await page.locator(`nav a:has-text("${label}")`).first().click();
      await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.1 });
    }
  });

  test("TC-02: header and hero CTAs target #contact", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-purpose="nav-cta"]')).toHaveAttribute("href", "#contact");
    await expect(page.getByRole("link", { name: /Schedule Call/ })).toHaveAttribute("href", "#contact");
  });

  test("TC-03: Explore Case Studies scrolls to #case-studies", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Explore Case Studies/ }).click();
    await expect(page.locator("#case-studies")).toBeInViewport({ ratio: 0.1 });
  });

  test("TC-15: footer nav links all resolve to an existing section id", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator('[data-purpose="footer-links"] a').evaluateAll((els) =>
      els.map((el) => el.getAttribute("href"))
    );
    for (const href of hrefs) {
      expect(href).toBeTruthy();
      const id = href!.replace("#", "");
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
});
