import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getElementName, getLocation, walkJsxElements } from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const LIST_TAGS = new Set(["ul", "ol"]);

/** Returns the parent list tag when the li is directly nested in ul/ol. */
function getParentListTag(path: NodePath<t.JSXElement>): string | null {
  const parent = path.parentPath;
  if (!parent?.isJSXElement()) return null;

  const parentTag = getElementName(parent.node.openingElement);
  return parentTag && LIST_TAGS.has(parentTag) ? parentTag : null;
}

/** Flags list items not inside ul or ol (WCAG 1.3.1). */
export const listStructureRule: A11yRule = {
  id: "list-structure",
  description: "List items must be contained in ul or ol elements",
  wcagCriteria: ["1.3.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "li") return;

      if (getParentListTag(path)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "list-structure",
        message: "<li> is not contained in a <ul> or <ol> element.",
        severity: "blocking",
        wcagCriteria: ["1.3.1"],
        line: loc.line,
        column: loc.column,
        element: "li",
        suggestion: "Wrap list items in a <ul> or <ol> parent element.",
        fixSnippet: `<ul>\n  <li>List item</li>\n</ul>`,
      });
    });

    return findings;
  },
};
