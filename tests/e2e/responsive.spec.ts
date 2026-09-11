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

  // Two complaints from review, pinned as numbers so they cannot quietly come back:
  // the note was landing ON TOP of the artwork (it overlapped its top edge by 16-20px),
  // and it sat only 6-7px from the card's own outline. The artwork's content box is a
  // known crop of the 900x600 source, so the gap can be measured against the drawing
  // itself rather than the image element, which carries baked-in whitespace.
  const ART = { top: 62, bottom: 518, height: 600 };

  for (const width of widths) {
    test(`TC-50: the tagline note clears the artwork and the card outline at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/");

      const m = await page.evaluate((ART) => {
        const root = document.querySelector('[data-purpose="hero-illustration"]') as HTMLElement;
        const note = root.querySelector(".absolute") as HTMLElement;
        const card = root.querySelector(".bg-brand-light") as HTMLElement;
        const img = card.querySelector("img") as HTMLImageElement;
        const n = note.getBoundingClientRect(), k = card.getBoundingClientRect(), i = img.getBoundingClientRect();
        const scale = i.height / ART.height;
        return {
          gapNoteToArtwork: i.top + ART.top * scale - n.bottom,
          gapNoteToCardRight: k.right - n.right,
          artworkBottomToCardBottom: k.bottom - (i.top + ART.bottom * scale),
        };
      }, ART);

      expect(m.gapNoteToArtwork, "the note is sitting on top of the illustration again").toBeGreaterThanOrEqual(12);
      expect(m.gapNoteToCardRight, "the note is crowding the card outline again").toBeGreaterThanOrEqual(14);
      // Guards the other direction: pushing the artwork down must not bury it in the border.
      expect(m.artworkBottomToCardBottom, "the artwork is now jammed against the card's bottom edge").toBeGreaterThanOrEqual(8);
    });
  }
});
