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

const MIN_FONT_SIZE_PX = 12;

const TEXT_SIZE_CLASS_PATTERN = /^text-\[(\d+(?:\.\d+)?)px\]$/;

/** Parses a font size value in pixels from inline styles. */
function parseFontSizePx(styles: Record<string, string>): number | null {
  const fontSize = styles.fontSize ?? styles.FontSize;
  if (!fontSize) return null;

  const match = fontSize.match(/^(\d+(?:\.\d+)?)px$/i);
  if (!match) return null;

  return Number.parseFloat(match[1]);
}

/** Returns the smallest fixed text-[Npx] size from class tokens. */
function getSmallestTextSizeClass(classTokens: string[]): number | null {
  let smallest: number | null = null;

  for (const token of classTokens) {
    const match = token.match(TEXT_SIZE_CLASS_PATTERN);
    if (!match) continue;

    const size = Number.parseFloat(match[1]);
    if (smallest === null || size < smallest) smallest = size;
  }

  return smallest;
}

/** Flags text sized below 12px (WCAG 1.4.4). */
export const resizeTextRule: A11yRule = {
  id: "resize-text",
  description: "Text must be resizable up to 200% without loss of content",
  wcagCriteria: ["1.4.4"],
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
      const classSize = getSmallestTextSizeClass(classTokens);
      const inlineSize = parseFontSizePx(inlineStyles);

      const tooSmallClass = classSize !== null && classSize < MIN_FONT_SIZE_PX;
      const tooSmallInline =
        inlineSize !== null && inlineSize < MIN_FONT_SIZE_PX;

      if (!tooSmallClass && !tooSmallInline) return;

      const loc = getLocation(opening);
      const detectedSize = tooSmallInline ? inlineSize : classSize;
      findings.push({
        ruleId: "resize-text",
        message: `<${tag}> uses text smaller than ${MIN_FONT_SIZE_PX}px (${detectedSize}px), which may not resize well.`,
        severity: "blocking",
        wcagCriteria: ["1.4.4"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion: `Use at least text-sm (${MIN_FONT_SIZE_PX}px) or relative units like rem.`,
        fixSnippet: mergeClassNameSnippet(
          tag,
          classTokens.filter((token) => !TEXT_SIZE_CLASS_PATTERN.test(token)),
          ["text-sm"],
          getTextContent(path.node) || "Readable text",
        ),
      });
    });

    return findings;
  },
};
