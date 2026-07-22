import type { A11yFinding } from "../types";

/** Flags controls that fire on pointer down without cancellation (WCAG 2.5.2). */
export function checkPointerCancellation(root: HTMLElement): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const buttons = root.querySelectorAll<HTMLElement>("button, [role='button']");

  for (const button of buttons) {
    const hasMouseDown = button.onmousedown !== null;
    const hasClick = button.onclick !== null;

    if (hasMouseDown && !hasClick) {
      const line = Number(button.dataset.sourceLine ?? 0);
      findings.push({
        ruleId: "pointer-cancellation",
        message:
          "Control may activate on pointer down without a corresponding click/up-event path.",
        severity: "blocking",
        wcagCriteria: ["2.5.2"],
        line: Number.isFinite(line) ? line : 0,
        column: 0,
        element: button.tagName.toLowerCase(),
        suggestion:
          "Use onClick for activation or allow users to abort before the up-event.",
        fixSnippet: "<button onClick={handleAction}>Action</button>",
        source: "preview",
      });
    }
  }

  return findings;
}
