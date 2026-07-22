import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getAttributeValue,
  getElementName,
  getLocation,
  walkJsxElements,
} from "../ast-helpers";
import type { A11yFinding, A11yRule, RuleContext } from "../types";

/** Common valid WAI-ARIA roles used in React apps. */
const VALID_ROLES = new Set([
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "button",
  "cell",
  "checkbox",
  "columnheader",
  "combobox",
  "complementary",
  "contentinfo",
  "definition",
  "dialog",
  "directory",
  "document",
  "feed",
  "figure",
  "form",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "navigation",
  "none",
  "note",
  "option",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "region",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem",
]);

/** Flags unknown role attribute values (WCAG 4.1.2). */
export const ariaValidRule: A11yRule = {
  id: "aria-valid",
  description: "ARIA role values must be valid",
  wcagCriteria: ["4.1.2"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening);
      if (!tag) return;

      const role = getAttributeValue(opening, "role");
      if (!role) return;
      if (VALID_ROLES.has(role.toLowerCase())) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "aria-valid",
        message: `<${tag}> uses invalid role="${role}".`,
        severity: "blocking",
        wcagCriteria: ["4.1.2"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Use a valid WAI-ARIA role or remove the role attribute if it is not needed.",
        fixSnippet: `<${tag} role="button">Action</${tag}>`,
      });
    });

    return findings;
  },
};
