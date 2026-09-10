import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test, expect } from "@playwright/test";

const TEMPLATE_DIRS = ["src/_includes/partials", "src/_includes/layouts"];

function templateFiles(): string[] {
  return TEMPLATE_DIRS.flatMap((dir) =>
    readdirSync(dir)
      .filter((f) => f.endsWith(".njk"))
      .map((f) => join(dir, f))
  );
}

test.describe("Asset paths", () => {
  // This suite exists because a broken asset path shipped: the Iqro Land modal image was
  // written as src="{{ ... }}" without the url filter. Production builds with
  // --pathprefix=/pm-portfolio/, so the deployed page asked for /assets/... instead of
  // /pm-portfolio/assets/... and got a 404 , while every local check passed, because the
  // local server has no prefix. The source-level test below is the one that catches this
  // class of bug WITHOUT having to deploy first.
  test("TC-47: every asset reference in a template goes through the url filter", () => {
    const offenders: string[] = [];

    for (const file of templateFiles()) {
      const src = readFileSync(file, "utf8");
      src.split("\n").forEach((line, i) => {
        // Any src= is an asset (image, script). href= is mostly anchors, mailto and
        // external links, so only literal /assets/ hrefs are asset references.
        const refs = [
          ...line.matchAll(/src="([^"]*)"/g),
          ...line.matchAll(/href="(\/assets\/[^"]*)"/g),
          ...line.matchAll(/href="(\{\{\s*'\/assets\/[^"]*)"/g),
        ];
        for (const m of refs) {
          const value = m[1];
          if (value.startsWith("mailto:") || /^https?:\/\//.test(value)) continue;
          if (value.includes("| url")) continue;
          offenders.push(`${file}:${i + 1}  ${m[0]}`);
        }
      });
    }

    expect(offenders, `asset references missing the \`| url\` filter:\n${offenders.join("\n")}`).toEqual([]);
  });

  test("TC-48: every image on the page actually decodes, including inside modals", async ({ page }) => {
    await page.goto("/");

    // Modal images are lazy and start hidden, so open every dialog before measuring ,
    // otherwise a broken one inside a modal stays invisible to this test.
    for (const btn of await page.locator(".case-study-lock-btn").all()) {
      await btn.click();
      await page.keyboard.press("Escape");
    }

    const broken = await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) =>
          img.complete ? Promise.resolve() : new Promise((r) => { img.addEventListener("load", r); img.addEventListener("error", r); })
        )
      );
      return imgs.filter((img) => !img.naturalWidth).map((img) => img.getAttribute("src"));
    });

    expect(broken, `images that did not decode: ${JSON.stringify(broken)}`).toEqual([]);
  });
});
