import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getElementName, getLocation, walkJsxElements } from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags pages with more than one main landmark (WCAG 1.3.1). */
export const landmarkOneMainRule: A11yRule = {
  id: "landmark-one-main",
  description: "Pages should contain only one main landmark",
  wcagCriteria: ["1.3.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    const mainElements: NodePath<t.JSXElement>[] = [];

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const tag = getElementName(path.node.openingElement);
      if (tag === "main") mainElements.push(path);
    });

    if (mainElements.length <= 1) return findings;

    for (let index = 1; index < mainElements.length; index++) {
      const path = mainElements[index];
      const loc = getLocation(path.node.openingElement);
      findings.push({
        ruleId: "landmark-one-main",
        message: "Document has multiple <main> landmarks.",
        severity: "blocking",
        wcagCriteria: ["1.3.1"],
        line: loc.line,
        column: loc.column,
        element: "main",
        suggestion:
          "Use a single <main> element per page. Replace extras with <section> or <div>.",
        fixSnippet: `<section aria-label="Secondary content">\n  {/* content */}\n</section>`,
      });
    }

    return findings;
  },
};
