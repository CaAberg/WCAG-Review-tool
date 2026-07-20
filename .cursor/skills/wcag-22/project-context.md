# WCAG Access — Project Context

WCAG Access is a Next.js 15 authoring tool that statically analyzes pasted React/TSX. Target standard: **WCAG 2.2 AA**.

## Key files

| File | Purpose |
|------|---------|
| `lib/a11y/wcag-map.ts` | Criterion metadata + guide slug mapping |
| `lib/a11y/rules/index.ts` | Rule registry (`ALL_RULES`) |
| `lib/a11y/rules/*.ts` | Individual static analysis rules |
| `lib/a11y/types.ts` | `A11yRule`, `A11yFinding`, `WcagCriterion` types |
| `lib/a11y/engine.ts` | Parse + run all rules |
| `content/wcag/*.mdx` | WCAG guide pages |
| `app/api/analyze/route.ts` | Analysis API endpoint |

## Currently covered criteria (7)

| SC | Rule(s) | Guide |
|----|---------|-------|
| 1.1.1 | `image-alt`, `image-redundant-alt` | Yes |
| 1.3.1 | `heading-order`, `label` | Yes |
| 2.1.1 | `click-events-have-key-events` | Yes |
| 2.4.7 | `focus-visible` | Yes |
| 3.3.2 | `label` | Yes |
| 4.1.2 | `click-events-have-key-events`, `button-name` | Yes |
| 1.4.3 | — (guide only, no rule) | Yes |

Note: `wcag-map.ts` comment still says "2.1" — update to "2.2" when touching that file.

## Priority expansion criteria

1. **1.4.3 Contrast** — `culori` is in `package.json` but unused; wire up color contrast rule
2. **2.5.8 Target Size** — static check for tiny interactive elements
3. **2.4.11 Focus Not Obscured** — document/manual; hard to static-analyze
4. **3.2.6 Consistent Help** — add persistent help link in nav/footer

## Adding a new rule

1. Create `lib/a11y/rules/my-rule.ts` following `img-alt.ts` pattern
2. Register in `lib/a11y/rules/index.ts`
3. Add criterion to `WCAG_CRITERIA` in `wcag-map.ts` if new
4. Add MDX guide in `content/wcag/` with frontmatter:

```yaml
---
title: "Criterion Name"
criterionId: "X.X.X"
level: "A" | "AA" | "AAA"
description: "One-line summary."
---
```

Sections: Why it matters → React do/don't examples → How our analyzer checks this

5. Add unit test in `tests/unit/engine.test.ts`

## MDX guide slug convention

Criterion `1.1.1` → file `1-1-1-kebab-name.mdx` → route `/guides/1-1-1-kebab-name`
