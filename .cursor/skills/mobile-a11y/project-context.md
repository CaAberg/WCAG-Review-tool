# WCAG Access — Mobile Project Context

## Audit targets

| Area | File | Mobile concerns |
|------|------|-----------------|
| Site header | `components/site-header.tsx` | Nav links + auth at 320px; touch target size on links |
| Analyzer layout | `components/analyzer/analyzer-workspace.tsx` | Editor + results stacking on small screens |
| Results panel | `components/analyzer/results-panel.tsx` | Accordion touch targets; horizontal scroll on code blocks |
| Landing page | `app/page.tsx` | Responsive grid (`md:grid-cols-3`), button stack |
| Auth forms | `components/auth/` | Input fields not obscured by mobile keyboard |

## Current responsive patterns

- Container: `max-w-6xl px-4 sm:px-6`
- Landing buttons: `flex-col sm:flex-row`
- Feature grid: `md:grid-cols-3`
- Focus rings on all nav links (works for external keyboard on tablets)

## Gaps

- No dedicated mobile viewport e2e tests (axe runs at default Playwright viewport)
- Nav does not collapse on small screens — may overflow or crowd
- CodeMirror editor usability on touch devices not verified
- Copy suggestion buttons should meet 2.5.8 minimum target size

## Recommended next steps

1. Add Playwright test at 320px viewport for `/analyzer` and `/`
2. Verify nav link touch targets ≥ 24×24 CSS px (add padding if needed)
3. Test analyzer with mobile screen reader (VoiceOver/TalkBack)
4. Ensure `pre` code blocks in results don't cause horizontal page scroll
5. Do not disable zoom in viewport meta

## Test command

```bash
npm run test:e2e -- tests/e2e/accessibility.spec.ts
```

Consider adding a mobile viewport project in `playwright.config.ts` for dedicated mobile axe runs.
