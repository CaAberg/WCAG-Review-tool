import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

const CAPTION_KINDS = new Set(["captions", "subtitles"]);

/** Returns true when the video has a captions or subtitles track. */
function hasCaptionsTrack(element: t.JSXElement): boolean {
  for (const child of element.children) {
    if (!t.isJSXElement(child)) continue;
    if (getElementName(child.openingElement) !== "track") continue;

    const kind = getAttributeValue(child.openingElement, "kind");
    if (kind && CAPTION_KINDS.has(kind)) return true;
  }
  return false;
}

/** Flags video without captions (WCAG 1.2.2). */
export const videoCaptionsRule: A11yRule = {
  id: "video-captions",
  description: "Prerecorded video must include captions",
  wcagCriteria: ["1.2.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (tag !== "video") return;

      if (hasCaptionsTrack(path.node)) return;

      const loc = getLocation(opening);
      const src = getAttributeValue(opening, "src") ?? "...";
      findings.push({
        ruleId: "video-captions",
        message: "<video> is missing a captions track.",
        severity: "blocking",
        wcagCriteria: ["1.2.2"],
        line: loc.line,
        column: loc.column,
        element: "video",
        suggestion:
          'Add a <track kind="captions"> element with synchronized captions.',
        fixSnippet: `<video src="${src}" controls>\n  <track kind="captions" src="captions.vtt" label="English" />\n</video>`,
      });
    });

    return findings;
  },
};
