import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getClassNames,
  getElementName,
  getInlineStyleProperties,
  getLocation,
  getTextContent,
  parseClassTokens,
  walkJsxElements,
} from "../ast-helpers";
import { mergeClassNameSnippet } from "../suggestion-snippets";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const TEXT_LIKE_TAGS = new Set([
  "p",
  "span",
  "a",
  "button",
  "label",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "td",
  "th",
  "div",
]);

const MIN_LINE_HEIGHT = 1.5;

const TIGHT_SPACING_CLASSES = new Set(["leading-none", "tracking-tighter"]);

/** Parses a numeric line-height from inline styles. */
function parseLineHeight(styles: Record<string, string>): number | null {
  const lineHeight = styles.lineHeight ?? styles.LineHeight;
  if (!lineHeight) return null;

  const numeric = Number.parseFloat(lineHeight);
  return Number.isFinite(numeric) ? numeric : null;
}

/** Flags text with spacing below WCAG 1.4.12 thresholds. */
export const textSpacingRule: A11yRule = {
  id: "text-spacing",
  description: "Text spacing must not be restricted below readable minimums",
  wcagCriteria: ["1.4.12"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || !TEXT_LIKE_TAGS.has(tag)) return;

      const classTokens = parseClassTokens(getClassNames(opening));
      const inlineStyles = getInlineStyleProperties(opening);
      const lineHeight = parseLineHeight(inlineStyles);

      const hasTightClass = classTokens.some((token) =>
        TIGHT_SPACING_CLASSES.has(token),
      );
      const hasTightLineHeight =
        lineHeight !== null && lineHeight < MIN_LINE_HEIGHT;

      if (!hasTightClass && !hasTightLineHeight) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "text-spacing",
        message: `<${tag}> restricts text spacing (leading-none, tracking-tighter, or line-height below 1.5).`,
        severity: "blocking",
        wcagCriteria: ["1.4.12"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Use leading-normal or leading-relaxed and avoid tracking-tighter.",
        fixSnippet: mergeClassNameSnippet(
          tag,
          classTokens.filter((token) => !TIGHT_SPACING_CLASSES.has(token)),
          ["leading-normal"],
          getTextContent(path.node) || "Readable text",
        ),
      });
    });

    return findings;
  },
};
