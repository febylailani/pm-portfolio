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

test.describe("Meeting CTAs", () => {
  test("TC-51: the topbar and contact booking links resolve to the very same invite", async ({ page }) => {
    await page.goto("/");

    const topbar = await page.locator('[data-purpose="nav-cta"]').getAttribute("href");
    const contact = await page.getByRole("link", { name: /Book ↗/ }).getAttribute("href");

    // Byte-identical, not merely "both point at Google Calendar". The two used to be
    // maintained separately and drifted: the topbar booked a pre-filled Google Calendar
    // event while the contact row still sent people to cal.com's own homepage.
    expect(contact).toBe(topbar);

    const url = new URL(topbar!);
    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toContain("Feby Lailani");
    expect(url.searchParams.get("add")).toBe("febylail.work@gmail.com");
  });

  test("TC-52: nothing on the page mentions Cal.com any more", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html.toLowerCase()).not.toContain("cal.com");

    // The row is still recognisably a booking channel, just not a vendor's.
    const row = page.locator("text=Book an Intro Call");
    await expect(row).toBeVisible();
    await expect(page.getByText("30-min intro or advisory chat")).toBeVisible();
  });
});
