import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getElementName, getLocation, getTextContent, walkJsxElements } from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/** Flags empty headings and labels (WCAG 2.4.6). */
export const emptyHeadingLabelRule: A11yRule = {
  id: "empty-heading-label",
  description: "Headings and labels must have discernible text",
  wcagCriteria: ["2.4.6"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag) return;
      if (!HEADING_TAGS.has(tag) && tag !== "label") return;

      const text = getTextContent(path.node);
      if (text.trim().length > 0) return;

      const loc = getLocation(opening);
      const isHeading = HEADING_TAGS.has(tag);
      findings.push({
        ruleId: "empty-heading-label",
        message: isHeading
          ? `<${tag}> has no visible text. Screen readers cannot announce an empty heading.`
          : "<label> has no visible text. Associated controls need a discernible label.",
        severity: "blocking",
        wcagCriteria: ["2.4.6"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion: isHeading
          ? "Add descriptive heading text that summarizes the section."
          : "Add visible label text that describes the form control.",
        fixSnippet: isHeading
          ? `<${tag}>Section title</${tag}>`
          : '<label htmlFor="field-id">Field label</label>',
      });
    });

    return findings;
  },
};
