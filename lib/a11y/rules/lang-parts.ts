import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getElementName,
  getLocation,
  getTextContent,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const LANG_PART_TAGS = new Set(["span", "p"]);

/** Returns true when text appears to contain non-ASCII characters. */
function hasNonAsciiText(text: string): boolean {
  return /[^\u0000-\u007F]/.test(text);
}

/** Flags inline blocks with non-ASCII text but no lang attribute (WCAG 3.1.2). */
export const langPartsRule: A11yRule = {
  id: "lang-parts",
  description: "Passages in another language should declare lang",
  wcagCriteria: ["3.1.2"],
  severity: "enhancement",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || !LANG_PART_TAGS.has(tag)) return;
      if (hasAttribute(opening, "lang")) return;

      const text = getTextContent(path.node);
      if (!hasNonAsciiText(text)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "lang-parts",
        message: `<${tag}> contains non-ASCII text but no lang attribute.`,
        severity: "enhancement",
        wcagCriteria: ["3.1.2"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          'Add lang to identify the language of this passage, for example lang="es".',
        fixSnippet: `<${tag} lang="es">${text.trim() || "Texto en otro idioma"}</${tag}>`,
      });
    });

    return findings;
  },
};
