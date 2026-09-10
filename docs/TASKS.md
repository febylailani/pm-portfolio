# Tasks

## Phase 1 — MVP build (this release, v0.1.0)

**Scaffold**
- [x] Initialize npm project; add Eleventy, Playwright, html-validate, linkinator, eslint as dev dependencies
- [x] Configure `.eleventy.js` (input/output dirs, passthrough copy for assets, `pathPrefix` support, `mdInline` filter)
- [x] Create the `src/` directory skeleton (`_data`, `_includes/layouts`, `_includes/partials`, `assets`)
- [x] Extend `.gitignore` for `node_modules/`, `_site/`, `.cache/`, test artifacts; add `.nvmrc`

**Content data**
- [x] Author all 12 `src/_data/*.json` files (site, hero, aiDemo, metrics, caseStudies, confidentialModal, about, principles, toolbox, experience, education, contact)
- [x] Translate the confidential-modal intro paragraph from Indonesian to English

**Templates**
- [x] Build `layouts/base.njk` (Tailwind CDN + config, fonts, favicons, custom styles)
- [x] Build one partial per page section, matching the original design's BEGIN/END comments
- [x] Build the shared icon macro (`partials/icons.njk`) for data-driven metric/case-study/experience/education icons
- [x] Assemble `src/index.njk`
- [x] Port interactive JavaScript into `src/assets/js/main.js`, wired to `aiDemo.json` via `window.__mockResponses`

**Assets**
- [x] Add the 3 illustration assets (hero, career-journey banner reused in About + Experience, avatar) to `src/assets/images/`; resize for web delivery
- [x] Generate the favicon set (16×16, 32×32, apple-touch-icon) from the avatar illustration
- [x] Replace the header/footer "FL" initials avatar with the portrait illustration

**Quality & testing**
- [x] Fix HTML validity issues (void-element style, boolean attributes, unique landmark names)
- [x] Fix a WCAG AA color-contrast failure on case-study tag chips and the "past role" date pill
- [x] Add `aria-labelledby` to the confidential modal for an accessible name
- [x] Write the Playwright + axe-core test suite (20 test cases, see `TEST_CASES.md`)
- [x] Verify `npm test` passes end-to-end locally

**CI/CD**
- [x] Write `.github/workflows/ci.yml` (lint, build, validate, link-check, e2e tests on every PR)
- [x] Write `.github/workflows/deploy.yml` (build with `pathPrefix` + deploy to GitHub Pages on push to `main`)
- [x] One-time manual setup (repo owner): enable **Settings → Pages → Source: GitHub Actions**
- [ ] One-time manual setup (repo owner): enable branch protection on `main` requiring the `CI` check (blocked on repo-admin permissions during initial setup — still pending)

**Docs**
- [x] `docs/PRD.md`, `docs/TASKS.md`, `docs/TEST_CASES.md`
- [x] Rewrite `README.md` with setup/build/preview/deploy instructions and a "How to edit content" section
- [x] Seed `CHANGELOG.md`

**Launch**
- [x] Merge `feature/eleventy-portfolio-mvp` to `main` via pull request
- [x] Verify the live GitHub Pages deploy matches the approved mockup
- [x] Tag `v0.1.0` and cut a GitHub Release from the `CHANGELOG.md` entry

## Phase 1.1 — UX Audit Fixes

Fix plan derived from `docs/UX_AUDIT.md` (audited 2026-09-10 against live `v0.1.0`). Each task references its finding ID for traceability back to the audit's evidence and rationale. Ordered by severity; within Critical/Important, roughly in the order a single engineer would tackle them (structural/global fixes before isolated polish).

**Critical — do first**
- [x] **[K-01]** Add a mobile/tablet nav: a hamburger button below the `lg` breakpoint that opens a drawer/panel with the same links as the desktop nav (About/Case Studies/Operating Principles/Experience/Contact) plus the "Book Intro" CTA. Needs `aria-expanded` on the toggle and Escape-to-close.
- [x] **[K-02]** Stop truncating the contact channel rows (Direct Email / Cal.com / Location) on mobile — stack label, value, and action button vertically below a breakpoint instead of sharing one row, or drop `truncate` in favor of wrapping.

