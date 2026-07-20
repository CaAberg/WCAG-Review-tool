---
name: atag-20
description: >-
  Applies Authoring Tool Accessibility Guidelines (ATAG) 2.0 for making
  authoring tools accessible (Part A) and helping authors produce accessible
  content (Part B). Use when building CMS, editors, analyzers, no-code tools,
  or when the user mentions ATAG, authoring tools, or tool accessibility.
disable-model-invocation: true
---

# ATAG 2.0

## Quick reference

- **Spec:** https://www.w3.org/TR/ATAG20/
- **Implementing ATAG:** https://www.w3.org/WAI/ATAG20/implement/
- **ATAG at a Glance:** https://www.w3.org/WAI/ATAG20/at-a-glance/
- **Report Tool:** https://www.w3.org/WAI/atag/report-tool

ATAG applies to software and services used to produce web content: WYSIWYG editors, CMS, LMS, no-code builders, social platforms with user content, and **accessibility analyzers**.

## Two parts

| Part | Focus | Question to ask |
|------|-------|-----------------|
| **Part A** | Authoring tool UI is accessible | Can people with disabilities use the tool itself? |
| **Part B** | Tool helps authors create accessible output | Does the tool enable, support, and promote WCAG-conformant content? |

Part A requirements map to WCAG 2.0 Level AA applied to the authoring tool interface. Part B is unique to ATAG.

## Conformance

- Levels: A, AA, AAA (same as WCAG).
- Must meet all success criteria at the chosen level within declared scope (whole tool or specific views).
- Evaluate with keyboard-only use, screen readers, and magnification.

Full success criteria summary: [success-criteria.md](success-criteria.md)

## Part A — Make the authoring tool accessible

Key areas when building or reviewing an authoring tool UI:

### Keyboard and focus
- All tool functions operable via keyboard (A.2.1.1).
- No keyboard traps in modals, editors, or panels (A.2.1.2).
- Visible focus indicator on all interactive controls (A.2.4.7).

### Perceivable tool chrome
- Text alternatives for non-text UI (icons, previews) (A.1.1.1).
- Sufficient color contrast in tool UI (A.1.4.3).
- Content reflows at 200% zoom without horizontal scroll (A.1.4.4).
- Status messages announced to assistive tech (A.4.1.3).

### Understandable tool UX
- Consistent navigation and control labels across views (A.3.2.3, A.3.2.4).
- Form labels and instructions for all author inputs (A.3.3.2).
- Errors identified with suggestions (A.3.3.1, A.3.3.3).

### Authoring views
- Editing views must be perceivable and operable (A.2.2.1, A.2.2.2).
- Preview modes should reflect accessibility properties where possible.

## Part B — Help authors produce accessible content

Key areas for tools that check, guide, or generate content:

### Automatic checking (B.2.4.2)
- Provide automated accessibility checks during authoring.
- Checks should cover WCAG success criteria relevant to the content type.
- Results should identify the problem and link to guidance.

### Manual guidance (B.2.4.1, B.2.4.3)
- Provide documentation explaining how to meet accessibility requirements.
- Assist authors in correcting identified problems (fix suggestions, examples).
- Guide authors to produce accessible content even when not prompted by checks.

### Promote accessibility (B.2.4.4, B.2.4.5)
- Accessibility features should be on by default where possible.
- Do not automatically produce inaccessible content (e.g., missing alt by default).
- Templates and components should start accessible.

### Metadata and output (B.2.2.x, B.2.3.x)
- Preserve accessibility information in save/export (alt text, labels, headings).
- Do not strip ARIA, labels, or structural markup on export.

## Evaluation workflow

1. **Scope:** Define which tool views and workflows are in scope.
2. **Part A audit:** Keyboard-navigate every feature; screen reader test critical flows.
3. **Part B audit:** Verify checks, docs, and fix guidance cover target WCAG level.
4. **Report:** Use ATAG Report Tool or structured checklist per success criterion.

## Mapping tool features to Part B

| Tool feature | ATAG intent |
|--------------|-------------|
| Static analyzer / linter | B.2.4.2 automated checking |
| WCAG guides / docs | B.2.4.1 guidance for authors |
| Fix suggestions in results | B.2.4.3 assist with corrections |
| Severity levels + criterion links | B.2.4.2 meaningful check output |
| Default accessible templates | B.2.4.5 on-by-default accessibility |

## Related standards

- **WCAG 2.2:** Target output standard for authored content — see `wcag-22` skill.
- **Mobile / Cognitive:** Additional overlays for tool UI and author guidance — see `mobile-a11y` and `cognitive-a11y` skills.

## WCAG Access integration

This is the project copy for the WCAG Access repo. See [project-context.md](project-context.md) for page-by-page ATAG assessment, Part B feature mapping, and self-assessment checklist.
