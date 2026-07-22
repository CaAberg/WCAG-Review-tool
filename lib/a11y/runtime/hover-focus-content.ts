import type { A11yFinding } from "../types";

/** Flags hover/focus-triggered content that may not be dismissible (WCAG 1.4.13). */
export function checkHoverFocusContent(root: HTMLElement): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const triggers = root.querySelectorAll<HTMLElement>(
    "[title], [data-tooltip], [aria-describedby]",
  );

  for (const element of triggers) {
    const describedBy = element.getAttribute("aria-describedby");
    if (!describedBy) continue;

    const tooltip = root.querySelector<HTMLElement>(`#${CSS.escape(describedBy)}`);
    if (!tooltip) continue;

    const isHidden =
      tooltip.hasAttribute("hidden") ||
      tooltip.getAttribute("aria-hidden") === "true";

    if (isHidden) continue;

    const line = Number(element.dataset.sourceLine ?? 0);
    findings.push({
      ruleId: "hover-focus-content",
      message:
        "Additional content shown on hover/focus should be dismissible, hoverable, and persistent.",
      severity: "blocking",
      wcagCriteria: ["1.4.13"],
      line: Number.isFinite(line) ? line : 0,
      column: 0,
      element: element.tagName.toLowerCase(),
      suggestion:
        "Allow users to dismiss supplemental content without moving focus.",
      fixSnippet: 'role="tooltip" aria-hidden="true"',
      source: "preview",
    });
  }

  return findings;
}
