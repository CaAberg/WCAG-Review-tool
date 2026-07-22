import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getClassNames,
  getElementName,
  getLocation,
  getTextContent,
  parseClassTokens,
  walkJsxElements,
} from "../ast-helpers";
import { mergeClassNameSnippet } from "../suggestion-snippets";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const INTERACTIVE_TAGS = new Set(["button", "a", "input"]);

const SMALL_SIZE_PATTERN = /^(h-[1-5]|w-[1-5]|size-[1-5])$/;

const ADEQUATE_SIZE_PATTERN =
  /^(min-h-(6|7|8|9|10|11|12)|min-w-(6|7|8|9|10|11|12)|p-\d|px-\d|py-\d|p-\[\d+px\])$/;

function isInteractiveElement(
  tag: string | null,
  opening: t.JSXOpeningElement,
): boolean {
  if (!tag) return false;
  if (INTERACTIVE_TAGS.has(tag)) return true;
  const role = getAttributeValue(opening, "role");
  return role === "button";
}

function hasSmallFixedSize(classTokens: string[]): boolean {
  return classTokens.some((token) => SMALL_SIZE_PATTERN.test(token));
}

function hasAdequateTargetPadding(classTokens: string[]): boolean {
  return classTokens.some((token) => ADEQUATE_SIZE_PATTERN.test(token));
}

/** Flags interactive elements with touch targets smaller than 24×24 CSS px (WCAG 2.5.8). */
export const targetSizeRule: A11yRule = {
  id: "target-size",
  description: "Interactive targets should be at least 24×24 CSS pixels",
  wcagCriteria: ["2.5.8"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!isInteractiveElement(tag, opening)) return;

      const classTokens = parseClassTokens(getClassNames(opening));
      if (!hasSmallFixedSize(classTokens)) return;
      if (hasAdequateTargetPadding(classTokens)) return;

      const loc = getLocation(opening);
      const elementTag = tag ?? "button";
      findings.push({
        ruleId: "target-size",
        message: `<${elementTag}> may be too small to tap easily. Touch targets should be at least 24×24 CSS pixels.`,
        severity: "blocking",
        wcagCriteria: ["2.5.8"],
        line: loc.line,
        column: loc.column,
        element: elementTag,
        suggestion: "Increase the touch target with minimum size and padding classes.",
        fixSnippet: mergeClassNameSnippet(
          elementTag,
          classTokens,
          ["min-h-6", "min-w-6", "p-2"],
          getTextContent(path.node) || "Action",
        ),
      });
    });

    return findings;
  },
};
