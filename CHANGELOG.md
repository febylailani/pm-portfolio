# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-09-10

### Added

- A new "Independent Build: Iqro Land" section describing a self-initiated, applied-AI learning app Feby has been building since July 2026 for her son — covering problem statement, target user, product scope, product decisions, AI-assisted workflow, and current result, with clearly-labeled placeholder product-screen slots pending real screenshots.
- A new "Learning in Public" section surfacing three real published LinkedIn articles (Arabic letter-tracing with AI, local-first vs. cloud architecture, Git for vibe coding) alongside a short career-switch narrative.
- Feby's current chapter (Jul 2026 – Now: "Focus Upskilling") added to the Experience timeline, describing her transition into independent applied-AI product building.
- A mobile/tablet hamburger nav menu — the desktop nav was previously hidden below 1024px with no replacement (K-01).
- `<meta name="description">` and Open Graph/Twitter card tags, so sharing the site link now shows a title, summary, and preview image (P-07).
- `aria-live="polite"` on the AI-demo response box and the contact-form success banner, so screen readers announce them when they appear (P-08).
- A visible focus ring on the hero AI-demo input (P-04), and a "Skip to main content" link for keyboard users (N-03).
- `docs/UX_AUDIT.md`, `docs/UX_FIXES_SPEC.md`, and `docs/COPY_POSITIONING_AUDIT.md`, plus matching "Phase 1.1" and "Phase 1.2" task lists in `docs/TASKS.md`.
- 20 new regression tests (TC-21 … TC-40) covering the UX fixes and the two new sections.

### Changed

- Repositioned Feby from "Senior Product Manager (Fintech & AI)" to "Product Manager · Consumer & Enterprise Products · Applied AI" across the page title, meta description, header/footer badge, hero, about, and contact copy, so the site reads well for non-fintech PM roles (e.g., customer-lifecycle/automation/messaging) and not only banking.
- Replaced narrowly fintech-flavored AI phrasing with broader "applied AI" language (e.g., "NLP banking assistant", "chatbot automation", "AI-assisted prototyping") throughout the case studies, about, toolbox, and experience copy.
- Added Feby's real LinkedIn profile URL (`linkedin.com/in/febylailani`) to the footer, replacing the generic placeholder.
- Reordered page sections to: Hero → Key Metrics → Selected Product Work → Independent Build (Iqro Land) → About → Operating Principles → Toolbox → Learning in Public → Experience → Education → Contact, and adjusted the `bg-white`/`bg-brand-light` section-background alternation to preserve card contrast under the new order (Experience's background and its inner timeline-banner box swapped colors).
- Updated `docs/PRD.md`'s Summary, Target audience, and Content-sections list to reflect the new positioning and page structure.
- Refined the "In-House AI Banking Assistant (Hijra Bank)" case study's description and tags to more precisely describe the shipped feature; renamed the case-study CTA to "Unlock Case Study".
- Simplified the confidential-modal copy and removed the redundant "what we'll unbox" list and secondary "Close Dossier" button.
- Contact channel values (email, Cal.com, location) no longer truncate on phone-width screens (K-02).
- Relabeled anchor-scroll CTAs ("Book Intro", "Schedule Call", "Schedule 30-min Interview Call") to use "↓" instead of the external-link "↗" icon, which is now reserved for links that actually leave the page (P-06).
- Darkened two text/background color pairs that fell just short of WCAG AA contrast (P-09).
- "Skills, Methods & Current Explorations" and "Academic Foundations" headings now match the 36px size used by every other section heading (N-01).
- Replaced the native `window.alert()` copy-confirmation with an inline toast next to the "Copy" button (N-02).
- The hero AI-demo response box now discloses that its answers are a curated preview, not a live model (N-05).
- The confidential modal is now `inert` while closed, so its buttons no longer receive keyboard focus when hidden (P-03).

### Fixed

- The page now has exactly one `<h1>` (the header brand name is no longer a heading) (P-02).
- Mobile tap targets (footer nav links, footer social icons, the email "Copy" button, AI-demo topic pills, contact-form topic pills) now meet the 44×44px minimum (P-05).
- Fixed the confidential-modal badges overlapping the close button on mobile (P-01).

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

[Unreleased]: https://github.com/febylailani/pm-portfolio/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/febylailani/pm-portfolio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/febylailani/pm-portfolio/releases/tag/v0.1.0
