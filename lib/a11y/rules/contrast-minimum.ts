import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  failsContrastMinimum,
  getContrastRatio,
  isLargeTextClass,
} from "../contrast-utils";
import {
  findBackgroundTokenColor,
  findTextTokenColor,
} from "../design-tokens";
import {
  findFailingTailwindPair,
} from "../tailwind-contrast-pairs";
import {
  getClassNames,
  getElementName,
  getInlineStyleProperties,
  getLocation,
  getTextContent,
  parseClassTokens,
  walkJsxElements,
} from "../ast-helpers";
import {
  inlineContrastFixSnippet,
  replaceClassTokensSnippet,
} from "../suggestion-snippets";
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

/** Flags likely low-contrast text from inline styles or known Tailwind pairs (WCAG 1.4.3). */
export const contrastMinimumRule: A11yRule = {
  id: "contrast-minimum",
  description: "Text must meet minimum color contrast requirements",
  wcagCriteria: ["1.4.3"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || !TEXT_LIKE_TAGS.has(tag)) return;

      const classNames = getClassNames(opening);
      const classTokens = parseClassTokens(classNames);
      const isLargeText = isLargeTextClass(classNames);
      const loc = getLocation(opening);

      const inlineStyles = getInlineStyleProperties(opening);
      const foreground =
        inlineStyles.color ?? inlineStyles.Color ?? null;
      const background =
        inlineStyles.backgroundColor ??
        inlineStyles.background ??
        inlineStyles.BackgroundColor ??
        null;

      if (foreground && background) {
        if (failsContrastMinimum(foreground, background, isLargeText)) {
          findings.push({
            ruleId: "contrast-minimum",
            message: `<${tag}> text may not meet the 4.5:1 contrast minimum. Low-contrast text is hard to read for users with low vision.`,
            severity: "blocking",
            wcagCriteria: ["1.4.3"],
            line: loc.line,
            column: loc.column,
            element: tag,
            suggestion: "Use higher-contrast foreground and background colors.",
            fixSnippet: inlineContrastFixSnippet(tag, getTextContent(path.node)),
          });
          return;
        }
      }

      const failingPair = findFailingTailwindPair(classTokens);
      if (failingPair) {
        findings.push({
          ruleId: "contrast-minimum",
          message: `<${tag}> likely has low contrast (${failingPair.textClass} on ${failingPair.bgClass}). Low-contrast text is hard to read for users with low vision.`,
          severity: "blocking",
          wcagCriteria: ["1.4.3"],
          line: loc.line,
          column: loc.column,
          element: tag,
          suggestion: "Replace low-contrast text and background utility classes.",
          fixSnippet: replaceClassTokensSnippet(
            tag,
            classTokens,
            {
              [failingPair.textClass]: "text-foreground",
              [failingPair.bgClass]: "bg-background",
            },
            getTextContent(path.node),
          ),
        });
        return;
      }

      const textToken = findTextTokenColor(classTokens);
      const bgToken = findBackgroundTokenColor(classTokens);
      if (textToken && bgToken) {
        const ratio = getContrastRatio(textToken.hex, bgToken.hex);
        if (
          ratio !== null &&
          failsContrastMinimum(textToken.hex, bgToken.hex, isLargeText)
        ) {
          findings.push({
            ruleId: "contrast-minimum",
            message: `<${tag}> likely has low contrast (${textToken.tokenClass} on ${bgToken.tokenClass}, ${ratio.toFixed(1)}:1). Low-contrast text is hard to read for users with low vision.`,
            severity: "blocking",
            wcagCriteria: ["1.4.3"],
            line: loc.line,
            column: loc.column,
            element: tag,
            suggestion: "Replace low-contrast semantic token classes.",
            fixSnippet: replaceClassTokensSnippet(
              tag,
              classTokens,
              {
                [textToken.tokenClass]: "text-foreground",
                [bgToken.tokenClass]: "bg-background",
              },
              getTextContent(path.node),
            ),
          });
        }
      }
    });

    return findings;
  },
};
