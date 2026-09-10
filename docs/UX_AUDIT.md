# UI/UX Audit — Portfolio Site (2026-09-10)

A structural review of the live portfolio site across visual hierarchy, spacing/color/typography consistency, readability, navigation flow, responsiveness, baseline accessibility, and copy/CTA clarity. 16 findings, each with evidence and a concrete recommendation. No code was changed as part of the audit itself — see `TASKS.md` for the fix plan and `UX_FIXES_SPEC.md` for implementation decisions. **Update (2026-09-10):** 15 of 16 findings have since been fixed and shipped; see the Resolution Status table below.

- **Site audited:** https://febylailani.github.io/pm-portfolio/
- **Version at audit time:** `main` @ `6c31e23` (v0.1.0)
- **Viewports checked:** 375px (mobile), 768px (tablet), 1440px (desktop)
- **Scope note:** PR #2 (case-study copy revision + modal simplification) was still pending at audit time and was intentionally not evaluated here.

## Summary

| Severity | Count | Meaning |
|---|---|---|
| 🔴 Critical | 2 | Directly blocks the page's primary jobs: finding a section, or contacting Feby |
| 🟠 Important | 9 | Page still works, but feels unpolished, less accessible, or over-promises |
| 🟢 Nice-to-have | 5 | Polish that isn't urgent |

## Resolution Status

| ID | Finding | Status | Shipped in |
|---|---|---|---|
| K-01 | No mobile/tablet nav | ✅ Resolved | #4 |
| K-02 | Contact info truncated on mobile | ✅ Resolved | #4 |
| P-01 | Modal badge/close overlap | ✅ Resolved | #5 |
| P-02 | Two `<h1>` elements | ✅ Resolved | #5 |
| P-03 | Hidden modal buttons keyboard-focusable | ✅ Resolved | #5 |
| P-04 | No focus indicator on AI-demo input | ✅ Resolved | #5 |
| P-05 | Tap targets under 44px | ✅ Resolved | #5 |
| P-06 | CTA copy/icon over-promises | ✅ Resolved | #5 |
| P-07 | No meta description / OG tags | ✅ Resolved | #5 |
| P-08 | Dynamic content not announced | ✅ Resolved | #5 |
| P-09 | Contrast just under WCAG AA | ✅ Resolved | #5 |
| N-01 | Inconsistent heading scale | ✅ Resolved | #6 |
| N-02 | Native `alert()` for copy confirmation | ✅ Resolved | #6 |
| N-03 | No skip-to-content link | ✅ Resolved | #6 |
| N-04 | Duplicate illustration | ⏸️ Open — needs a new illustration asset, not executable in an AI coding session. Stays in the Phase 2 backlog. | — |
| N-05 | AI-demo doesn't disclose curated responses | ✅ Resolved | #6 |

---

## 🔴 Critical

### K-01 — No navigation at all on mobile & tablet (<1024px)
The desktop nav uses Tailwind's `hidden lg:flex` — below the `lg` breakpoint (1024px) it disappears completely, with no hamburger menu or any replacement. This covers every phone size and most tablets, including iPad portrait (768px).

**Evidence:**
```
getComputedStyle(nav).display → "none" at 375px and 768px
document.querySelector('[aria-label*="menu"], .hamburger') → null
```

**Impact:** Mobile/tablet visitors — likely the majority of traffic when this link is shared via WhatsApp/LinkedIn — have no fast way to jump to Case Studies or Contact. The only option is manually scrolling past ~11 sections.

**Recommendation:** Add a hamburger button that appears below `lg`, opening a panel/drawer with the same nav links plus the "Book Intro" CTA. Give it `aria-expanded` and make it closable with Escape.

### K-02 — Primary contact info is truncated (ellipsis) on phone-width screens
All three contact channel rows (Direct Email, Cal.com Video Call, Location & Timezone) use `truncate` (nowrap + ellipsis) in a text column sharing space with the "Copy"/"Open ↗" button. At 375px, the text column is only 149px wide while the content needs 156px+ — the email address and other values render as `febylailani@gmail.c…`.

**Evidence:**
```
el.scrollWidth: 156px   el.clientWidth: 149px  → truncated
Same on "30-min intro or a…" and "Yogyakarta / Jakarta (GMT…"
```

**Impact:** This is the single most important part of the page — how a recruiter reaches Feby — and it's the least readable part of the page on the device most people will actually view it on.

