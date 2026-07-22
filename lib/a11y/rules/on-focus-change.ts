import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getElementName, getLocation, hasAttribute, walkJsxElements } from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags select controls that change context on focus (WCAG 3.2.1). */
export const onFocusChangeRule: A11yRule = {
  id: "on-focus-change",
  description: "Focus should not automatically change context",
  wcagCriteria: ["3.2.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "select") return;
      if (!hasAttribute(opening, "onFocus")) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "on-focus-change",
        message:
          "<select> uses onFocus, which may submit or navigate when focus moves to the control.",
        severity: "blocking",
        wcagCriteria: ["3.2.1"],
        line: loc.line,
        column: loc.column,
        element: "select",
        suggestion:
          "Avoid changing context on focus. Let users review the control and submit explicitly with a button.",
        fixSnippet:
          '<select defaultValue="option-a" aria-label="Choose option">\n  <option value="option-a">Option A</option>\n</select>\n<button type="submit">Apply</button>',
      });
    });

    return findings;
  },
};
