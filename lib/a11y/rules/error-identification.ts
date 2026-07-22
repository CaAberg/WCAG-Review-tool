import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getElementName,
  getLocation,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags invalid fields without an error description reference (WCAG 3.3.1). */
export const errorIdentificationRule: A11yRule = {
  id: "error-identification",
  description: "Invalid fields should reference their error message",
  wcagCriteria: ["3.3.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag) return;
      if (!hasAttribute(opening, "aria-invalid")) return;
      if (hasAttribute(opening, "aria-describedby")) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "error-identification",
        message: `<${tag}> is marked aria-invalid but has no aria-describedby pointing to the error text.`,
        severity: "blocking",
        wcagCriteria: ["3.3.1"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          'Link the field to its error message with aria-describedby="field-error".',
        fixSnippet:
          '<input id="email" aria-invalid="true" aria-describedby="email-error" />\n<p id="email-error">Enter a valid email address.</p>',
      });
    });

    return findings;
  },
};
