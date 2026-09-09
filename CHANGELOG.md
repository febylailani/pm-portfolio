# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
