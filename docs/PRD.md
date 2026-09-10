# PRD: Feby Lailani — Product Manager Portfolio (Phase 1)

## Summary

A single-page, public portfolio website for Feby Lailani, Product Manager · Consumer & Enterprise Products · Applied AI, showcasing her work history, production case studies, an independent applied-AI build (Iqro Land), operating principles, skills, learning-in-public writing, and a way for visitors to get in touch. The visual design was approved via a Google Stitch mockup; this project re-platforms that design onto Eleventy (11ty) so content can be maintained without editing markup. Positioning was later revised (Phase 1.2) from a fintech-specific "Senior Product Manager" framing to a broader consumer/enterprise/applied-AI framing, so the site reads well for non-fintech PM roles as well as her banking background.

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

- Recruiters and hiring managers evaluating Feby for Product Manager roles across consumer, enterprise, and applied-AI product work — not fintech-only (e.g., customer-lifecycle/automation/messaging roles like respond.io).
- Founders/teams seeking 0→1 product, applied-AI, or automation advisory.
- Conference organizers or communities considering her for speaking or writing engagements.

## Content sections (in page order)

1. **Header/Nav** — brand identity, jump links to each section, primary CTA.
2. **Hero** — headline, bio, primary/secondary CTAs, an interactive "ask about my experience" demo bar with canned responses per topic.
3. **Key Metrics** — four standout numbers (years of experience, cost savings, performance ranking, etc.).
4. **Selected Product Work (Case Studies)** — four case studies, each summarized publicly with a "confidential — discuss in interview" modal for deeper detail (protects NDA'd banking information).
5. **Independent Build: Iqro Land** — a self-initiated, applied-AI product she is building since July 2026 (a learning app for her son), covering problem statement, target user, scope, product decisions, AI-assisted workflow, and current result, with placeholder product-screen slots pending real screenshots.
6. **About** — narrative bio connecting her engineering background to her product philosophy.
7. **Operating Principles** — three principles that describe how she approaches product work.
8. **Toolbox & Skills** — four categorized skill/interest lists.
9. **Learning in Public** — writing and visual notes (LinkedIn posts, study notes, career-switch story) that make her learning process visible, linking out to three real published articles.
10. **Experience** — reverse-chronological work history with achievement bullets, including her current upskilling/independent-build chapter.
11. **Education** — academic and credential background.
12. **Contact** — direct channels (email, scheduling link, location) plus a front-end demo inquiry form.
13. **Footer** — brand recap, quick nav, social links.

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
