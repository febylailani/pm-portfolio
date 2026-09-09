# PM Portfolio — Feby Lailani

Senior Product Manager (Fintech & AI) portfolio website, built with [Eleventy](https://www.11ty.dev/). Live at `https://febylailani.github.io/pm-portfolio/` once deployed.

## Quick start

Requires Node.js 20 (see `.nvmrc`).

```bash
npm install
npm start
```

`npm start` builds the site and serves it locally with live reload at `http://localhost:8080` (Eleventy's default dev server port).

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Local dev server with live reload |
| `npm run build` | Production-shaped build to `_site/` (no path prefix) |
| `npm run build:prod` | Build with the `/pm-portfolio/` path prefix, matching the GitHub Pages project-page URL |
| `npm run lint:js` | Lint `src/assets/js/main.js` |
| `npm test` | Full suite: build + HTML validation + link check + Playwright (functional, accessibility, responsive) |

## How to edit content

You do **not** need to know HTML, Tailwind CSS, or Nunjucks to update the site's content. Every section's copy lives in a plain JSON file under `src/_data/`. Edit the file, commit, and open a pull request — merging to `main` rebuilds and redeploys the site automatically.

| File | Controls |
|---|---|
| `src/_data/site.json` | Brand name/tagline, nav links, footer links, **LinkedIn URL**, email, copyright line |
| `src/_data/hero.json` | Headline, bio, hero CTAs, hero illustration, small tag captions |
| `src/_data/aiDemo.json` | The "ask me about..." demo bar: placeholder text, popular topics, and each topic's canned response |
| `src/_data/metrics.json` | The four stat cards (5+ Years, 0→1, 90%, Top 15, etc.) |
| `src/_data/caseStudies.json` | The four case-study cards: category, title, description, tag chips |
| `src/_data/confidentialModal.json` | The shared "confidential case study" popup copy |
| `src/_data/about.json` | The About Me narrative, pull-quote, and illustration captions |
| `src/_data/principles.json` | The three "Operating Principles" cards |
| `src/_data/toolbox.json` | The four skills/toolbox columns |
| `src/_data/experience.json` | Work history — add a new role by adding an entry to the `roles` array |
| `src/_data/education.json` | Academic background cards |
| `src/_data/contact.json` | Contact intro copy, direct channels (email/**Cal.com link**/location), and the inquiry form's labels/topics |

**Formatting tip:** wrap a phrase in `**double asterisks**` anywhere in a JSON string (e.g. in an experience bullet or an about paragraph) to render it bold — no HTML needed.

**Known placeholders to update when ready:** `site.json` → `social.linkedin` and `contact.json` → the `cal` channel's `href` currently point at the generic `linkedin.com`/`cal.com` homepages. Replace them with your real profile/booking URLs whenever they're ready — no other code changes needed.

### Adding an image

Drop the file into `src/assets/images/`, then reference it as `/assets/images/your-file.png` from the relevant data file's `src`/`illustration.src` field.

## Project structure

```
src/
  _data/          content (JSON) — see table above
  _includes/
    layouts/      base.njk (the <head>, Tailwind config, fonts)
    partials/     one template per page section
  assets/
    images/       illustrations
    favicons/     generated favicon set
    js/main.js    all interactive behavior (AI demo, modal, form)
  index.njk       assembles the partials into the final page
docs/             PRD, task list, test case catalog
tests/            Playwright end-to-end + accessibility specs
.github/workflows/
  ci.yml          runs on every pull request
  deploy.yml      runs on push to main — builds and publishes to GitHub Pages
```

## Tech notes

- **Tailwind via CDN, not a local build.** The page's own JavaScript (the confidential-modal toggle, the contact-form topic selector) swaps complete Tailwind class strings at runtime. A locally compiled/purged Tailwind build only knows about classes it can see in the template source at build time, so those runtime-only class combinations would need to be hand-maintained in a safelist or risk rendering unstyled. Keeping Tailwind's CDN build (which JIT-compiles whatever classes it observes in the live DOM) avoids that entirely, at the cost of a small "should not be used in production" console warning and no CSS purging. Revisiting this is tracked in `docs/TASKS.md`'s Phase 2 backlog.
- **GitHub Pages project-page path prefix.** Production builds run with `--pathprefix=/pm-portfolio/` (see `build:prod` and `deploy.yml`) so that same-repo asset URLs resolve correctly once the site is served from `https://febylailani.github.io/pm-portfolio/` instead of the domain root. Local development (`npm start`/`npm run build`) does not use a prefix.
- **Contact form is a front-end demo for Phase 1.** Submitting it shows a success message but does not send anywhere yet — see `docs/PRD.md` for why, and `docs/TASKS.md` for the Phase 2 plan to wire up a real backend.

## Git & release workflow

- **Branches:** `feature/…`, `fix/…`, `docs/…`, `chore/…`, `ci/…` — no direct commits to `main`.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `test:`).
- **Pull requests:** every change goes through a PR into `main`; the `CI` workflow must pass before merging. Squash-merge and delete the branch afterward.
- **Changelog:** update `CHANGELOG.md`'s `[Unreleased]` section as part of your PR (Keep a Changelog format).
- **Releases:** tag with [SemVer](https://semver.org/) (e.g. `v0.1.1`) once `[Unreleased]` is renamed to a dated version section, and cut a matching GitHub Release.

## One-time repository setup (already done for v0.1.0, documented for reference)

These are GitHub repository settings, not something a code change can configure:

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
2. **Settings → Branches → Add branch protection rule** for `main`, requiring the `CI` status check to pass before merging.
