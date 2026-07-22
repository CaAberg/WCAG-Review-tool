import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getElementName,
  getLocation,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags html elements missing a lang attribute (WCAG 3.1.1). */
export const langPageRule: A11yRule = {
  id: "lang-page",
  description: "The page html element should declare its language",
  wcagCriteria: ["3.1.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "html") return;
      if (hasAttribute(opening, "lang")) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "lang-page",
        message: "<html> is missing a lang attribute.",
        severity: "blocking",
        wcagCriteria: ["3.1.1"],
        line: loc.line,
        column: loc.column,
        element: "html",
        suggestion:
          'Add lang to the root html element, for example lang="en".',
        fixSnippet: '<html lang="en">...</html>',
      });
    });

    return findings;
  },
};
