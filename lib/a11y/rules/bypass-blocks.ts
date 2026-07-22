import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

type LayoutScan = {
  hasSkipLink: boolean;
  hasMainId: boolean;
  hasNavAndMain: boolean;
  sectionCount: number;
  reportNode: t.Node | null;
  reportElement: string;
};

/** Scans the AST for skip-link and landmark layout patterns. */
function scanLayout(context: RuleContext): LayoutScan {
  const scan: LayoutScan = {
    hasSkipLink: false,
    hasMainId: false,
    hasNavAndMain: false,
    sectionCount: 0,
    reportNode: null,
    reportElement: "layout",
  };

  if (!context.ast) return scan;

  let hasNav = false;
  let hasMain = false;

  walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
    const opening = path.node.openingElement;
    const tag = getElementName(opening);
    if (!tag) return;

    const id = getAttributeValue(opening, "id");
    const href = getAttributeValue(opening, "href");

    if (id === "main") scan.hasMainId = true;
    if (tag === "a" && href === "#main") scan.hasSkipLink = true;

    if (tag === "nav") hasNav = true;
    if (tag === "main") hasMain = true;

    if (tag === "section") {
      scan.sectionCount += 1;
      if (!scan.reportNode) {
        scan.reportNode = opening;
        scan.reportElement = "section";
      }
    }

    if (tag === "nav" && !scan.reportNode) {
      scan.reportNode = opening;
      scan.reportElement = "nav";
    }
  });

  scan.hasNavAndMain = hasNav && hasMain;
  return scan;
}

/** Flags page layouts missing a bypass mechanism (WCAG 2.4.1). */
export const bypassBlocksRule: A11yRule = {
  id: "bypass-blocks",
  description: "Pages with repeated navigation should provide a skip link",
  wcagCriteria: ["2.4.1"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    const scan = scanLayout(context);
    const looksLikeMultiBlockLayout =
      scan.hasNavAndMain || scan.sectionCount >= 2;

    if (!looksLikeMultiBlockLayout) return findings;
    if (scan.hasSkipLink || scan.hasMainId) return findings;

    const loc = getLocation(scan.reportNode ?? context.ast);
    findings.push({
      ruleId: "bypass-blocks",
      message:
        "Layout appears to have repeated blocks but no skip link to main content.",
      severity: "blocking",
      wcagCriteria: ["2.4.1"],
      line: loc.line,
      column: loc.column,
      element: scan.reportElement,
      suggestion:
        'Add a skip link such as <a href="#main">Skip to main content</a> and a main landmark with id="main".',
      fixSnippet:
        '<a href="#main" className="sr-only focus:not-sr-only">Skip to main content</a>\n<main id="main">...</main>',
    });

    return findings;
  },
};
