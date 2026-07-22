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

/** Flags image inputs missing alt text (WCAG 1.1.1). */
export const inputImageAltRule: A11yRule = {
  id: "input-image-alt",
  description: 'Input type="image" elements must have an alt attribute',
  wcagCriteria: ["1.1.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "input") return;

      const inputType = getAttributeValue(opening, "type");
      if (inputType !== "image") return;

      if (!hasAttribute(opening, "alt")) {
        const loc = getLocation(opening);
        const src = getAttributeValue(opening, "src") ?? "...";
        findings.push({
          ruleId: "input-image-alt",
          message:
            'Input type="image" is missing an alt attribute. Screen readers cannot describe image buttons without alt text.',
          severity: "blocking",
          wcagCriteria: ["1.1.1"],
          line: loc.line,
          column: loc.column,
          element: "input",
          suggestion: 'Add alt text describing the image button action.',
          fixSnippet: `<input type="image" src="${src}" alt="Submit search" />`,
        });
      }
    });

    return findings;
  },
};
