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

/** Flags touch-only handlers without a click alternative (WCAG 2.5.1). */
export const pointerGesturesRule: A11yRule = {
  id: "pointer-gestures",
  description: "Touch gestures need a single-pointer alternative",
  wcagCriteria: ["2.5.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag) return;

      const hasTouchHandler =
        hasAttribute(opening, "onTouchStart") ||
        hasAttribute(opening, "onTouchMove");
      if (!hasTouchHandler) return;
      if (hasOnClick(opening)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "pointer-gestures",
        message: `<${tag}> relies on touch gestures without an onClick alternative.`,
        severity: "blocking",
        wcagCriteria: ["2.5.1"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Provide a single-pointer alternative such as onClick, or expose the same action through a button.",
        fixSnippet: `<${tag} onClick={handleAction} onTouchStart={handleAction}>Action</${tag}>`,
      });
    });

    return findings;
  },
};
