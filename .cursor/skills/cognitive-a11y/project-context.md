# WCAG Access — Cognitive Project Context

## Finding message style (analyzer output)

Findings are defined in `lib/a11y/rules/*.ts` and displayed in `components/analyzer/results-panel.tsx`.

**Current pattern (good):**
- `message`: Specific element + problem — e.g. `"<img> element is missing an alt attribute."`
- `suggestion`: Copy-ready fix code
- Severity badge: `blocking` or `enhancement` (with color + text)
- Grouped by criterion with description + "Read guide" link

**Improvements to aim for:**
- User-facing severity labels: "Must fix" / "Should fix" alongside technical terms
- Brief "why it matters" in message (one clause), not just what's wrong
- Avoid exposing raw rule IDs to users in primary UI

## Guide writing tone (MDX)

Follow existing pattern in `content/wcag/1-1-1-non-text-content.mdx`:

1. **Why it matters** — one paragraph, user impact focus
2. **React examples** — Do/Don't with code blocks
3. **How our analyzer checks this** — only when a rule exists

Use plain language. Define WCAG terms on first use in each guide.

## UI copy locations

| Location | File | Cognitive focus |
|----------|------|-----------------|
| Parse errors | `results-panel.tsx` | Clear next step: "Fix syntax errors and try again" |
| Empty results | `results-panel.tsx` | Positive reinforcement; note rule set scope |
| Auth prompts | `components/auth/` | Simple sign-in instructions |
| Landing page | `app/page.tsx` | Clear value prop, numbered "How it works" |
| Toast messages | `results-panel.tsx` | "Suggestion copied to clipboard" — confirms action |

## 3.2.6 Consistent Help — gap

No dedicated help/contact link in consistent location across all pages. Guides serve as help content but are nav-linked as "Guides" not "Help". Consider:
- Adding `/guides` as help destination with consistent label
- Or footer link: "Accessibility Help" on every page

## Severity mapping for future UI

| Internal (`FindingSeverity`) | Suggested user label |
|------------------------------|---------------------|
| `blocking` | Must fix |
| `enhancement` | Should fix |

Both should remain visible as text (not color-only) — current Badge component already shows text.

## Results panel accessibility (already good)

- `aria-live="polite"` announces result updates
- `role="alert"` for parse errors
- Accordion for progressive disclosure of findings (reduces overwhelm)
