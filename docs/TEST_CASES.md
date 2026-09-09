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

## Known accepted limitation

- The confidential modal does not yet implement a full keyboard focus trap (focus can technically move behind the dialog while it's open). Tracked as a Phase 2 accessibility improvement in `TASKS.md`.
