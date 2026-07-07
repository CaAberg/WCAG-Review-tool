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

/** Flags images missing alt text (WCAG 1.1.1). */
export const imgAltRule: A11yRule = {
  id: "image-alt",
  description: "Images must have an alt attribute",
  wcagCriteria: ["1.1.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "img") return;

      if (!hasAttribute(opening, "alt")) {
        const loc = getLocation(opening);
        findings.push({
          ruleId: "image-alt",
          message: "<img> element is missing an alt attribute.",
          severity: "blocking",
          wcagCriteria: ["1.1.1"],
          line: loc.line,
          column: loc.column,
          element: "img",
          suggestion:
            'Add alt text: <img src="..." alt="Description of the image" />',
        });
      }
    });

    return findings;
  },
};

/** Ensures empty alt is only used for decorative images. */
export const imgEmptyAltRule: A11yRule = {
  id: "image-redundant-alt",
  description: "Images with empty alt should be marked decorative",
  wcagCriteria: ["1.1.1"],
  severity: "enhancement",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "img") return;

      const alt = getAttributeValue(opening, "alt");
      if (alt === "" && !hasAttribute(opening, "role")) {
        const loc = getLocation(opening);
        findings.push({
          ruleId: "image-redundant-alt",
          message:
            'Image has alt="" but no role="presentation". Consider adding role="presentation" for decorative images.',
          severity: "enhancement",
          wcagCriteria: ["1.1.1"],
          line: loc.line,
          column: loc.column,
          element: "img",
          suggestion: '<img src="..." alt="" role="presentation" />',
        });
      }
    });

    return findings;
  },
};
