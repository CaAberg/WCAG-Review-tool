import type { A11yFinding } from "../types";

/** Detects modal-like containers that may trap keyboard focus (WCAG 2.1.2). */
export function checkFocusTrap(root: HTMLElement): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const modals = root.querySelectorAll<HTMLElement>(
    '[role="dialog"], [aria-modal="true"]',
  );

  for (const modal of modals) {
    const focusable = modal.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (focusable.length === 0) continue;

    const hasDismiss =
      modal.querySelector('[aria-label*="close" i], [data-dismiss], button') !==
      null;

    if (!hasDismiss) {
      findings.push({
        ruleId: "focus-trap",
        message:
          "Dialog may trap keyboard focus without a visible dismiss control.",
        severity: "blocking",
        wcagCriteria: ["2.1.2"],
        line: 0,
        column: 0,
        element: "dialog",
        suggestion:
          "Ensure users can close the dialog with Escape and Tab does not trap focus.",
        fixSnippet:
          '<button type="button" aria-label="Close dialog">Close</button>',
        source: "preview",
      });
    }
  }

  return findings;
}
