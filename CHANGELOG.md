# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Refined the "In-House AI Banking Assistant (Hijra Bank)" case study's description and tags to more precisely describe the shipped feature; renamed the case-study CTA to "Unlock Case Study".
- Simplified the confidential-modal copy and removed the redundant "what we'll unbox" list and secondary "Close Dossier" button.

- Added a mobile/tablet hamburger nav menu — the desktop nav was previously hidden below 1024px with no replacement (K-01).
- Contact channel values (email, Cal.com, location) no longer truncate on phone-width screens (K-02).
- Fixed the confidential-modal badges overlapping the close button on mobile (P-01).
- Relabeled anchor-scroll CTAs ("Book Intro", "Schedule Call", "Schedule 30-min Interview Call") to use "↓" instead of the external-link "↗" icon, which is now reserved for links that actually leave the page (P-06).
- Darkened two text/background color pairs that fell just short of WCAG AA contrast (P-09).

- "Skills, Stack & Explorations" and "Academic Foundations" headings now match the 36px size used by every other section heading (N-01).
- Replaced the native `window.alert()` copy-confirmation with an inline toast next to the "Copy" button (N-02).
- The hero AI-demo response box now discloses that its answers are a curated preview, not a live model (N-05).

### Added

- `docs/UX_AUDIT.md`: a UI/UX audit of the live v0.1.0 site (16 findings: 2 critical, 9 important, 5 nice-to-have) covering navigation, responsiveness, accessibility, and CTA clarity.
- `docs/UX_FIXES_SPEC.md`: implementation decisions for the audit's fixes.
- A "Phase 1.1 — UX Audit Fixes" task list in `docs/TASKS.md`, tracking the fix for each audit finding.
- `<meta name="description">` and Open Graph/Twitter card tags, so sharing the site link now shows a title, summary, and preview image (P-07).
- `aria-live="polite"` on the AI-demo response box and the contact-form success banner, so screen readers announce them when they appear (P-08).
- The confidential modal is now `inert` while closed, so its buttons no longer receive keyboard focus when hidden (P-03).
- A visible focus ring on the hero AI-demo input (P-04).
- A "Skip to main content" link for keyboard users (N-03).
- 15 new regression tests (TC-21 … TC-35) covering all of the above.

### Fixed

- The page now has exactly one `<h1>` (the header brand name is no longer a heading) (P-02).
- Mobile tap targets (footer nav links, footer social icons, the email "Copy" button, AI-demo topic pills, contact-form topic pills) now meet the 44×44px minimum (P-05).

### Known limitation

- N-04 (About and Experience reuse the same career-journey illustration) remains open — it needs a real second illustration, which isn't something an AI coding session can produce. Stays in the Phase 2 backlog.

## [0.1.0] - 2026-09-09

### Added

- Initial public portfolio site, re-platformed from an approved Google Stitch design onto Eleventy (11ty) with Nunjucks templates and JSON content files, so content can be edited without touching markup.
- All page sections: header/nav, hero with an interactive AI-demo bar, key metrics, four production case studies with a shared confidential-details modal, about, operating principles, toolbox/skills, experience timeline, education, and a contact section with a front-end demo inquiry form.
- Local illustration assets (hero, career-journey banner, avatar/favicon) replacing the design source's temporary hosted placeholder images.
- Automated test suite: HTML validation, internal link/asset integrity checks, and a 20-case Playwright + axe-core suite covering navigation, the AI demo, the case-study modal, the contact form, accessibility, and responsive layout.
- CI (`ci.yml`) running the full test suite on every pull request, and CD (`deploy.yml`) publishing to GitHub Pages on every push to `main`.
- Project documentation: `docs/PRD.md`, `docs/TASKS.md`, `docs/TEST_CASES.md`.

### Fixed

- Translated the confidential-modal explanation from Indonesian to English.
- Corrected a WCAG AA color-contrast failure on case-study tag chips and the "past role" experience date pill.
- Added an accessible name (`aria-labelledby`) to the confidential modal dialog.

### Known limitations

- The contact form does not send anywhere yet (front-end demo only); real backend integration is planned for a later release.
- LinkedIn and Cal.com links ship with placeholder URLs pending Feby's real profile/booking links.

[Unreleased]: https://github.com/febylailani/pm-portfolio/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/febylailani/pm-portfolio/releases/tag/v0.1.0
