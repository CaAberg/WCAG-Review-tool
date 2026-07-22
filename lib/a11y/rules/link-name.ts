import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getElementName,
  getLocation,
  getTextContent,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags anchors without discernible names (WCAG 4.1.2). */
export const linkNameRule: A11yRule = {
  id: "link-name",
  description: "Links must have discernible text",
  wcagCriteria: ["4.1.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "a") return;

      const text = getTextContent(path.node);
      const hasAriaLabel = hasAttribute(opening, "aria-label");
      const hasAriaLabelledBy = hasAttribute(opening, "aria-labelledby");
      const hasTitle = hasAttribute(opening, "title");

      if (text || hasAriaLabel || hasAriaLabelledBy || hasTitle) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "link-name",
        message:
          "Link has no discernible text. Screen reader users will not know where this link goes.",
        severity: "blocking",
        wcagCriteria: ["4.1.2"],
        line: loc.line,
        column: loc.column,
        element: "a",
        suggestion:
          "Add visible link text or an aria-label that describes the destination.",
        fixSnippet: '<a href="/destination">View details</a>',
      });
    });

    return findings;
  },
};
