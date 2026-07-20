# WCAG Access — ATAG Project Context

WCAG Access is an **authoring tool** (ATAG applies). It helps React developers analyze TSX and learn WCAG.

## Pages in scope

| Route | ATAG part | Key components |
|-------|-----------|----------------|
| `/analyzer` | A + B | `analyzer-workspace.tsx`, CodeMirror editor, `results-panel.tsx` |
| `/guides` | B | MDX guides in `content/wcag/` |
| `/guides/[slug]` | B | Guide detail pages |
| `/audits` | A + B | Saved audit list, auth gate |
| `/account` | A | Sign in/up forms, `auth-nav.tsx` |
| `/` | A | Landing/marketing page |

## Part A — Current state and gaps

**Implemented:**
- Focus-visible rings on nav links (`components/site-header.tsx`)
- `aria-live="polite"` on results panel during/after analysis
- `role="alert"` for parse errors
- `aria-hidden` on decorative icons
- `lang="en"` on `<html>` (`app/layout.tsx`)
- Keyboard-operable Radix UI components

**Gaps to address:**
- CodeMirror editor keyboard/screen reader testing not documented
- Auth forms: verify error announcements (4.1.3)
- Save audit dialog: verify focus trap and return focus
- Mobile nav: no hamburger menu; links may crowd on small screens

## Part B — Feature mapping

| Feature | ATAG SC | Status |
|---------|---------|--------|
| Static analyzer | B.2.4.2 | Active — 7 rules |
| WCAG guides | B.2.4.1 | Active — 7 MDX guides |
| Fix suggestions | B.2.4.3 | Active — copy-ready code in findings |
| Criterion links in results | B.2.4.1 | Active — links to `/guides/[slug]` |
| Severity levels | B.2.4.2 | Active — blocking vs enhancement |
| Contrast checking | B.2.4.2 | **Gap** — guide exists, no rule |
| On-by-default checks | B.2.4.5 | Active — analysis runs on demand |

## ATAG self-assessment checklist (WCAG Access)

```
Part A — Tool UI:
- [ ] /analyzer fully keyboard operable (editor, analyze, save, results accordion)
- [ ] /account forms have labels, error text, and focus management
- [ ] All pages pass axe e2e (tests/e2e/accessibility.spec.ts)
- [ ] Status messages announced (analysis complete, copy toast, save success)
- [ ] Focus not lost on dialog open/close

Part B — Author support:
- [ ] Every rule maps to WCAG criterion with guide link
- [ ] Findings include message + suggestion + line number
- [ ] Guides explain why + React examples + analyzer behavior
- [ ] Expand rule set toward WCAG 2.2 AA coverage
- [ ] No feature disables or hides accessibility checks by default
```

## E2E test coverage

`tests/e2e/accessibility.spec.ts` runs axe on: `/`, `/analyzer`, `/guides`, `/account`, `/account/check-email`. Add `/audits` when stable.
