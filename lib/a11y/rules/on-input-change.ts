import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getElementName, getLocation, hasAttribute, walkJsxElements } from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags select controls that change context on input (WCAG 3.2.2). */
export const onInputChangeRule: A11yRule = {
  id: "on-input-change",
  description: "Changing a select value should not submit without explicit confirmation",
  wcagCriteria: ["3.2.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "select") return;
      if (!hasAttribute(opening, "onChange")) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "on-input-change",
        message:
          "<select> uses onChange, which may navigate or submit as soon as the value changes.",
        severity: "blocking",
        wcagCriteria: ["3.2.2"],
        line: loc.line,
        column: loc.column,
        element: "select",
        suggestion:
          "Avoid automatic submission on change. Pair the select with an explicit submit button.",
        fixSnippet:
          '<select defaultValue="option-a" aria-label="Choose option">\n  <option value="option-a">Option A</option>\n</select>\n<button type="submit">Apply</button>',
      });
    });

    return findings;
  },
};
