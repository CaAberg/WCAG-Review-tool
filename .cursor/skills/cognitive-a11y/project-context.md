# WCAG Access — Cognitive Project Context

## Finding message style (analyzer output)

Findings are defined in `lib/a11y/rules/*.ts` and `lib/a11y/runtime/focus-not-obscured.ts`, displayed in `components/analyzer/results-panel.tsx`.

**Current pattern (good):**
- `message`: Specific element + problem
- `suggestion`: Copy-ready fix code
- Severity badge: "Must fix" / "Should fix" via `getSeverityLabel`
- **Live preview** badge for runtime findings (2.4.11)
- Grouped by criterion with description + "Read guide" link

## Guide writing tone (MDX)

Guides for 1.4.3 and 2.4.11 document static vs live preview analyzer behavior. Use plain language and define WCAG terms on first use.

## UI copy locations

| Location | File | Cognitive focus |
|----------|------|-----------------|
| Parse errors | `results-panel.tsx` | Clear next step: "Fix syntax errors and try again" |
| Preview skipped | `results-panel.tsx` | Non-alarming status when iframe check unavailable |
| Empty results | `results-panel.tsx` | Positive reinforcement; note rule set scope |
| Mobile nav | `site-header-mobile-nav.tsx` | "Open menu" / "Close menu" labels |

## 3.2.6 Consistent Help

Help nav link (`aria-label="Help — WCAG accessibility guides"`) points to `/guides` on desktop and mobile.

## Results panel accessibility (already good)

- `aria-live="polite"` announces result updates
- `role="alert"` for parse errors
- Accordion for progressive disclosure of findings (reduces overwhelm)
