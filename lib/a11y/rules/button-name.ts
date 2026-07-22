import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getElementName,
  getFirstChildElementName,
  getLocation,
  getTextContent,
  hasAttribute,
  hasOnlyNonTextChildren,
  walkJsxElements,
} from "../ast-helpers";
import { buttonNameFixSnippet } from "../suggestion-snippets";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags buttons without accessible names (WCAG 4.1.2). */
export const buttonNameRule: A11yRule = {
  id: "button-name",
  description: "Buttons must have discernible text",
  wcagCriteria: ["4.1.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "button") return;

      const text = getTextContent(path.node);
      const hasAriaLabel = hasAttribute(opening, "aria-label");
      const hasAriaLabelledBy = hasAttribute(opening, "aria-labelledby");
      const hasTitle = hasAttribute(opening, "title");

      if (!text && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
        const loc = getLocation(opening);
        const iconOnly = hasOnlyNonTextChildren(path.node);
        const childHint = getFirstChildElementName(path.node);
        findings.push({
          ruleId: "button-name",
          message: iconOnly
            ? "Icon-only button is missing an accessible name. Screen reader users will hear \"button\" with no context."
            : "Button has no discernible text. Screen reader users will not know what this button does.",
          severity: "blocking",
          wcagCriteria: ["4.1.2"],
          line: loc.line,
          column: loc.column,
          element: "button",
          suggestion: iconOnly
            ? "Add an aria-label that describes the button action."
            : "Add visible text or an aria-label so screen readers can announce the button purpose.",
          fixSnippet: buttonNameFixSnippet(iconOnly, childHint),
        });
      }
    });

    return findings;
  },
};