**Recommendation:** Stack label and value vertically on mobile instead of one row sharing space with the action button, or allow the text to wrap instead of truncating.

---

## 🟠 Important

### P-01 — Modal badge overlaps the close (×) button on mobile
In the "Confidential Case Study" modal, at 375px width, the right edge of the second badge ("Production Architecture") overlaps the close button by ~30px (confirmed by bounding-box measurement and screenshot). The × is still clickable (higher z-index), but it visually collides with the badge text.

**Recommendation:** Wrap the two badges onto their own line on mobile, or reserve space so they never sit under the close button.

### P-02 — Two `<h1>` elements on the page
Both "Feby Lailani" in the header and the hero headline render as `<h1>`. Screen readers surface two competing top-level headings, and search engines lose a clear single-topic signal.

**Evidence:**
```
document.querySelectorAll('h1') → [ "Feby Lailani", "Shaping conversational AI, fintech platforms & frontier products from 0 to 1." ]
```

**Recommendation:** Change the header name to a `<p>`/`<span>` (no visual change needed). Keep the single `<h1>` for the hero headline.

### P-03 — Hidden modal buttons remain keyboard-focusable
When the confidential modal is closed (`opacity:0; pointer-events:none`), its × and "Schedule 30-min Interview Call" buttons still have `tabindex="0"`. A keyboard user tabbing through the page lands on two invisible "ghost" controls right after the footer links.

**Evidence:**
```
modal opacity: 0, pointer-events: none
closeBtn.focus() → document.activeElement === closeBtn: true (should be false)
```

**Recommendation:** Add `inert` (or toggle `aria-hidden="true"` + `tabindex="-1"` on every focusable child) while the modal is closed; remove it when opened.

### P-04 — The hero AI-demo input has zero focus indicator
The "Ask me about AI in banking…" input uses `focus:outline-none focus:ring-0`. When focused via keyboard, its outline color is fully transparent — keyboard users get no visual confirmation they've tabbed into it.

**Evidence:**
```
getComputedStyle(input).outlineColor → rgba(0, 0, 0, 0)  (alpha = 0)
```

**Recommendation:** Add `focus-visible:ring-2 focus-visible:ring-brand-blue`, consistent with the accent color used elsewhere.

### P-05 — Many mobile tap targets are under the 44×44px minimum
Measured at 375px: footer nav links (16px tall), footer social icons (20×20px), the "Copy" button (32×16px), AI-demo topic pills (24px), contact-form topic pills (30px), and the modal's × button (34×34px) — all below the WCAG 2.5.5 / Apple HIG / Material 44×44px guidance.

**Recommendation:** Increase vertical padding on these elements at mobile breakpoints until each is ≥44px tall, without changing desktop appearance.

### P-06 — CTA copy promises more than it delivers
"Book Intro ↗", "Schedule Call ↗", and "Schedule 30-min Interview Call ↗" all use booking-style verbs plus the ↗ arrow, which conventionally signals "opens externally" — but all three simply scroll to the in-page contact form, not a real scheduler. The same ↗ icon is used correctly on the genuinely external Cal.com "Open ↗" link, making its meaning inconsistent across the page. Compounding this, the form they scroll to doesn't actually send an email yet (a known Phase 1 limitation) — so the whole "Book → Schedule → fill form → submit" chain ends with no real action behind it.

**Evidence:**
```
"Book Intro ↗"                     → href="#contact" (anchor, not external)
"Schedule Call ↗"                  → href="#contact"
"Schedule 30-min Interview Call ↗" → button, no href
"Open ↗" (Cal.com)                 → href="https://cal.com", target="_blank" ✓ correct
```

**Recommendation:** Relabel to something honest about the actual action (e.g. "See Contact Options ↓"), and reserve ↗ exclusively for links that truly leave the page.

### P-07 — No meta description or Open Graph tags
When this link is shared on LinkedIn, WhatsApp, or Slack, no summary text or preview image appears — only the browser tab title. For a portfolio site whose whole purpose is to be shared with recruiters and connections, this gives up a free first impression.

**Evidence:**
```
document.querySelector('meta[name="description"]') → null
document.querySelectorAll('meta[property^="og:"]') → [] (0 tags)
```

**Recommendation:** Add `<meta name="description">` (a 1–2 sentence bio) and `og:title`/`og:description`/`og:image` tags (using the hero illustration) in `base.njk`.

