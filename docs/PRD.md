# PRD: Feby Lailani — Product Manager Portfolio (Phase 1)

## Summary

A single-page, public portfolio website for Feby Lailani, Senior Product Manager (Fintech & AI), showcasing her work history, production case studies, operating principles, skills, and a way for visitors to get in touch. The visual design was approved via a Google Stitch mockup; this project re-platforms that design onto Eleventy (11ty) so content can be maintained without editing markup.

## Goals

1. Publish a professional, credible, visually polished portfolio at a public URL.
2. Let the site owner (a Product Manager, not a frontend developer) update her own content — bio, case studies, job history, skills, contact details — by editing structured data files, without touching HTML/CSS.
3. Establish a maintainable, testable, versioned codebase following standard web engineering practices (CI/CD, automated tests, semantic versioning, changelog).

## Non-goals (Phase 1)

- A real contact-form backend (email delivery, spam protection, CRM integration).
- Per-case-study detail pages (the current design intentionally keeps case studies "locked" behind a shared confidential-info modal, matching the approved mockup).
- A CMS or admin UI — content editing is via data files in the git repository.
- Custom domain, analytics, dark mode, or internationalization.

See `TASKS.md` for the full Phase 2 backlog.

## Target audience

- Recruiters and hiring managers evaluating Feby for senior PM roles.
- Founders/teams seeking 0→1 product or conversational-AI advisory.
- Conference organizers considering her for speaking engagements.

## Content sections (in page order)

1. **Header/Nav** — brand identity, jump links to each section, primary CTA.
2. **Hero** — headline, bio, primary/secondary CTAs, an interactive "ask about my experience" demo bar with canned responses per topic.
3. **Key Metrics** — four standout numbers (years of experience, cost savings, performance ranking, etc.).
4. **Production Case Studies** — four case studies, each summarized publicly with a "confidential — discuss in interview" modal for deeper detail (protects NDA'd banking information).
5. **About** — narrative bio connecting her engineering background to her product philosophy.
6. **Operating Principles** — three principles that describe how she approaches product work.
7. **Toolbox & Skills** — four categorized skill/interest lists.
8. **Experience** — reverse-chronological work history with achievement bullets.
9. **Education** — academic and credential background.
10. **Contact** — direct channels (email, scheduling link, location) plus a front-end demo inquiry form.
11. **Footer** — brand recap, quick nav, social links.

## Content ownership & editing model

All section copy lives in `src/_data/*.json`. Each file maps 1:1 to a page section (see `README.md` → "How to edit content" for the full mapping). The site owner edits these files directly (via GitHub's web editor or a local clone) and opens a pull request; merging to `main` triggers an automatic rebuild and redeploy. No knowledge of Tailwind CSS or the Nunjucks templates is required for routine content changes.

## Success criteria (Phase 1 "done")

- Site is live on GitHub Pages and matches the approved mockup visually (desktop and mobile).
- All content is in English; no leftover placeholder/Indonesian text.
- Automated test suite (`docs/TEST_CASES.md`) passes in CI on every pull request.
- A non-developer can follow the README to change a case study's tags or a job bullet point without assistance.
- Repository follows the git/versioning workflow described in the README (branches, PRs, Conventional Commits, CHANGELOG, SemVer tag).

## Known, accepted limitations (Phase 1)

- The contact form does not send anywhere; it is a front-end demo that shows a success message, matching the original approved prototype's behavior. Visitors are expected to use the direct email/Cal.com links, which are live.
- LinkedIn and Cal.com links ship with placeholder URLs (`linkedin.com`, `cal.com`) until Feby provides her real profile/booking links — see `contact.json` and `site.json`.
- Tailwind CSS is loaded from its CDN (Play CDN) rather than compiled locally, because the page's own JavaScript toggles complete Tailwind class strings at runtime; see the "Tech notes" section of `README.md` for the full rationale and the Phase 2 migration path.
