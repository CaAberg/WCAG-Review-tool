import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getElementName,
  getLocation,
  hasAttribute,
  hasOnClick,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Returns true when the element exposes a keyboard or pointer alternative. */
function hasPointerOrKeyboardAlternative(opening: t.JSXOpeningElement): boolean {
  return (
    hasOnClick(opening) ||
    hasAttribute(opening, "onKeyDown") ||
    hasAttribute(opening, "onKeyUp")
  );
}

/** Flags device motion handlers without an alternative input (WCAG 2.5.4). */
export const motionActuationRule: A11yRule = {
  id: "motion-actuation",
  description: "Motion-based actions need an alternative input method",
  wcagCriteria: ["2.5.4"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag) return;

      const hasMotionHandler =
        hasAttribute(opening, "onDeviceMotion") ||
        hasAttribute(opening, "onDeviceOrientation");
      if (!hasMotionHandler) return;
      if (hasPointerOrKeyboardAlternative(opening)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "motion-actuation",
        message: `<${tag}> uses device motion without a click or keyboard alternative.`,
        severity: "blocking",
        wcagCriteria: ["2.5.4"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Provide buttons or keyboard controls so users can perform the action without shaking or tilting the device.",
        fixSnippet: `<button type="button" onClick={handleAction}>Perform action</button>`,
      });
    });

    return findings;
  },
};
