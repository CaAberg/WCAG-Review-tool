import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getClassNames,
  getElementName,
  getLocation,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const FOCUS_REPLACEMENT_CLASSES = [
  "focus-visible:outline",
  "focus-visible:ring",
  "focus:outline",
  "focus:ring",
  "focus-visible:",
];

/** Flags outline-none without visible focus replacement (WCAG 2.4.7). */
export const focusVisibleRule: A11yRule = {
  id: "focus-visible",
  description: "Elements removing focus outline need a visible replacement",
  wcagCriteria: ["2.4.7"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag) return;

      const classNames = getClassNames(opening);
      const removesOutline =
        classNames.includes("outline-none") ||
        classNames.includes("focus:outline-none") ||
        classNames.includes("focus-visible:outline-none");

      if (!removesOutline) return;

      const hasReplacement = FOCUS_REPLACEMENT_CLASSES.some((cls) =>
        classNames.includes(cls),
      );

      if (!hasReplacement) {
        const loc = getLocation(opening);
        findings.push({
          ruleId: "focus-visible",
          message: `Element uses outline-none without a visible focus indicator replacement.`,
          severity: "blocking",
          wcagCriteria: ["2.4.7"],
          line: loc.line,
          column: loc.column,
          element: tag,
          suggestion:
            'Add focus-visible styles: className="outline-none focus-visible:ring-2 focus-visible:ring-offset-2"',
        });
      }
    });

    return findings;
  },
};
