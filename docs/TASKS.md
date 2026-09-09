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
- [ ] One-time manual setup (repo owner): enable **Settings → Pages → Source: GitHub Actions**
- [ ] One-time manual setup (repo owner): enable branch protection on `main` requiring the `CI` check

**Docs**
- [x] `docs/PRD.md`, `docs/TASKS.md`, `docs/TEST_CASES.md`
- [x] Rewrite `README.md` with setup/build/preview/deploy instructions and a "How to edit content" section
- [x] Seed `CHANGELOG.md`

**Launch**
- [ ] Merge `feature/eleventy-portfolio-mvp` to `main` via pull request
- [ ] Verify the live GitHub Pages deploy matches the approved mockup
- [ ] Tag `v0.1.0` and cut a GitHub Release from the `CHANGELOG.md` entry

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
