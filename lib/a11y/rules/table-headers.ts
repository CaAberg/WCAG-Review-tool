import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getElementName, getLocation, walkJsxElements } from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Returns true when any descendant JSX element is a th. */
function hasTableHeader(element: t.JSXElement): boolean {
  for (const child of element.children) {
    if (!t.isJSXElement(child)) continue;

    const tag = getElementName(child.openingElement);
    if (tag === "th") return true;
    if (hasTableHeader(child)) return true;
  }

  return false;
}

/** Flags tables without header cells (WCAG 1.3.1). */
export const tableHeadersRule: A11yRule = {
  id: "table-headers",
  description: "Data tables must use th elements for headers",
  wcagCriteria: ["1.3.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "table") return;

      if (hasTableHeader(path.node)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "table-headers",
        message: "<table> has no <th> header cells.",
        severity: "blocking",
        wcagCriteria: ["1.3.1"],
        line: loc.line,
        column: loc.column,
        element: "table",
        suggestion: "Use <th> elements in the first row or column to label data.",
        fixSnippet: `<table>\n  <thead>\n    <tr>\n      <th scope="col">Column</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Data</td>\n    </tr>\n  </tbody>\n</table>`,
      });
    });

    return findings;
  },
};
