import { test, expect } from "@playwright/test";

test.describe("Content accuracy", () => {
  test("TC-46: the About closing line points toward where Iqro Land actually is", async ({ page }) => {
    await page.goto("/");

    const about = page.locator("#about");
    const closing = (await about.innerText()).replace(/\s+/g, " ");
    expect(closing).toContain("starting with Iqro Land above");
    // The original copy said "below", but About sits BELOW Selected Product Work, so the
    // signpost pointed away from the thing it was introducing.
    expect(closing).not.toContain("starting with Iqro Land below");

    // Assert the direction against the real layout rather than trusting the word, so this
    // fails again if Iqro Land is ever moved instead of silently going stale. Matching on
    // the name rather than a section id keeps it valid whether Iqro Land is its own
    // section or a card inside Selected Product Work.
    const firstMention = page.getByText(/Iqro Land/).first();
    const mentionY = await firstMention.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const aboutY = await about.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    expect(mentionY).toBeLessThan(aboutY);
  });
});
