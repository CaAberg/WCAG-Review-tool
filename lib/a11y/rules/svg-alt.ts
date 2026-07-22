import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

function svgHasAccessibleName(opening: t.JSXOpeningElement, element: t.JSXElement): boolean {
  if (
    hasAttribute(opening, "aria-label") ||
    hasAttribute(opening, "aria-labelledby") ||
    getAttributeValue(opening, "role") === "presentation"
  ) {
    return true;
  }

  return element.children.some(
    (child) =>
      t.isJSXElement(child) &&
      getElementName(child.openingElement) === "title",
  );
}

/** Flags SVG elements without accessible names (WCAG 1.1.1). */
export const svgAltRule: A11yRule = {
  id: "svg-alt",
  description: "SVG graphics must have an accessible name",
  wcagCriteria: ["1.1.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      if (getElementName(opening) !== "svg") return;
      if (svgHasAccessibleName(opening, path.node)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "svg-alt",
        message:
          "<svg> is missing an accessible name. Add a <title>, aria-label, or aria-labelledby.",
        severity: "blocking",
        wcagCriteria: ["1.1.1"],
        line: loc.line,
        column: loc.column,
        element: "svg",
        suggestion: "Provide a text alternative for this SVG graphic.",
        fixSnippet: '<svg aria-label="Description of graphic">...</svg>',
      });
    });

    return findings;
  },
};
