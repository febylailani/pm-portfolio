import { test, expect } from "@playwright/test";

const widths = [375, 768, 1280];

test.describe("Responsive layout", () => {
  for (const width of widths) {
    test(`TC-20: no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1
      );
      expect(overflow).toBe(true);
    });
  }

  // The hero tagline is a small tilted note anchored to the top-right corner of the
  // illustration. It has no intrinsic width, so a longer caption simply grows leftward ,
  // which is how it once turned into a full-width banner across the artwork. These
  // assertions pin the shape, not the wording, so the next copy change gets caught here
  // instead of on the live site.
  for (const width of widths) {
    test(`TC-49: the hero tagline note stays a tucked corner note at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const note = page.locator('[data-purpose="hero-illustration"] .absolute').first();
      const m = await note.evaluate((el) => {
        const span = el.querySelector("span") as HTMLElement;
        const r = el.getBoundingClientRect();
        const wrap = (el.parentElement as HTMLElement).getBoundingClientRect();
        return {
          insideViewportLeft: r.left >= 0,
          insideViewportRight: r.right <= window.innerWidth + 1,
          shareOfCard: r.width / wrap.width,
          clipped: span.scrollWidth > span.clientWidth + 1 || span.scrollHeight > span.clientHeight + 1,
          hasHeart: (span.textContent || "").includes("\u2661"),
        };
      });

      expect(m.insideViewportLeft).toBe(true);
      expect(m.insideViewportRight).toBe(true);
      expect(m.clipped, "tagline text is being cut off by its own box").toBe(false);
      // A note wider than ~85% of the illustration card reads as a banner, not an annotation.
      expect(m.shareOfCard).toBeLessThan(0.85);
      expect(m.hasHeart, "the heart glyph at the end of the tagline went missing").toBe(true);
    });
  }
});
