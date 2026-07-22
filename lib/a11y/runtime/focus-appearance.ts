import type { A11yFinding } from "../types";

/** Checks focus indicator visibility and contrast in preview (WCAG 2.4.13). */
export function checkFocusAppearance(root: HTMLElement): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const focusable = root.querySelector<HTMLElement>(
    'button, a[href], input, select, textarea, [tabindex="0"]',
  );

  if (!focusable) return findings;

  focusable.focus();
  const style = getComputedStyle(focusable);
  const hasVisibleFocus =
    style.outlineStyle !== "none" ||
    style.boxShadow !== "none" ||
    style.borderColor !== style.backgroundColor;

  if (hasVisibleFocus) return findings;

  const line = Number(focusable.dataset.sourceLine ?? 0);
  findings.push({
    ruleId: "focus-appearance",
    message: "Focused element may lack a sufficiently visible focus indicator.",
    severity: "enhancement",
    wcagCriteria: ["2.4.13"],
    line: Number.isFinite(line) ? line : 0,
    column: 0,
    element: focusable.tagName.toLowerCase(),
    suggestion: "Provide a focus indicator with adequate size and contrast.",
    fixSnippet:
      'className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"',
    source: "preview",
  });

  return findings;
}
