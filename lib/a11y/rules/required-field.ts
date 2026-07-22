import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import type { File } from "@babel/types";
import traverse from "@babel/traverse";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  getTextContent,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const REQUIRED_INPUTS = new Set(["input", "select", "textarea"]);

/** Returns true when a JSX attribute is present as a boolean flag. */
function hasBooleanAttribute(
  opening: t.JSXOpeningElement,
  attrName: string,
): boolean {
  return opening.attributes.some((attr) => {
    if (!t.isJSXAttribute(attr)) return false;
    if (!t.isJSXIdentifier(attr.name) || attr.name.name !== attrName) {
      return false;
    }
    if (!attr.value) return true;
    if (t.isJSXExpressionContainer(attr.value)) {
      const expr = attr.value.expression;
      if (t.isBooleanLiteral(expr)) return expr.value;
    }
    return true;
  });
}

/** Maps label htmlFor values to label text content. */
function collectLabelTextByFor(ast: File): Map<string, string> {
  const labels = new Map<string, string>();

  traverse(ast, {
    JSXElement(path) {
      const tag = getElementName(path.node.openingElement);
      if (tag !== "label") return;

      const htmlFor = getAttributeValue(path.node.openingElement, "htmlFor");
      if (!htmlFor) return;

      labels.set(htmlFor, getTextContent(path.node));
    },
  });

  return labels;
}

/** Returns true when label text visibly marks the field as required. */
function labelShowsRequired(labelText: string): boolean {
  const normalized = labelText.trim().toLowerCase();
  return normalized.includes("required") || labelText.includes("*");
}

/** Returns associated label text for a form control, if known. */
function getAssociatedLabelText(
  path: NodePath<t.JSXElement>,
  labelByFor: Map<string, string>,
): string | null {
  const opening = path.node.openingElement;
  const id = getAttributeValue(opening, "id");

  if (id && labelByFor.has(id)) {
    return labelByFor.get(id) ?? null;
  }

  const parent = path.parentPath;
  if (parent?.isJSXElement()) {
    const parentTag = getElementName(parent.node.openingElement);
    if (parentTag === "label") {
      return getTextContent(parent.node);
    }
  }

  return null;
}

/** Flags required fields without programmatic or visible required indicators (WCAG 3.3.2). */
export const requiredFieldRule: A11yRule = {
  id: "required-field",
  description: "Required fields should expose required state to assistive technologies",
  wcagCriteria: ["3.3.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    const labelByFor = collectLabelTextByFor(context.ast);

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || !REQUIRED_INPUTS.has(tag)) return;
      if (!hasBooleanAttribute(opening, "required")) return;
      if (hasBooleanAttribute(opening, "aria-required")) return;

      const labelText = getAssociatedLabelText(path, labelByFor);
      if (labelText && labelShowsRequired(labelText)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "required-field",
        message: `<${tag}> is required but lacks aria-required and a visible required indicator in its label.`,
        severity: "blocking",
        wcagCriteria: ["3.3.2"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          'Add aria-required="true" and mark the label with "(required)" or an asterisk.',
        fixSnippet:
          '<label htmlFor="name">Name (required)</label>\n<input id="name" required aria-required="true" />',
      });
    });

    return findings;
  },
};
