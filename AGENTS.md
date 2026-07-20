# WCAG Access — Agent Instructions

WCAG Access is a Next.js 15 authoring tool that statically analyzes pasted React/TSX against WCAG criteria.

## Accessibility skills

Before implementing accessibility-related features, read the project skills in `.cursor/skills/`:

| Skill | When to use |
|-------|-------------|
| [a11y-standards](.cursor/skills/a11y-standards/SKILL.md) | Start here — routes to the right child skill |
| [wcag-22](.cursor/skills/wcag-22/SKILL.md) | WCAG 2.2 criteria, analyzer rules, MDX guides |
| [atag-20](.cursor/skills/atag-20/SKILL.md) | Authoring tool UI (Part A) and author support (Part B) |
| [mobile-a11y](.cursor/skills/mobile-a11y/SKILL.md) | Touch targets, responsive layout, mobile testing |
| [cognitive-a11y](.cursor/skills/cognitive-a11y/SKILL.md) | Plain-language findings, predictable UX, COGA patterns |

Each child skill has a **project-context.md** with WCAG Access–specific file paths, gaps, and checklists.

General (non-project) copies of these skills live in `~/.cursor/skills/`.

## Key codebase paths

- Analysis engine: `lib/a11y/`
- Rule registry: `lib/a11y/rules/index.ts`
- WCAG guides: `content/wcag/*.mdx`
- Analyzer UI: `components/analyzer/`
- E2E a11y tests: `tests/e2e/accessibility.spec.ts`

## Target standard

WCAG 2.2 Level AA for content; ATAG 2.0 Level AA for the tool itself and its author-support features.

## Pre-development

Run the checklist in `.cursor/skills/a11y-standards/SKILL.md` before starting new accessibility features.
