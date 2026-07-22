import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getClassNames,
  getElementName,
  getInlineStyleProperties,
  getLocation,
  parseClassTokens,
  walkJsxElements,
} from "../ast-helpers";
import { mergeClassNameSnippet } from "../suggestion-snippets";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const REFLOW_MIN_WIDTH_PX = 320;

const MIN_WIDTH_CLASS_PATTERN = /^min-w-\[(\d+(?:\.\d+)?)px\]$/;
const WIDTH_CLASS_PATTERN = /^w-\[(\d+(?:\.\d+)?)px\]$/;

/** Parses a pixel width from inline style values. */
function parsePxWidth(value: string | undefined): number | null {
  if (!value) return null;

  const match = value.match(/^(\d+(?:\.\d+)?)px$/i);
  if (!match) return null;

  return Number.parseFloat(match[1]);
}

/** Returns the largest fixed min/width in pixels from class tokens. */
function getFixedWidthFromClasses(classTokens: string[]): number | null {
  let largest: number | null = null;

  for (const token of classTokens) {
    const match =
      token.match(MIN_WIDTH_CLASS_PATTERN) ?? token.match(WIDTH_CLASS_PATTERN);
    if (!match) continue;

    const width = Number.parseFloat(match[1]);
    if (largest === null || width > largest) largest = width;
  }

  return largest;
}

/** Flags fixed widths that may prevent reflow at 320px (WCAG 1.4.10). */
export const reflowFixedWidthRule: A11yRule = {
  id: "reflow-fixed-width",
  description: "Content must reflow without horizontal scrolling at 320px",
  wcagCriteria: ["1.4.10"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening) ?? "div";
      const classTokens = parseClassTokens(getClassNames(opening));
      const inlineStyles = getInlineStyleProperties(opening);

      const classWidth = getFixedWidthFromClasses(classTokens);
      const inlineWidth = Math.max(
        parsePxWidth(inlineStyles.width ?? inlineStyles.Width) ?? 0,
        parsePxWidth(inlineStyles.minWidth ?? inlineStyles.MinWidth) ?? 0,
      );
      const inlineFixedWidth = inlineWidth > 0 ? inlineWidth : null;

      const fixedWidth = Math.max(classWidth ?? 0, inlineFixedWidth ?? 0);
      if (fixedWidth < REFLOW_MIN_WIDTH_PX) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "reflow-fixed-width",
        message: `<${tag}> uses a fixed width of ${fixedWidth}px, which may cause horizontal scrolling on small screens.`,
        severity: "blocking",
        wcagCriteria: ["1.4.10"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Use responsive widths (w-full, max-w-*) instead of fixed pixel widths.",
        fixSnippet: mergeClassNameSnippet(
          tag,
          classTokens.filter(
            (token) =>
              !MIN_WIDTH_CLASS_PATTERN.test(token) &&
              !WIDTH_CLASS_PATTERN.test(token),
          ),
          ["w-full", "max-w-full"],
        ),
      });
    });

    return findings;
  },
};
