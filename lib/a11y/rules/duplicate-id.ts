import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Collects static id values and the elements that use them. */
function collectIdUsage(
  ast: t.File,
): Map<string, Array<{ node: t.Node; element: string }>> {
  const ids = new Map<string, Array<{ node: t.Node; element: string }>>();

  walkJsxElements(ast, (path: NodePath<t.JSXElement>) => {
    const opening = path.node.openingElement;
    const tag = getElementName(opening);
    if (!tag) return;

    const id = getAttributeValue(opening, "id");
    if (!id) return;

    const entries = ids.get(id) ?? [];
    entries.push({ node: opening, element: tag });
    ids.set(id, entries);
  });

  return ids;
}

/** Flags duplicate static id attribute values (WCAG 4.1.2). */
export const duplicateIdRule: A11yRule = {
  id: "duplicate-id",
  description: "Id attribute values must be unique",
  wcagCriteria: ["4.1.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    const idUsage = collectIdUsage(context.ast);

    for (const [id, usages] of idUsage) {
      if (usages.length < 2) continue;

      for (const usage of usages.slice(1)) {
        const loc = getLocation(usage.node);
        findings.push({
          ruleId: "duplicate-id",
          message: `Duplicate id="${id}" found. IDs must be unique in the document.`,
          severity: "blocking",
          wcagCriteria: ["4.1.2"],
          line: loc.line,
          column: loc.column,
          element: usage.element,
          suggestion:
            "Use a unique id for each element, or generate ids dynamically when rendering lists.",
          fixSnippet: `<${usage.element} id="${id}-unique">...</${usage.element}>`,
        });
      }
    }

    return findings;
  },
};
