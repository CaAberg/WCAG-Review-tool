import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getClassNames,
  getElementName,
  getLocation,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const STATUS_CLASS_PATTERN = /(?:^|\s)(?:toast|alert|success|error)(?:\s|$)/i;
const LIVE_ROLES = new Set(["status", "alert"]);

/** Returns true when className suggests a status or alert message. */
function looksLikeStatusMessage(classNames: string): boolean {
  return STATUS_CLASS_PATTERN.test(classNames);
}

/** Returns true when the element exposes status semantics to assistive tech. */
function hasStatusSemantics(opening: t.JSXOpeningElement): boolean {
  if (hasAttribute(opening, "aria-live")) return true;

  const role = getAttributeValue(opening, "role")?.toLowerCase();
  return role !== undefined && LIVE_ROLES.has(role);
}

/** Flags status-like messages missing live region semantics (WCAG 4.1.3). */
export const statusMessagesRule: A11yRule = {
  id: "status-messages",
  description: "Status messages should use role or aria-live",
  wcagCriteria: ["4.1.3"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "div" && tag !== "span") return;

      const classNames = getClassNames(opening);
      if (!looksLikeStatusMessage(classNames)) return;
      if (hasStatusSemantics(opening)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "status-messages",
        message: `<${tag}> looks like a status message but lacks role="status"/role="alert" or aria-live.`,
        severity: "blocking",
        wcagCriteria: ["4.1.3"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          'Use role="status" or aria-live="polite" so assistive technologies announce updates.',
        fixSnippet: `<${tag} role="status" aria-live="polite">Saved successfully</${tag}>`,
      });
    });

    return findings;
  },
};
