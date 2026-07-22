import type { A11yFinding } from "../types";

/** Flags positive tabindex values that may disrupt logical focus order (WCAG 2.4.3). */
export function checkFocusOrder(root: HTMLElement): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const positiveTabIndex = root.querySelectorAll<HTMLElement>(
    '[tabindex]:not([tabindex="-1"]):not([tabindex="0"])',
  );

  for (const element of positiveTabIndex) {
    const tabIndex = Number(element.getAttribute("tabindex"));
    if (!Number.isFinite(tabIndex) || tabIndex <= 0) continue;

    const line = Number(element.dataset.sourceLine ?? 0);
    findings.push({
      ruleId: "focus-order",
      message: `Element uses tabIndex={${tabIndex}}, which can disrupt logical focus order.`,
      severity: "blocking",
      wcagCriteria: ["2.4.3"],
      line: Number.isFinite(line) ? line : 0,
      column: 0,
      element: element.tagName.toLowerCase(),
      suggestion: "Avoid positive tabindex values; rely on DOM order instead.",
      fixSnippet: 'tabIndex={0}',
      source: "preview",
    });
  }

  return findings;
}
