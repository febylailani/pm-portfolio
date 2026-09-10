# Test Cases

Automated coverage for the Phase 1 MVP. Run the full suite with `npm test`. Tools: `html-validate` (markup validity), `linkinator` (internal link/asset integrity), `@playwright/test` (functional + responsive), `@axe-core/playwright` (accessibility).

| ID | Area | Tool | Test case | Spec file |
|----|------|------|-----------|-----------|
| TC-01 | Functional | Playwright | Each header nav link (About/Case Studies/Operating Principles/Experience/Contact) scrolls to its matching section id. | `tests/e2e/nav.spec.ts` |
| TC-02 | Functional | Playwright | "Book Intro" (header) and "Schedule Call" (hero) both target `#contact`. | `tests/e2e/nav.spec.ts` |
| TC-03 | Functional | Playwright | "Explore Case Studies" scrolls to `#case-studies`. | `tests/e2e/nav.spec.ts` |
| TC-04 | Functional | Playwright | Each popular-topic pill in the hero AI demo sets the input value and reveals the matching canned response. | `tests/e2e/hero-ai-demo.spec.ts` |
| TC-05 | Functional | Playwright | Submitting free text in the hero AI demo reveals a response that echoes the typed query. | `tests/e2e/hero-ai-demo.spec.ts` |
| TC-06 | Functional | Playwright | Each of the 4 case-study "View Confidential Case Study" buttons opens the modal with the correct interpolated title. | `tests/e2e/case-study-modal.spec.ts` |
| TC-07 | Functional | Playwright | Modal closes via the × button, a backdrop click outside the dialog card, and the Escape key. | `tests/e2e/case-study-modal.spec.ts` |
| TC-08 | Content | Playwright | Modal's intro paragraph is in English (regression guard against the original Indonesian text). | `tests/e2e/case-study-modal.spec.ts` |
| TC-09 | Functional | Playwright | The modal's "Schedule 30-min Interview Call" button closes the modal and scrolls to `#contact`. | `tests/e2e/case-study-modal.spec.ts` |
| TC-10 | Functional | Playwright | Contact-form topic buttons toggle active styling exclusively (only one active at a time). | `tests/e2e/contact-form.spec.ts` |
| TC-11 | Functional | Playwright | Submitting the contact form with all required fields filled shows the success banner and resets the form. | `tests/e2e/contact-form.spec.ts` |
| TC-12 | Functional | Playwright | Submitting with a required field empty is blocked by native HTML5 validation (no success banner). | `tests/e2e/contact-form.spec.ts` |
| TC-13 | Functional | Playwright | Clicking the email "Copy" button writes the address to the clipboard. | `tests/e2e/contact-form.spec.ts` |
| TC-14 | Validity | html-validate | The full built page has zero markup errors. | `npm run test:html` |
| TC-15 | Integrity | Playwright | Every footer nav link's `href` resolves to an existing element id on the page. | `tests/e2e/nav.spec.ts` |
| TC-16 | Integrity | linkinator | Every internal asset reference (images, script, stylesheet links) resolves with a 200 response — zero broken links, zero leftover external placeholder image URLs. | `npm run test:links` |
| TC-17 | Accessibility | axe-core (Playwright) | Zero serious/critical violations on initial page load. | `tests/e2e/a11y.spec.ts` |
| TC-18 | Accessibility | axe-core (Playwright) | Zero critical violations with the confidential modal open; the modal exposes `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`. | `tests/e2e/a11y.spec.ts` |
| TC-19 | Accessibility | Playwright | Every `<img>` has a non-empty, descriptive `alt` attribute. | `tests/e2e/a11y.spec.ts` |
| TC-20 | Responsive | Playwright | No horizontal overflow at 375px, 768px, and 1280px viewport widths. | `tests/e2e/responsive.spec.ts` |
| TC-21 | Functional | Playwright | At 375px, the hamburger toggle opens/closes the mobile nav panel and updates `aria-expanded`. Regression guard for K-01. | `tests/e2e/nav.spec.ts` |
| TC-22 | Functional | Playwright | At 375px, tapping a mobile nav link scrolls to its section and closes the panel. Regression guard for K-01. | `tests/e2e/nav.spec.ts` |
| TC-23 | Responsive | Playwright | At 375px, no contact-channel value (email, Cal.com, location) is truncated. Regression guard for K-02. | `tests/e2e/contact-form.spec.ts` |
| TC-24 | Responsive | Playwright | At 375px, the modal's badges no longer overlap the close button. Regression guard for P-01. | `tests/e2e/audit-fixes.spec.ts` |
| TC-25 | Accessibility | Playwright | The page has exactly one `<h1>`. Regression guard for P-02. | `tests/e2e/audit-fixes.spec.ts` |
| TC-26 | Accessibility | Playwright | The confidential modal is `inert` while closed and not `inert` while open. Regression guard for P-03. | `tests/e2e/audit-fixes.spec.ts` |
| TC-27 | Accessibility | Playwright | The hero AI-demo input shows a visible focus ring on keyboard focus. Regression guard for P-04. | `tests/e2e/audit-fixes.spec.ts` |
| TC-28 | Content | Playwright | In-page anchor-scroll CTAs use "↓"; the genuinely external Cal.com link keeps "↗" and `target="_blank"`. Regression guard for P-06. | `tests/e2e/audit-fixes.spec.ts` |
| TC-29 | Content | Playwright | Meta description and Open Graph/Twitter tags are present with non-empty content. Regression guard for P-07. | `tests/e2e/audit-fixes.spec.ts` |
| TC-30 | Accessibility | Playwright | `#ai-response-box` and `#form-success-banner` have `aria-live="polite"`. Regression guard for P-08. | `tests/e2e/audit-fixes.spec.ts` |
| TC-31 | Accessibility | Playwright | The About stat-chip captions and the modal's "Production Architecture" badge render in their darkened, AA-passing colors. Regression guard for P-09. | `tests/e2e/audit-fixes.spec.ts` |
| TC-32 | Responsive | Playwright | Footer nav links, footer social icons, AI-demo topic pills, the email "Copy" button, and contact-form topic pills are all ≥44px tall at 375px. Regression guard for P-05. | `tests/e2e/audit-fixes.spec.ts` |
| TC-33 | Consistency | Playwright | The "Skills, Stack & Explorations" and "Academic Foundations" `<h2>`s render at 36px, matching every other section heading. Regression guard for N-01. | `tests/e2e/audit-fixes.spec.ts` |
| TC-34 | Accessibility | Playwright | "Skip to main content" is the first focusable element on the page and targets `#main-content`. Regression guard for N-03. | `tests/e2e/audit-fixes.spec.ts` |
| TC-35 | Content | Playwright | The AI-demo response box discloses that responses are a curated preview, not a live model. Regression guard for N-05. | `tests/e2e/audit-fixes.spec.ts` |
| TC-36 | Content | Playwright | The Independent Build: Iqro Land section renders its heading, all 6 cards, and all 5 screenshot-placeholder captions. | `tests/e2e/new-sections.spec.ts` |
| TC-37 | Functional | Playwright | Iqro Land's "Build notes coming soon" CTA renders as a disabled, non-clickable element, not a dead link. | `tests/e2e/new-sections.spec.ts` |
| TC-38 | Structural | Playwright | Iqro Land sits directly after Selected Product Work and before About in page order. | `tests/e2e/new-sections.spec.ts` |

## Known accepted limitation

- The confidential modal does not yet implement a full keyboard focus trap (focus can technically move behind the dialog while it's open). Tracked as a Phase 2 accessibility improvement in `TASKS.md`.
