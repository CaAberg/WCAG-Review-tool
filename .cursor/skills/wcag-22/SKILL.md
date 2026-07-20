---
name: wcag-22
description: >-
  Applies Web Content Accessibility Guidelines (WCAG) 2.2 for web content
  conformance, React/TSX patterns, and static analyzer rule design. Use when
  implementing WCAG success criteria, writing accessibility guides, building
  a11y lint rules, or when the user mentions WCAG, POUR, success criteria,
  or conformance levels A/AA/AAA.
disable-model-invocation: true
---

# WCAG 2.2

## Quick reference

- **Spec:** https://www.w3.org/TR/WCAG22/
- **Understanding:** https://www.w3.org/WAI/WCAG22/Understanding/
- **Techniques:** https://www.w3.org/WAI/WCAG22/Techniques/
- **Quick Reference:** https://www.w3.org/WAI/WCAG22/quickref/
- **Machine-readable:** https://github.com/w3c/wcag

WCAG 2.2 is backwards compatible: content conforming to 2.2 also conforms to 2.1 and 2.0. Prefer 2.2 for all new work.

## Four principles (POUR)

| Principle | Intent | Key guidelines |
|-----------|--------|----------------|
| **Perceivable** | Users can perceive content | 1.1 Text alternatives; 1.2 Time-based media; 1.3 Adaptable; 1.4 Distinguishable |
| **Operable** | Users can operate UI | 2.1 Keyboard; 2.2 Enough time; 2.3 Seizures; 2.4 Navigable; 2.5 Input modalities |
| **Understandable** | Users can understand content and UI | 3.1 Readable; 3.2 Predictable; 3.3 Input assistance |
| **Robust** | Content works with assistive tech | 4.1 Compatible |

Full success criteria list: [criteria-reference.md](criteria-reference.md)

## Conformance

- **Levels:** A (minimum), AA (standard target for most orgs/laws), AAA (enhanced).
- **Requirement:** Meet **all** success criteria at the chosen level. No partial conformance at a level.
- **Scope:** Full pages, complete processes, or specific views — declare scope in conformance claims.
- **4.1.1 Parsing:** Obsolete in WCAG 2.2. Do not require or test for it.

## WCAG 2.2 additions (over 2.1)

Nine new success criteria — prioritize these when upgrading from 2.1:

| SC | Name | Level |
|----|------|-------|
| 2.4.11 | Focus Not Obscured (Minimum) | AA |
| 2.4.12 | Focus Not Obscured (Enhanced) | AAA |
| 2.4.13 | Focus Appearance | AAA |
| 2.5.7 | Dragging Movements | AA |
| 2.5.8 | Target Size (Minimum) | AA |
| 3.2.6 | Consistent Help | A |
| 3.3.7 | Redundant Entry | A |
| 3.3.8 | Accessible Authentication (Minimum) | AA |
| 3.3.9 | Accessible Authentication (Enhanced) | AAA |

## React / TSX patterns

See [react-patterns.md](react-patterns.md) for do/don't examples mapped to common success criteria.

**High-impact checks for static TSX analysis:**

| SC | What to detect in AST |
|----|----------------------|
| 1.1.1 | `<img>` without `alt`; meaningful images with empty `alt` |
| 1.3.1 | Heading level skips; form fields without labels; table structure |
| 1.4.3 | Text/background color pairs below 4.5:1 (or 3:1 large text) |
| 2.1.1 | Click handlers on non-interactive elements without keyboard equivalent |
| 2.4.7 | Focus styles removed (`outline-none` without replacement) |
| 3.3.2 | Inputs without associated `<label>`, `aria-label`, or `aria-labelledby` |
| 4.1.2 | Buttons/links without accessible name; custom widgets missing role/state |

## Static rule authoring template

Use this shape when building AST-based accessibility rules:

```typescript
export const exampleRule: A11yRule = {
  id: "rule-id",
  description: "Short human-readable rule summary",
  wcagCriteria: ["1.1.1"],
  severity: "blocking", // or "enhancement"
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;
    // walk JSX with walkJsxElements; push findings with line, column, suggestion
    return findings;
  },
};
```

**Finding quality rules:**

- `message`: State the problem in plain language (what is wrong, where).
- `suggestion`: Provide copy-ready fix code, not vague advice.
- `severity`: `blocking` for Level A failures or clear barriers; `enhancement` for best-practice nudges.
- Always include `wcagCriteria` IDs matching the official numbering (e.g. `"2.5.8"`).

## Evaluation workflow

1. Identify target conformance level (usually AA).
2. List applicable success criteria for the component/page scope.
3. Test with automated tools (axe, eslint-plugin-jsx-a11y) + manual keyboard/screen reader checks.
4. Document exceptions with rationale if any SC cannot be met.

## Related standards

- **ATAG:** Authoring tools that help produce WCAG-conformant content — see `atag-20` skill.
- **Mobile:** Mobile-specific application of WCAG — see `mobile-a11y` skill.
- **Cognitive:** Supplemental patterns beyond minimum WCAG — see `cognitive-a11y` skill.

## WCAG Access integration

This is the project copy for the WCAG Access repo. See [project-context.md](project-context.md) for rule registry paths, MDX guide format, current criterion coverage, and expansion priorities.