**Important**
- [x] **[P-01]** Fix the confidential-modal badge/close-button overlap on mobile — wrap badges onto their own line, or reserve clear space so `#confidentialModal .badges` never sits under the × button below ~400px.
- [x] **[P-02]** Demote the header brand name from `<h1>` to a non-heading element (`<p>`/`<span>`) in `partials/header.njk`, so the hero headline is the page's only `<h1>`.
- [x] **[P-03]** Make the confidential modal inert while closed: toggle `inert` (or `aria-hidden="true"` + `tabindex="-1"` on its focusable children) in `main.js`'s `openConfidentialModal`/`closeConfidentialModal`.
- [x] **[P-04]** Give `#ai-prompt-input` a visible `focus-visible` ring (e.g. `focus-visible:ring-2 focus-visible:ring-brand-blue`) in `partials/hero.njk`.
- [x] **[P-05]** Audit tap targets at the 375px breakpoint and bump padding until footer nav links, footer social icons, the email "Copy" button, AI-demo topic pills, and contact-form topic pills are all ≥44×44px, without changing desktop sizing.
- [x] **[P-06]** Relabel the "Book Intro ↗" / "Schedule Call ↗" / "Schedule 30-min Interview Call ↗" CTAs to describe what actually happens (an in-page scroll to the contact form), and remove the ↗ icon from all three — reserve ↗ for links with `target="_blank"` only (matches the Cal.com link's existing correct usage).
- [x] **[P-07]** Add `<meta name="description">` and `og:title` / `og:description` / `og:image` tags to `layouts/base.njk`, sourced from `site.json`/`hero.json` content and the hero illustration.
- [x] **[P-08]** Add `aria-live="polite"` to `#ai-response-box` and `#form-success-banner`.
- [x] **[P-09]** Darken the text color on the About-section stat-chip captions and the modal's "Production Architecture" badge (e.g. to `slate-600`/`blue-700`) to clear the 4.5:1 contrast threshold — same pattern as the earlier case-study tag-chip fix.

**Nice-to-have**
- [x] **[N-01]** Bump the `<h2>` size for "Skills, Stack & Explorations" and "Academic Foundations" to match the other section headings (36px at `sm`+), or explicitly document why they're intentionally smaller.
- [x] **[N-02]** Replace the `window.alert()` copy-confirmation in `main.js` with an inline toast/tooltip matching the `#form-success-banner` visual pattern.
- [x] **[N-03]** Add a visually-hidden "Skip to main content" link at the top of `base.njk`, targeting `<main>`.
- [ ] **[N-04]** Commission a second illustration so About and Experience no longer reuse the identical career-journey banner (tracked here and in the Phase 2 backlog below). **Not executable in an AI coding session — needs real artwork from Feby/a designer; see `docs/UX_FIXES_SPEC.md`.**
- [x] **[N-05]** Add a small caption under the hero AI-demo response box disclosing it's a curated preview, not a live model.

**Verification**
- [x] Re-run `npm test` (build + html-validate + linkinator + Playwright/axe) after each batch of fixes
- [x] Manually re-check K-01/K-02/P-01/P-05 at 375px and 768px after fixing
- [x] Re-run an axe-core pass to confirm P-03/P-04/P-08 close their respective violations
- [x] Update `docs/UX_AUDIT.md` findings to note which are resolved (all 15 fixable findings shipped; N-04 remains open pending a real illustration asset)

## Phase 1.2 — Copy & Positioning Overhaul

Full content specification: `docs/COPY_POSITIONING_AUDIT.md`. Goal: reposition from "Senior Product Manager (Fintech & AI)" to "Product Manager · Consumer & Enterprise Products · Applied AI", so the site reads accurately against Feby's actual CV/title history and supports non-fintech PM applications (e.g. respond.io-style roles), while staying warm and specific rather than hyperbolic. This is a content-and-structure change only — no new architecture is needed, since every section is already a `src/_data/*.json` file; the two new sections follow the existing partial + data-file pattern.

Not started (implementation-wise). All blocking questions are now answered — ready to execute. Batched into shippable PRs, in recommended order — earlier batches carry the highest-visibility positioning fixes (the acceptance criteria in `COPY_POSITIONING_AUDIT.md` are mostly satisfied by Batch 1 alone).

**⚠️ Needed Feby's input before shipping — all 4 answered 2026-09-10:**
- [x] ~~Confirm the exact "Experience" date-range wording~~ — `2021 – Jul 2026`. Feby left Hijra Group in July 2026 and has since been focused on upskilling (automation, hands-on software development with AI), starting with the Iqro Land project. This "now" phase is told through the new Independent Build section and an added About closing sentence — not a third formal Experience entry. See `COPY_POSITIONING_AUDIT.md`'s Experience-date row and the enriched Iqro Land section copy for the full story (including the authentic origin: her 5-year-old son getting stuck on hijaiyah letters and needing extra tahfidz repetition, with screen time parent-guided).
- [x] ~~Provide the real LinkedIn profile URL~~ — `https://www.linkedin.com/in/febylailani`.
- [x] ~~Confirm Iqro Land screenshot readiness~~ — **ship with placeholders.** Feby wants to see the section's layout live before providing real screenshots; use clearly-labeled placeholder cards ("Screenshot coming soon"), not fabricated fake app UI.
- [x] ~~Confirm Learning in Public article links~~ — **3 real LinkedIn posts provided and read directly** (not invented): "Challenges in Arabic Letter Tracing with AI", "Local-First vs. Cloud: A Vibe-Coding Lesson", "Study Notes: Git for Vibe Coding". Full titles/descriptions/URLs in `COPY_POSITIONING_AUDIT.md`'s New Section 2.

**Batch 1 — Core positioning (title, meta, nav/footer, hero, AI-demo copy)** ✅ Shipped
- [x] Update `site.json`: `pageTitle` (shortened to 46 chars — the audit's exact suggestion tripped html-validate's 70-char `long-title` rule; full positioning stays in `metaDescription`), `metaDescription`, navbar tagline (`brandTagline`, short) + new `footerTagline` field (full positioning) since navbar/footer need different lengths, `og:*`/`twitter:*` (already derived from the above, no template change needed)
- [x] Update `hero.json`: badge, H1, bio, `primaryCta`/`secondaryCta` labels (`Explore Selected Work ↓` / `Contact Me ↓`), illustration tag annotations
- [x] Update `aiDemo.json`: input placeholder, "Fintech Growth" → "Lifecycle Growth", "Prompt & Model Evals" → "AI Workflow Evaluation"; also caught and fixed two hyperbolic phrases the audit's Copy Principles explicitly ban ("frontier products" in `fallbackResponse`, "wheelhouse" in `freeTextResponseTemplate`) that weren't in the literal before/after table but violated the stated principles
- [x] Update tests that hardcoded old copy strings (`tests/e2e/nav.spec.ts` TC-02/TC-03, `tests/e2e/audit-fixes.spec.ts` TC-28); `hero-ai-demo.spec.ts` TC-04/TC-05 needed no changes — they assert dynamically against whatever topics render, not hardcoded labels
- [x] `npm test` passes (35/35); visually verified hero + footer render correctly

**Batch 2 — Metrics & Selected Product Work (case studies)** ✅ Shipped
- [x] Update `metrics.json`: card 1 (`Product Management`), card 2 (`Limited Release` / `In-house NLP Banking Assistant`), card 3 subtitle simplified to `Core Banking Migration`; card 4 unchanged
- [x] Update `case-studies.njk`'s hardcoded eyebrow/title/status text (`SELECTED PRODUCT WORK`, `Selected Product Work`, `Some details are confidential 🔐`); `confidentialModal.json`'s `unlockButtonLabel` → `🔐 Unlock Case Study`; all 4 `caseStudies.json` cards (MISHA rename + `modalTitle` to match, H2H body + tags, core-banking body, KYC body) — also tightened 2 tags ("Zero Downtime" → "Zero Customer Complaints", "< 5 Min Instant Onboarding" → "~5 Min Onboarding") to stay consistent with the revised, less-absolute body copy
- [x] `tests/e2e/case-study-modal.spec.ts` TC-06 needed no changes — it asserts dynamically against each card's `data-modal-title` attribute, not a hardcoded title string
- [x] `npm test` passes (35/35 — one run hit 19 transient failures under system load with `page.goto` timing out from the very first test, unrelated to the content changes; a clean re-run passed everything); visually verified metrics + case-study cards render correctly

**Batch 3 — About, Operating Principles, Toolbox**
- [ ] Update `about.json`: eyebrow, heading (keep or revise), paragraphs, pull-quote, closing paragraph (include the added "Since July 2026..." bridge sentence linking to the Independent Build section), illustration `cardCaption`/label
- [ ] Update `principles.json`: principle 01 title + body; principle 02 body; principle 03 body (titles for 02/03 stay as-is per the audit)
- [ ] Update `toolbox.json`: section title, AI card items, Fintech card title (→ "Enterprise, Banking & Platform Products"), Life-Beyond-PRDs card items

**Batch 4 — Experience, Contact, Footer**
- [ ] Update `experience.json`: role title (`Senior Product Manager` → `Product Manager`), date range → `2021 – Jul 2026` (confirmed), the MISHA-related bullet copy
- [ ] Update `contact.json`: intro body, form heading (`Send an Inquiry or Dispatch` → `Send a Message`), topic labels, success message
- [ ] Update `site.json`'s `social.linkedin` → `https://www.linkedin.com/in/febylailani`

**Batch 5 — New section: Independent Build (Iqro Land)**
- [ ] Create `src/_data/iqroLand.json` (section copy, 6 cards, screenshot list, CTA) using the authentic origin story now in `COPY_POSITIONING_AUDIT.md` (her son getting stuck on hijaiyah letters, tahfidz repetition, parent-guided screen time) — not the earlier generic placeholder copy
- [ ] Create `src/_includes/partials/iqro-land.njk` (follow the existing card-grid patterns from `toolbox.njk`/`case-studies.njk`)
- [ ] Add clearly-labeled placeholder screenshot cards to `src/assets/images/` (confirmed approach — swap for real screenshots later, once Feby has seen the live layout)
- [ ] Wire the new partial into `src/index.njk` in the position specified by the revised site structure (after Selected Product Work)
- [ ] Add a nav entry if this section should be directly jump-linkable (confirm with Feby — not explicitly specified in the audit)

**Batch 6 — New section: Learning in Public**
- [ ] Create `src/_data/learningInPublic.json` (section copy, 3 content blocks, and the 3 real article cards — title/description/URL — from `COPY_POSITIONING_AUDIT.md`; do not pad with invented cards)
- [ ] Create `src/_includes/partials/learning-in-public.njk` (static cards linking out with `target="_blank"` + the ↗ icon, matching the site's established pattern for genuinely external links)
- [ ] Wire into `src/index.njk` after Iqro Land (or before Contact, per the revised structure)

**Batch 7 — Site restructure**
- [ ] Reorder `src/index.njk`'s includes to match: Hero → Key Metrics → Selected Product Work → Independent Build → About → Operating Principles → Toolbox → Learning in Public → Experience → Education → Contact
- [ ] Re-check in-page anchor nav (`site.json`'s `navLinks`/`footerNavLinks`) still points at the right sections in the right order, and update the mobile nav panel accordingly (no code change needed there, it's data-driven — just verify)

**Batch 8 — Final QA**
- [ ] Re-run `npm test` after each batch (not just at the end)
- [ ] Manual pass against `COPY_POSITIONING_AUDIT.md`'s "Section-level acceptance criteria" checklist
- [ ] Grep the built `_site/` output for "Senior Product Manager" / "Senior PM" to confirm zero matches
- [ ] Visual QA at 375/768/1440px for the 2 new sections (new content = new responsive surface area, not covered by existing screenshots)
- [ ] Update `docs/PRD.md`'s Summary, Target audience, and Content-sections list to reflect the new positioning and structure once shipped
- [ ] Add a `CHANGELOG.md` entry and consider whether this warrants a `v0.2.0` tag (content/positioning change, not just bug fixes)

## Phase 2 — Backlog (not part of this release)

- Real contact-form backend (e.g., Formspree) with spam protection — requires Feby to create the third-party account
- Real Cal.com booking link (currently a placeholder — see `README.md`; the LinkedIn URL itself is now resolved, see Phase 1.2)
- Per-case-study detail pages, replacing the shared "confidential" modal pattern
- Full keyboard focus trap + broader WCAG AA audit for the confidential modal
- Dark mode
- Privacy-respecting analytics (e.g., Plausible)
- Custom domain
- Responsive image pipeline (`eleventy-img`, WebP/srcset) for further performance gains
- Migrate off the Tailwind Play CDN to a compiled/purged build, once the dynamic-class-swap JavaScript is refactored to use data attributes instead of full class-string replacement
- Lightweight blog or additional case-study writing (Markdown collection)