### P-08 — Dynamic content isn't announced to screen readers
The AI-demo response box and the contact-form success banner appear via JavaScript (toggling the `hidden` class) but have no `aria-live`. A screen-reader user who asks a question or submits the form hears no confirmation that anything happened.

**Evidence:**
```
#ai-response-box → aria-live: null
#form-success-banner → aria-live: null
```

**Recommendation:** Add `aria-live="polite"` to both elements so screen readers announce their content automatically when it appears.

### P-09 — Two color pairs fall just short of WCAG AA contrast
Measured programmatically (WCAG contrast formula) across the whole page: two color pairs sit slightly below the 4.5:1 threshold for normal text.

| Sample | Colors | Ratio | Needed |
|---|---|---|---|
| "Extreme Rigor" (About stat chips) | `#64748B` on `#EFF6FF` | 4.37:1 | 4.5:1 |
| "Production Architecture" badge | `#2563EB` on `#DBEAFE` | 4.24:1 | 4.5:1 |

**Recommendation:** Darken the text color slightly (e.g. to `slate-600` / `blue-700`) — the same pattern already used to fix the case-study tag chips in a previous release.

---

## 🟢 Nice-to-have

### N-01 — Two section headings render smaller than the rest
Nearly every `<h2>` section heading (Production Case Studies, Career Journey, etc.) renders at 36px, but "Skills, Stack & Explorations" and "Academic Foundations" render at only 30px — one step down the type scale with no clear content reason.

**Evidence:**
```
h2 "Career Journey"                → font-size: 36px
h2 "Skills, Stack & Explorations"  → font-size: 30px
h2 "Academic Foundations"          → font-size: 30px
```

**Recommendation:** Match these to 36px at `sm` and above, unless a lighter visual weight for these two sections is an intentional choice — in which case make that explicit rather than accidental.

### N-02 — "Copy email" confirmation uses a native browser `alert()`
Clicking "Copy" next to the email triggers `window.alert("Email address copied!")`, a native browser dialog that blocks the whole page until dismissed. The site already has a polished inline success-banner pattern (used in the contact form) that fits its design language far better.

**Recommendation:** Replace `alert()` with a small toast/tooltip next to the Copy button, matching the `#form-success-banner` style.

### N-03 — No "skip to content" link
Keyboard users must tab through all 5 nav links (and the avatar) on every page load before reaching the main content. The nav is short, so impact is minor, but this is a cheap, standard fix.

**Recommendation:** Add a visually-hidden "Skip to main content" link that appears on focus, targeting `#hero` or the `<main>` element.

### N-04 — The "career journey" illustration appears twice, identically
The same image (`career-journey-banner.png`) is used in both the About and Experience sections. This is already a documented, deliberate limitation in `TASKS.md` (asset scarcity), but is worth restating here since it's noticeable on a single scroll-through.

**Recommendation:** Commission a second illustration when resourcing allows — already tracked in the Phase 2 backlog.

### N-05 — The "AI Copilot" demo doesn't disclose that responses are pre-written
The "Feby's Copilot" box reads like a live AI chat, but responses are fixed text per topic. For a profile positioning itself as an AI/evals expert, a small disclosure here would strengthen credibility rather than undermine it.

**Recommendation:** Add a small caption, e.g. "(curated preview, not a live model)", below the response box.

---

## Verified good

- Every `<img>` has a descriptive `alt` attribute — zero missing.
- No horizontal overflow at 375 / 768 / 1440px.
- Eyebrow labels ("GET IN TOUCH", etc.) are 100% consistent in size, color, and letter-spacing.
- CTA button size scale (56 / 44 / 36px) intentionally reflects priority hierarchy.
- Brand color palette and pill border-radius are consistent across all components.
- HTML validates (html-validate); zero broken links/assets (linkinator).
- 20 automated tests (Playwright + axe-core) pass, including baseline contrast and responsive checks.
- The modal correctly locks body scroll and closes via Escape, backdrop click, and the × button.

## Methodology

Checked directly on the live site (`febylailani.github.io/pm-portfolio`, commit `6c31e23`) via computed DOM/CSS inspection (color, WCAG contrast, font size, bounding boxes) at three viewports (375 / 768 / 1440px), plus manual keyboard-navigation checks and screenshots for select visual findings. PR #2 (case-study copy + modal simplification) was not live at audit time and was intentionally excluded from scope.
