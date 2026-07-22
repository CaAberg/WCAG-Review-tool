import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getElementName,
  getLocation,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags iframes without a title attribute (WCAG 4.1.2). */
export const iframeTitleRule: A11yRule = {
  id: "iframe-title",
  description: "Iframes must have a descriptive title",
  wcagCriteria: ["4.1.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "iframe") return;
      if (hasAttribute(opening, "title")) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "iframe-title",
        message: "<iframe> is missing a title attribute.",
        severity: "blocking",
        wcagCriteria: ["4.1.2"],
        line: loc.line,
        column: loc.column,
        element: "iframe",
        suggestion:
          "Add a title that describes the embedded content, such as the document or widget name.",
        fixSnippet:
          '<iframe title="Embedded monthly report" src="https://example.com/report" />',
      });
    });

    return findings;
  },
};
