import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  getTextContent,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags buttons whose aria-label omits visible text (WCAG 2.5.3). */
export const labelInNameRule: A11yRule = {
  id: "label-in-name",
  description: "Accessible names should include visible label text",
  wcagCriteria: ["2.5.3"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "button") return;
      if (!hasAttribute(opening, "aria-label")) return;

      const visibleText = getTextContent(path.node).trim();
      const ariaLabel = getAttributeValue(opening, "aria-label")?.trim();
      if (!visibleText || !ariaLabel) return;

      const visibleLower = visibleText.toLowerCase();
      const labelLower = ariaLabel.toLowerCase();
      if (labelLower.includes(visibleLower)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "label-in-name",
        message: `Button visible text "${visibleText}" is not included in aria-label="${ariaLabel}".`,
        severity: "blocking",
        wcagCriteria: ["2.5.3"],
        line: loc.line,
        column: loc.column,
        element: "button",
        suggestion:
          "Ensure aria-label starts with or contains the same words users see on screen.",
        fixSnippet: `<button aria-label="${visibleText} — additional context">${visibleText}</button>`,
      });
    });

    return findings;
  },
};
