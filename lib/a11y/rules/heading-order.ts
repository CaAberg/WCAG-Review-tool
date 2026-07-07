import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getElementName, getLocation, walkJsxElements } from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

/** Flags skipped heading levels (WCAG 1.3.1). */
export const headingOrderRule: A11yRule = {
  id: "heading-order",
  description: "Heading levels should not be skipped",
  wcagCriteria: ["1.3.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    let lastLevel = 0;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || !HEADING_TAGS.includes(tag)) return;

      const level = parseInt(tag[1], 10);
      if (lastLevel > 0 && level > lastLevel + 1) {
        const loc = getLocation(opening);
        findings.push({
          ruleId: "heading-order",
          message: `Heading level skips from h${lastLevel} to h${level}.`,
          severity: "blocking",
          wcagCriteria: ["1.3.1"],
          line: loc.line,
          column: loc.column,
          element: tag,
          suggestion: `Use h${lastLevel + 1} instead of ${tag} to maintain logical heading order.`,
        });
      }
      lastLevel = level;
    });

    return findings;
  },
};
