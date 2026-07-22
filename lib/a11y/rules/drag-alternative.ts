import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getElementName,
  getLocation,
  hasAttribute,
  hasOnClick,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Flags drag-only interactions without keyboard or click alternatives (WCAG 2.5.7). */
export const dragAlternativeRule: A11yRule = {
  id: "drag-alternative",
  description: "Dragging actions need a single-pointer alternative",
  wcagCriteria: ["2.5.7"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag) return;
      if (!hasAttribute(opening, "onDragStart")) return;

      const hasAlternative =
        hasOnClick(opening) || hasAttribute(opening, "onKeyDown");
      if (hasAlternative) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "drag-alternative",
        message: `<${tag}> supports dragging but has no click or keyboard alternative.`,
        severity: "blocking",
        wcagCriteria: ["2.5.7"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Add buttons or keyboard handlers so users who cannot drag can complete the same action.",
        fixSnippet: `<${tag} draggable onDragStart={handleDrag}>\n  <button type="button" onClick={moveItemUp}>Move up</button>\n  <button type="button" onClick={moveItemDown}>Move down</button>\n</${tag}>`,
      });
    });

    return findings;
  },
};
