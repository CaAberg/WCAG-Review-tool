---
name: cognitive-a11y
description: >-
  Applies W3C cognitive accessibility guidance (COGA) and WCAG 2.2 success
  criteria for readable, predictable, low-cognitive-load interfaces. Use when
  writing plain-language content, error messages, tool findings, or when the
  user mentions cognitive accessibility, COGA, learning disabilities, or
  understandable UI.
disable-model-invocation: true
---

# Cognitive Accessibility

## Quick reference

- **Cognitive overview:** https://www.w3.org/WAI/cognitive/
- **Making Content Usable (COGA):** https://www.w3.org/TR/coga-usable/
- **Supplemental Guidance:** https://www.w3.org/WAI/WCAG2/supplemental/
- **Cognitive Accessibility Guidance:** https://www.w3.org/WAI/WCAG2/supplemental/cognitive-accessibility/

Cognitive accessibility addresses how people with cognitive and learning disabilities process information — including attention, memory, language, problem-solving, and comprehension. Conditions include dyslexia, ADHD, autism, dementia, and intellectual disabilities.

## WCAG 2.2 criteria with high cognitive impact

| Guideline | Key SC | Why it matters |
|-----------|--------|----------------|
| 1.3 Adaptable | 1.3.1, 1.3.2 | Clear structure and reading order |
| 1.4 Distinguishable | 1.4.3, 1.4.8, 1.4.12 | Readable visual presentation |
| 2.2 Enough Time | 2.2.1, 2.2.2 | No unnecessary time pressure |
| 2.4 Navigable | 2.4.1, 2.4.4, 2.4.6, 2.4.8 | Easy to find way around |
| 3.1 Readable | 3.1.1–3.1.5 | Plain, understandable language |
| 3.2 Predictable | 3.2.1–3.2.6 | Consistent, non-surprising behavior |
| 3.3 Input Assistance | 3.3.1–3.3.9 | Errors prevented and clearly explained |

Design patterns beyond minimum WCAG: [coga-patterns.md](coga-patterns.md)

## Plain-language writing rules

Use for error messages, tool findings, help text, and UI copy.

### Do
- Use short sentences (one idea per sentence).
- Use active voice: "Enter your email" not "Your email must be entered."
- Name the element and the fix: "The `<img>` on line 12 is missing alt text."
- Put the action first in suggestions: "Add alt text: `<img ... alt=\"...\" />`"
- Use familiar words; define jargon on first use.
- State what happened, why it matters, and what to do next.

### Don't
- Use WCAG criterion numbers alone without explanation.
- Write vague messages: "Accessibility issue detected."
- Bury the fix in prose without copy-ready code.
- Use double negatives or conditional chains.
- Rely on color alone to convey severity or status.

### Finding message template

```
[What is wrong] + [where] + [why it matters briefly] + [how to fix]
```

Example:
> The `<button>` on line 8 has no accessible name. Screen reader users will hear "button" with no context. Add visible text or `aria-label`.

## Predictable UI patterns

- **Consistent navigation:** Same links in same order on every page (3.2.3).
- **Consistent help:** Help/contact in same location across pages (3.2.6).
- **No surprise context changes:** Focus and input do not navigate or submit unexpectedly (3.2.1, 3.2.2).
- **Consistent identification:** Same icon/label for same function everywhere (3.2.4).

## Error prevention and recovery

- Identify errors in text, not color alone (3.3.1).
- Suggest specific corrections (3.3.3).
- Allow review before irreversible actions (3.3.4).
- Avoid asking for the same information twice (3.3.7).
- Do not require memorization for authentication (3.3.8).

## Reduce cognitive load

- Break long forms into steps with clear progress.
- Show one primary action per screen section.
- Provide sensible defaults and examples in placeholders (not as sole labels).
- Allow users to save progress and return later.
- Support `prefers-reduced-motion` for animations.

## Supplemental COGA guidance (beyond required WCAG)

Following supplemental guidance is not required for WCAG conformance but significantly helps users with cognitive disabilities:

- Use visuals alongside text for key instructions.
- Offer a glossary for domain terms.
- Provide summaries before detailed content.
- Let users control timing (no auto-advancing carousels without pause).
- Include users with cognitive disabilities in design and testing.

Full pattern list: [coga-patterns.md](coga-patterns.md)

## Evaluation workflow

1. Review all user-facing text for plain language (read aloud test).
2. Walk primary flows — note surprises, dead ends, or memory demands.
3. Verify errors state problem + fix in text.
4. Check help/contact placement is consistent.
5. Test with extended time limits disabled — can users still complete tasks?
6. Optional: usability test with people who have cognitive disabilities.

## Related standards

- **WCAG 2.2:** Minimum requirements — see `wcag-22` skill.
- **ATAG Part B:** Authoring tools should help produce understandable content — see `atag-20` skill.

## WCAG Access integration

This is the project copy for the WCAG Access repo. See [project-context.md](project-context.md) for finding message style, MDX guide tone, severity labels, and consistent help gaps.
