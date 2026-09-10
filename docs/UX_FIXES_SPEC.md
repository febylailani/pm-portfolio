# UX Audit Fixes — Implementation Spec

Companion to `UX_AUDIT.md` (findings/evidence) and `TASKS.md` (checklist). This pins down the exact implementation decision for every fix where the audit's recommendation left more than one reasonable execution — so the checklist in `TASKS.md` can be worked through without re-litigating design choices mid-implementation.

## Decisions

**P-06 (CTA copy over-promising) — icon fix only, not a copy rewrite.**
The evidenced defect is specifically the `↗` icon (which the page's own convention — e.g. "Open ↗" on the real Cal.com link — uses to mean "leaves the site") appearing on three CTAs that are actually in-page anchor scrolls. The fix is to swap `↗` → `↓` on those three ("Book Intro", "Schedule Call", "Schedule 30-min Interview Call"), matching the already-correct "Explore Case Studies ↓" convention elsewhere on the same page. The verb choice ("Book"/"Schedule") is a brand-voice decision that belongs to Feby, not something to rewrite as a bug fix — left as-is.

**P-07 (meta description / OG tags) — sourced from existing approved copy, not new writing.**
`<meta name="description">` and `og:description` reuse `hero.bio` from `hero.json` (already-approved copy), truncated to a clean sentence if needed. `og:title` uses `site.pageTitle`. `og:image` points at the existing hero illustration — no new asset needed.

**P-05 (tap targets) — 44px minimum height, mobile only.**
Applies only below the `sm`/`md` breakpoints already used elsewhere in each component; desktop sizing is untouched. Elements in scope: footer nav links, footer social icons, the email "Copy" button, AI-demo topic pills, contact-form topic pills, and the modal close button.

**N-01 (heading scale) — standardize to 36px.**
No evidence was found that the smaller size on "Skills, Stack & Explorations" / "Academic Foundations" was intentional (no corresponding content or hierarchy reason). Standardized to match every other section `<h2>`.

**N-05 (AI-demo disclosure) — use the exact caption proposed in the audit.**
"(curated preview, not a live model)" — small, non-alarming, placed under the response box.

## Out of scope for this pass

**N-04 (second illustration) — not executable in this session.**
Commissioning a new illustration requires actual artwork matching Feby's existing style; there's no image-generation capability available here. Left in the backlog exactly as tracked in `TASKS.md` / `PRD.md`'s Phase 2 list. No placeholder or AI-generated substitute was created for it, to avoid introducing a style mismatch.

## Execution grouping

Shipped as three PRs, matching the audit's severity tiers, each independently tested and deployed before the next starts:
1. Critical — K-01, K-02
2. Important — P-01 … P-09
3. Nice-to-have — N-01, N-02, N-03, N-05 (N-04 excluded, see above)
