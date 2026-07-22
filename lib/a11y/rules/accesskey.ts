import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getElementName, getAttributeValue, getLocation, walkJsxElements } from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags single-character accessKey shortcuts (WCAG 2.1.4). */
export const accesskeyRule: A11yRule = {
  id: "accesskey",
  description: "Avoid single-character accessKey shortcuts",
  wcagCriteria: ["2.1.4"],
  severity: "enhancement",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag) return;

      const accessKey = getAttributeValue(opening, "accessKey");
      if (!accessKey || accessKey.length !== 1) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "accesskey",
        message: `<${tag}> uses accessKey="${accessKey}", which may conflict with browser or assistive technology shortcuts.`,
        severity: "enhancement",
        wcagCriteria: ["2.1.4"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Remove accessKey or use a longer, documented shortcut that does not conflict with user agent keys.",
        fixSnippet: `<${tag}>Action</${tag}>`,
      });
    });

    return findings;
  },
};
