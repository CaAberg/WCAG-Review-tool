import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  getTextContent,
  hasAttribute,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const MEDIA_TAGS = new Set(["video", "audio"]);

/** Returns true when the element has a track child or transcript alternative. */
function hasMediaAlternative(element: t.JSXElement): boolean {
  if (hasAttribute(element.openingElement, "aria-describedby")) return true;

  for (const child of element.children) {
    if (!t.isJSXElement(child)) continue;

    const childTag = getElementName(child.openingElement);
    if (childTag === "track") return true;

    if (childTag === "a") {
      const linkText = getTextContent(child).toLowerCase();
      if (linkText.includes("transcript")) return true;
    }
  }

  return false;
}

/** Flags video/audio without a text alternative (WCAG 1.2.1, 1.2.3). */
export const mediaAlternativeRule: A11yRule = {
  id: "media-alternative",
  description: "Prerecorded media must provide a text alternative",
  wcagCriteria: ["1.2.1", "1.2.3"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag || !MEDIA_TAGS.has(tag)) return;

      if (hasMediaAlternative(path.node)) return;

      const loc = getLocation(opening);
      const src = getAttributeValue(opening, "src") ?? "...";
      findings.push({
        ruleId: "media-alternative",
        message: `<${tag}> has no track, transcript link, or aria-describedby alternative.`,
        severity: "blocking",
        wcagCriteria: ["1.2.1", "1.2.3"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Add a <track> element, a transcript link, or aria-describedby pointing to a transcript.",
        fixSnippet:
          tag === "video"
            ? `<video src="${src}" controls>\n  <track kind="captions" src="captions.vtt" />\n</video>\n<a href="/transcript">Read transcript</a>`
            : `<audio src="${src}" controls />\n<a href="/transcript">Read transcript</a>`,
      });
    });

    return findings;
  },
};
