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
- [ ] **[N-01]** Bump the `<h2>` size for "Skills, Stack & Explorations" and "Academic Foundations" to match the other section headings (36px at `sm`+), or explicitly document why they're intentionally smaller.
- [ ] **[N-02]** Replace the `window.alert()` copy-confirmation in `main.js` with an inline toast/tooltip matching the `#form-success-banner` visual pattern.
- [ ] **[N-03]** Add a visually-hidden "Skip to main content" link at the top of `base.njk`, targeting `<main>`.
- [ ] **[N-04]** Commission a second illustration so About and Experience no longer reuse the identical career-journey banner (tracked here and in the Phase 2 backlog below).
- [ ] **[N-05]** Add a small caption under the hero AI-demo response box disclosing it's a curated preview, not a live model.

**Verification**
- [x] Re-run `npm test` (build + html-validate + linkinator + Playwright/axe) after each batch of fixes
- [x] Manually re-check K-01/K-02/P-01/P-05 at 375px and 768px after fixing
- [x] Re-run an axe-core pass to confirm P-03/P-04/P-08 close their respective violations
- [ ] Update `docs/UX_AUDIT.md` findings to note which are resolved, or archive it once all Critical + Important items ship (deferred until the Nice-to-have batch, N-04 excepted, is also done)

## Phase 2 — Backlog (not part of this release)

- Real contact-form backend (e.g., Formspree) with spam protection — requires Feby to create the third-party account
- Real LinkedIn profile URL and Cal.com booking link (currently placeholders — see `README.md`)
- Per-case-study detail pages, replacing the shared "confidential" modal pattern
- Full keyboard focus trap + broader WCAG AA audit for the confidential modal
- Dark mode
- Privacy-respecting analytics (e.g., Plausible)
- Custom domain
- Responsive image pipeline (`eleventy-img`, WebP/srcset) for further performance gains
- Migrate off the Tailwind Play CDN to a compiled/purged build, once the dynamic-class-swap JavaScript is refactored to use data attributes instead of full class-string replacement
- Lightweight blog or additional case-study writing (Markdown collection)
