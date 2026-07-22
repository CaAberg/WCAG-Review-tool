import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getElementName,
  getLocation,
  getTextContent,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const GENERIC_LINK_TEXT = new Set([
  "click here",
  "read more",
  "here",
  "link",
  "learn more",
]);

/** Returns true when anchor text is a generic phrase. */
function isGenericLinkText(text: string): boolean {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, " ");
  return GENERIC_LINK_TEXT.has(normalized);
}

/** Flags anchors with non-descriptive link text (WCAG 2.4.4, 2.4.9). */
export const linkPurposeRule: A11yRule = {
  id: "link-purpose",
  description: "Link text should describe the destination or purpose",
  wcagCriteria: ["2.4.4", "2.4.9"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "a") return;

      const text = getTextContent(path.node);
      if (!text || !isGenericLinkText(text)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "link-purpose",
        message: `Link text "${text}" is too generic. Users cannot tell where the link goes.`,
        severity: "blocking",
        wcagCriteria: ["2.4.4", "2.4.9"],
        line: loc.line,
        column: loc.column,
        element: "a",
        suggestion:
          "Use descriptive link text that makes sense out of context, such as the page or action name.",
        fixSnippet: '<a href="/destination">View pricing details</a>',
      });
    });

    return findings;
  },
};
