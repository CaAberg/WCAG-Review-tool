import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getElementName, getLocation, walkJsxElements } from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const TABINDEX_TAGS = new Set(["button", "a", "input"]);

/** Returns true when tabIndex is statically set to -1. */
function isTabIndexNegativeOne(opening: t.JSXOpeningElement): boolean {
  const attr = opening.attributes.find((a) => {
    if (!t.isJSXAttribute(a)) return false;
    return t.isJSXIdentifier(a.name) && a.name.name === "tabIndex";
  });

  if (!attr || !t.isJSXAttribute(attr) || !attr.value) return false;
  if (!t.isJSXExpressionContainer(attr.value)) return false;

  const expr = attr.value.expression;
  if (t.isNumericLiteral(expr) && expr.value === -1) return true;
  if (
    t.isUnaryExpression(expr) &&
    expr.operator === "-" &&
    t.isNumericLiteral(expr.argument) &&
    expr.argument.value === 1
  ) {
    return true;
  }

  return false;
}

/** Flags native interactive elements removed from tab order (WCAG 2.1.1, 4.1.2). */
export const interactiveTabindexRule: A11yRule = {
  id: "interactive-tabindex",
  description: "Native interactive elements should not use tabIndex={-1}",
  wcagCriteria: ["2.1.1", "4.1.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || !TABINDEX_TAGS.has(tag)) return;
      if (!isTabIndexNegativeOne(opening)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "interactive-tabindex",
        message: `<${tag}> uses tabIndex={-1}, removing it from the keyboard tab order.`,
        severity: "blocking",
        wcagCriteria: ["2.1.1", "4.1.2"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Remove tabIndex={-1} or use a non-interactive element if this should not receive keyboard focus.",
        fixSnippet: `<${tag}>Accessible action</${tag}>`,
      });
    });

    return findings;
  },
};
