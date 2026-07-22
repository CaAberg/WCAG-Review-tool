import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const MEDIA_TAGS = new Set(["video", "audio"]);

/** Returns true when the element has autoplay enabled. */
function hasAutoplay(opening: t.JSXOpeningElement): boolean {
  if (hasAttribute(opening, "autoPlay") || hasAttribute(opening, "autoplay")) {
    return true;
  }

  const autoPlayValue = getAttributeValue(opening, "autoPlay");
  const autoplayValue = getAttributeValue(opening, "autoplay");
  return autoPlayValue === "true" || autoplayValue === "true";
}

/** Flags autoplaying media without user controls (WCAG 1.4.2). */
export const audioAutoplayRule: A11yRule = {
  id: "audio-autoplay",
  description: "Autoplaying media must not play sound without user control",
  wcagCriteria: ["1.4.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || !MEDIA_TAGS.has(tag)) return;

      if (!hasAutoplay(opening)) return;
      if (hasAttribute(opening, "controls")) return;

      const loc = getLocation(opening);
      const src = getAttributeValue(opening, "src") ?? "...";
      findings.push({
        ruleId: "audio-autoplay",
        message: `<${tag}> autoplays without controls, which can surprise users with unexpected sound.`,
        severity: "blocking",
        wcagCriteria: ["1.4.2"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Remove autoPlay or add controls so users can pause playback.",
        fixSnippet: `<${tag} src="${src}" controls />`,
      });
    });

    return findings;
  },
};
