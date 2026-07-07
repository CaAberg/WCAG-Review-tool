import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getElementName,
  getLocation,
  hasAttribute,
  hasOnClick,
  NATIVE_INTERACTIVE,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags non-interactive elements with click handlers (WCAG 2.1.1, 4.1.2). */
export const clickHandlerRule: A11yRule = {
  id: "click-events-have-key-events",
  description: "Non-interactive elements with onClick need keyboard support",
  wcagCriteria: ["2.1.1", "4.1.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || NATIVE_INTERACTIVE.has(tag)) return;
      if (!hasOnClick(opening)) return;

      const hasRole = hasAttribute(opening, "role");
      const hasTabIndex = hasAttribute(opening, "tabIndex");
      const hasKeyHandler =
        hasAttribute(opening, "onKeyDown") ||
        hasAttribute(opening, "onKeyUp") ||
        hasAttribute(opening, "onKeyPress");

      if (!hasRole || !hasTabIndex || !hasKeyHandler) {
        const loc = getLocation(opening);
        findings.push({
          ruleId: "click-events-have-key-events",
          message: `<${tag}> has onClick but lacks proper keyboard accessibility (role, tabIndex, or keyboard handler).`,
          severity: "blocking",
          wcagCriteria: ["2.1.1", "4.1.2"],
          line: loc.line,
          column: loc.column,
          element: tag,
          suggestion: `Use a <button> instead, or add role="button" tabIndex={0} and onKeyDown handler.`,
        });
      }
    });

    return findings;
  },
};
