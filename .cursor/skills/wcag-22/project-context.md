# WCAG Access — Project Context

WCAG Access is a Next.js 15 authoring tool that analyzes pasted React/TSX statically and with a live preview runtime check. Target standard: **WCAG 2.2 AA**.

## Key files

| File | Purpose |
|------|---------|
| `lib/a11y/wcag-map.ts` | Criterion metadata + guide slug mapping |
| `lib/a11y/rules/index.ts` | Static rule registry (`ALL_RULES`) |
| `lib/a11y/rules/*.ts` | Individual static analysis rules |
| `lib/a11y/ast-helpers.ts` | AST helpers including `resolveClassNames` (cn/clsx + twMerge) |
| `lib/a11y/design-tokens.ts` | Semantic token → hex map from `globals.css` (light theme) |
| `lib/a11y/preview/compile-tsx.ts` | Browser TSX compile for preview iframe |
| `lib/a11y/runtime/focus-not-obscured.ts` | WCAG 2.4.11 runtime DOM check |
| `components/analyzer/preview-frame.tsx` | Hidden iframe + postMessage bridge |
| `app/analyzer/preview/page.tsx` | Sandboxed preview document |
| `lib/a11y/types.ts` | `A11yRule`, `A11yFinding`, `AnalyzeResult` types |
| `lib/a11y/engine.ts` | Parse + run static rules |
| `content/wcag/*.mdx` | WCAG guide pages |
| `app/api/analyze/route.ts` | Static analysis API endpoint |

## Currently covered criteria

| SC | Coverage | Rule(s) |
|----|----------|---------|
| 1.1.1 | Static | `image-alt`, `image-redundant-alt` |
| 1.3.1 | Static | `heading-order`, `label` |
| 1.4.3 | Static | `contrast-minimum` (Tailwind pairs + design tokens + cn()) |
| 2.1.1 | Static | `click-events-have-key-events` |
| 2.4.7 | Static | `focus-visible` (includes cn()-resolved classes) |
| 2.4.11 | **Runtime preview** | `focus-not-obscured` |
| 2.5.8 | Static | `target-size` |
| 3.3.2 | Static | `label` |
| 4.1.2 | Static | `click-events-have-key-events`, `button-name` |

Guides without static/runtime rules: **3.2.6 Consistent Help** (implemented in site nav).

## Static analysis limitations

- `cn()` / `clsx()` — only literal boolean/object/array arguments are resolved; dynamic expressions are skipped.
- Design tokens — light-theme `:root` values only; dark mode not inferred.
- `cva()` / cross-file variant resolution — out of scope.

## Adding a new rule

1. Create `lib/a11y/rules/my-rule.ts` following `img-alt.ts` pattern
2. Register in `lib/a11y/rules/index.ts`
3. Add criterion to `WCAG_CRITERIA` in `wcag-map.ts` if new
4. Add MDX guide in `content/wcag/` with frontmatter
5. Add unit test in `tests/unit/engine.test.ts` or `tests/unit/rules/`

For runtime-only checks, add logic under `lib/a11y/runtime/` and wire through `preview-frame.tsx`.

## MDX guide slug convention

Criterion `1.1.1` → file `1-1-1-kebab-name.mdx` → route `/guides/1-1-1-kebab-name`

Regenerate design tokens after changing `app/globals.css`:

```bash
npm run generate:tokens
```
