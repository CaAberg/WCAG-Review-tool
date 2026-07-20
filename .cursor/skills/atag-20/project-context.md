# WCAG Access — ATAG Project Context

WCAG Access is an **authoring tool** (ATAG applies). It helps React developers analyze TSX and learn WCAG.

## Pages in scope

| Route | ATAG part | Key components |
|-------|-----------|----------------|
| `/analyzer` | A + B | `analyzer-workspace.tsx`, CodeMirror editor, `results-panel.tsx`, `preview-frame.tsx` |
| `/analyzer/preview` | B | Hidden iframe for runtime 2.4.11 checks |
| `/guides` | B | MDX guides in `content/wcag/` |
| `/guides/[slug]` | B | Guide detail pages |
| `/audits` | A + B | Saved audit list, auth gate |
| `/account` | A | Sign in/up forms, `auth-nav.tsx` |
| `/` | A | Landing/marketing page |

## Part A — Current state

**Implemented:**
- Focus-visible rings on nav links
- Mobile hamburger nav (`site-header-mobile-nav.tsx`) with Dialog, `aria-expanded` / `aria-controls`
- `aria-live="polite"` on results panel during/after analysis
- `role="alert"` for parse errors
- `aria-hidden` on decorative icons
- `lang="en"` on `<html>` (`app/layout.tsx`)
- Keyboard-operable Radix UI components

**Gaps to address:**
- CodeMirror editor keyboard/screen reader testing not documented
- Auth forms: verify error announcements (4.1.3)

## Part B — Feature mapping

| Feature | ATAG SC | Status |
|---------|---------|--------|
| Static analyzer | B.2.4.2 | Active — 9 rules |
| Live preview (2.4.11) | B.2.4.2 | Active — runtime focus-not-obscured |
| WCAG guides | B.2.4.1 | Active — 10+ MDX guides |
| Fix suggestions | B.2.4.3 | Active — copy-ready code in findings |
| Criterion links in results | B.2.4.1 | Active — links to `/guides/[slug]` |
| Severity levels | B.2.4.2 | Active — blocking vs enhancement |
| Contrast checking | B.2.4.2 | Active — Tailwind pairs + design tokens + cn() |
| On-by-default checks | B.2.4.5 | Active — static + preview on Analyze |

## E2E test coverage

`tests/e2e/accessibility.spec.ts` runs axe on key pages plus mobile nav tests at 320px (`mobile-chrome` project).
