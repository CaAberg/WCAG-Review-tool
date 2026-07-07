import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import type { File } from "@babel/types";
import traverse from "@babel/traverse";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const FORM_INPUTS = new Set(["input", "select", "textarea"]);

/** Collects id attributes from label htmlFor in the AST. */
function collectLabelForIds(ast: File): Set<string> {
  const ids = new Set<string>();

  traverse(ast, {
    JSXElement(path) {
      const tag = getElementName(path.node.openingElement);
      if (tag !== "label") return;

      const htmlFor = getAttributeValue(path.node.openingElement, "htmlFor");
      if (htmlFor) ids.add(htmlFor);
    },
  });

  return ids;
}

/** Flags form inputs without associated labels (WCAG 1.3.1, 3.3.2). */
export const formLabelRule: A11yRule = {
  id: "label",
  description: "Form elements must have labels",
  wcagCriteria: ["1.3.1", "3.3.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    const labelForIds = collectLabelForIds(context.ast);

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || !FORM_INPUTS.has(tag)) return;

      const inputType = getAttributeValue(opening, "type");
      if (tag === "input" && inputType === "hidden") return;

      const id = getAttributeValue(opening, "id");
      const hasAriaLabel = hasAttribute(opening, "aria-label");
      const hasAriaLabelledBy = hasAttribute(opening, "aria-labelledby");
      const wrappedInLabel = path.parentPath?.isJSXElement()
        ? getElementName(path.parentPath.node.openingElement) === "label"
        : false;

      const hasAssociatedLabel =
        wrappedInLabel ||
        hasAriaLabel ||
        hasAriaLabelledBy ||
        (id !== null && labelForIds.has(id));

      if (!hasAssociatedLabel) {
        const loc = getLocation(opening);
        findings.push({
          ruleId: "label",
          message: `<${tag}> is missing an associated label.`,
          severity: "blocking",
          wcagCriteria: ["1.3.1", "3.3.2"],
          line: loc.line,
          column: loc.column,
          element: tag,
          suggestion: `<label htmlFor="field-id">Label</label>\n<${tag} id="field-id" />`,
        });
      }
    });

    return findings;
  },
};
