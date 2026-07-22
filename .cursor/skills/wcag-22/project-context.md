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

The analyzer registers **43 static rules** and **7 runtime preview checks** across **85 catalogued WCAG 2.1/2.2 success criteria**. See `lib/a11y/coverage-map.ts` for the full static/runtime/manual breakdown.

| SC | Coverage | Rule(s) |
|----|----------|---------|
| 1.1.1 | Static | `image-alt`, `image-redundant-alt`, `svg-alt`, `input-image-alt` |
| 1.2.1–1.2.2 | Static | `media-alternative`, `video-captions` |
| 1.3.1 | Static | `heading-order`, `label`, `table-headers`, `list-structure`, `landmark-one-main` |
| 1.3.4–1.3.5 | Static | `orientation-lock`, `autocomplete-attr` |
| 1.4.2–1.4.12 | Static | `audio-autoplay`, `contrast-minimum`, `non-text-contrast`, `resize-text`, `reflow-fixed-width`, `text-spacing` |
| 2.1.1–2.1.4 | Static/runtime | `click-events-have-key-events`, `interactive-tabindex`, `accesskey`, `focus-trap` |
| 2.3.3 | Runtime | `reduced-motion` |
| 2.4.1–2.4.13 | Static/runtime | `bypass-blocks`, `link-purpose`, `empty-heading-label`, `focus-visible`, `focus-not-obscured`, `focus-order`, `focus-appearance` |
| 2.5.1–2.5.8 | Static/runtime | `pointer-gestures`, `label-in-name`, `motion-actuation`, `drag-alternative`, `target-size`, `pointer-cancellation` |
| 3.1.1–3.3.2 | Static | `lang-page`, `lang-parts`, `on-focus-change`, `on-input-change`, `error-identification`, `required-field` |
| 4.1.2–4.1.3 | Static | `button-name`, `iframe-title`, `duplicate-id`, `link-name`, `aria-valid`, `status-messages` |

Remaining criteria have MDX guides and appear in the analyzer **manual checks** panel when relevant patterns are detected (e.g. `<video>` → 1.2.x).

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
