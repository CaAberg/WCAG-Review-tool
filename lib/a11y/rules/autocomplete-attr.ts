import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const AUTOCOMPLETE_TYPES = new Set(["email", "password", "tel"]);

const NAME_FIELD_PATTERN = /(?:^|[-_])(?:name|fname|lname|firstname|lastname)(?:$|[-_])/i;

/** Returns the expected autocomplete token for an input, if applicable. */
function expectedAutocomplete(
  inputType: string | null,
  name: string | null,
  id: string | null,
): string | null {
  if (inputType && AUTOCOMPLETE_TYPES.has(inputType)) {
    if (inputType === "password") return "current-password";
    return inputType;
  }

  if (inputType === "text" || inputType === null) {
    const identifier = `${name ?? ""} ${id ?? ""}`;
    if (NAME_FIELD_PATTERN.test(identifier)) return "name";
  }

  return null;
}

/** Flags common inputs missing autocomplete attributes (WCAG 1.3.5). */
export const autocompleteAttrRule: A11yRule = {
  id: "autocomplete-attr",
  description: "Identifiable inputs must include autocomplete attributes",
  wcagCriteria: ["1.3.5"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "input") return;

      const inputType = getAttributeValue(opening, "type");
      const name = getAttributeValue(opening, "name");
      const id = getAttributeValue(opening, "id");
      const expected = expectedAutocomplete(inputType, name, id);

      if (!expected) return;
      if (
        hasAttribute(opening, "autocomplete") ||
        hasAttribute(opening, "autoComplete")
      ) {
        return;
      }

      const loc = getLocation(opening);
      const typeAttr = inputType ? ` type="${inputType}"` : "";
      findings.push({
        ruleId: "autocomplete-attr",
        message: `<input> is missing an autocomplete attribute for a ${expected} field.`,
        severity: "blocking",
        wcagCriteria: ["1.3.5"],
        line: loc.line,
        column: loc.column,
        element: "input",
        suggestion: `Add autocomplete="${expected}" so browsers can assist users.`,
        fixSnippet: `<input${typeAttr} autocomplete="${expected}" />`,
      });
    });

    return findings;
  },
};
