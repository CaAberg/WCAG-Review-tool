import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getContrastRatio } from "../contrast-utils";
import { DESIGN_TOKEN_COLORS } from "../design-tokens";
import {
  getClassNames,
  getElementName,
  getInlineStyleProperties,
  getLocation,
  getTextContent,
  parseClassTokens,
  walkJsxElements,
} from "../ast-helpers";
import { replaceClassTokensSnippet } from "../suggestion-snippets";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Minimum contrast ratio for non-text UI components (WCAG 1.4.11 AA). */
const NON_TEXT_MIN_RATIO = 3;

const UI_COMPONENT_TAGS = new Set(["button", "input"]);

/** Returns true when border/background contrast likely fails 1.4.11. */
function failsNonTextContrast(
  borderColor: string,
  backgroundColor: string,
): boolean {
  const ratio = getContrastRatio(borderColor, backgroundColor);
  return ratio !== null && ratio < NON_TEXT_MIN_RATIO;
}

/** Flags low-contrast button borders (WCAG 1.4.11). */
export const nonTextContrastRule: A11yRule = {
  id: "non-text-contrast",
  description: "UI component boundaries must meet non-text contrast requirements",
  wcagCriteria: ["1.4.11"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || !UI_COMPONENT_TAGS.has(tag)) return;

      const classTokens = parseClassTokens(getClassNames(opening));
      const inlineStyles = getInlineStyleProperties(opening);

      const hasBorderBorder = classTokens.includes("border-border");
      const hasBgBackground = classTokens.includes("bg-background");

      if (!hasBorderBorder || !hasBgBackground) return;

      const borderColor =
        inlineStyles.borderColor ??
        inlineStyles.BorderColor ??
        DESIGN_TOKEN_COLORS["bg-border"];
      const backgroundColor =
        inlineStyles.backgroundColor ??
        inlineStyles.background ??
        inlineStyles.BackgroundColor ??
        DESIGN_TOKEN_COLORS["bg-background"];
      if (!failsNonTextContrast(borderColor, backgroundColor)) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "non-text-contrast",
        message: `<${tag}> border may not meet the 3:1 non-text contrast minimum (border-border on bg-background).`,
        severity: "blocking",
        wcagCriteria: ["1.4.11"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Use a higher-contrast border color against the background.",
        fixSnippet: replaceClassTokensSnippet(
          tag,
          classTokens,
          {
            "border-border": "border-foreground",
            "bg-background": "bg-background",
          },
          getTextContent(path.node) || "Action",
        ),
      });
    });

    return findings;
  },
};
