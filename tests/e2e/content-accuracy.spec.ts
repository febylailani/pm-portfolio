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

test.describe("Operating Principles", () => {
  test("TC-53: the section carries exactly three lifecycle principles, in order", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#principles");

    // The heading says "3" and the grid is md:grid-cols-3, so a fourth card would both
    // contradict the heading and leave an orphan on a second row.
    const cards = section.locator(".grid > div");
    await expect(cards).toHaveCount(3);
    await expect(section.locator("h2")).toHaveText("3 Operating Principles");

    // The intro now traces the same arc the cards walk, and ends at the learning phase,
    // which is why the eyebrow no longer stops at "THINK & BUILD".
    const intro = await section.locator("p").first().innerText();
    expect(intro).toContain("focused product bets");
    expect(intro).toContain("learning from user behavior after launch");
    expect(intro).not.toContain("Frameworks honed in mission-critical environments");
    await expect(section.getByText("HOW I WORK, END TO END")).toBeVisible();

    const titles = ["I start before the backlog does", "I build alongside the team, not above it", "Launch is the middle, not the end"];
    for (let i = 0; i < titles.length; i++) {
      await expect(cards.nth(i).locator("h3")).toHaveText(titles[i]);
      await expect(cards.nth(i).getByText(`PRINCIPLE 0${i + 1}`)).toBeVisible();
    }
  });

  test("TC-54: each principle names the concrete work a recruiter would ask about", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator("#principles").innerText();

    // These are the claims Feby confirmed she can back with examples. If any is edited
    // away, this fails loudly rather than the section quietly drifting back to buzzwords.
    for (const claim of ["P&L projection", "customer conversations", "I ship code", "Figma", "AI agents", "go-to-market"]) {
      expect(text, `"${claim}" dropped out of Operating Principles`).toContain(claim);
    }
  });
});

test.describe("Iqro Land card placement and CTA", () => {
  test("TC-58: Iqro Land is the first card in Selected Product Work", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-purpose="case-study-card"]');
    await expect(cards).toHaveCount(5);
    await expect(cards.first().locator("h3")).toContainText("Iqro Land");
  });

  test("TC-59: only the public CTA is animated, and its label is black", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-purpose="case-study-card"]');

    const publicBtn = cards.first().locator(".case-study-lock-btn");
    await expect(publicBtn).toHaveClass(/public-story-cta/);
    // Black, not the previous emerald.
    expect(await publicBtn.evaluate((el) => getComputedStyle(el).color)).toBe("rgb(0, 0, 0)");
    expect(await publicBtn.evaluate((el) => getComputedStyle(el).animationName)).not.toBe("none");

    // The four NDA cards must stay still: an animated "Unlock Case Study" would beckon a
    // recruiter toward a gate they cannot open.
    const locked = page.locator('.case-study-lock-btn[data-modal-target="confidentialModal"]');
    await expect(locked).toHaveCount(4);
    for (const btn of await locked.all()) {
      await expect(btn).not.toHaveClass(/public-story-cta/);
      expect(await btn.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    }
  });

  test("TC-60: the CTA animation is disabled under prefers-reduced-motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    const btn = page.locator('[data-purpose="case-study-card"]').first().locator(".case-study-lock-btn");
    expect(await btn.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    expect(await btn.evaluate((el) => getComputedStyle(el, "::after").display)).toBe("none");
    // The pre-existing float was never gated either; it is covered by the same rule now.
    const float = page.locator(".animate-float").first();
    if (await float.count()) {
      expect(await float.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    }
    await context.close();
  });

  test("TC-61: the problem statement no longer repeats the child's age", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-purpose="case-study-card"]').first().locator(".case-study-lock-btn").click();
    const modal = page.locator("#publicModal");
    await expect(modal).toHaveClass(/opacity-100/);

    const text = await modal.innerText();
    expect(text).toContain("My son kept getting stuck");
    expect(text).not.toContain("My son (5)");
    // The age is still stated once, in Target User, so nothing was actually lost.
    expect(text).toContain("A 5-year-old learning hijaiyah");
test.describe("About & career timeline", () => {
  test("TC-55: the career illustration appears exactly once on the page", async ({ page }) => {
    await page.goto("/");
    // The whole point of the merge. It used to render twice — 540px inside About's right
    // column and again at 1180px as the Experience banner — roughly a third of the page
    // apart, at two different sizes.
    const banner = page.locator('img[src*="career-journey-banner"]');
    await expect(banner).toHaveCount(1);
    await expect(banner).toBeVisible();
    await expect(banner.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).resolves.toBe(true);
  });

  test("TC-56: the timeline lives inside About and keeps its #experience anchor", async ({ page }) => {
    await page.goto("/");

    // One section now, not two.
    await expect(page.locator('[data-purpose="experience-timeline"]')).toHaveCount(0);
    await expect(page.locator("#about")).toHaveCount(1);

    // #experience survives as a sub-anchor: header, footer and mobile nav all link to it,
    // and TC-15 requires every footer href to resolve.
    const anchor = page.locator("#experience");
    await expect(anchor).toHaveCount(1);
    expect(await anchor.evaluate((el) => !!el.closest("#about"))).toBe(true);

    // Both roles survived the move.
    await expect(anchor.getByText("Product Manager", { exact: false }).first()).toBeVisible();
    await expect(anchor.getByText("Wireline Field Engineer").first()).toBeVisible();
  });

  test("TC-57: the illustration sits above the timeline, with the stat chips under it", async ({ page }) => {
    await page.goto("/");
    const y = async (sel: string) => (await page.locator(sel).first().evaluate((el) => el.getBoundingClientRect().top + window.scrollY));

    const bannerY = await y('img[src*="career-journey-banner"]');
    const chipsY = await y("text=Extreme Rigor");
    const timelineY = await y("#experience");

    expect(bannerY).toBeLessThan(chipsY);
    expect(chipsY).toBeLessThan(timelineY);
  });
});
