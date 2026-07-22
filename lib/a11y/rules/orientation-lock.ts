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

const ORIENTATION_LOCK_CLASS_PATTERN =
  /(?:^|[-:])(?:portrait|landscape)(?:-only|-lock|-locked)?$|orientation-lock|lock-orientation/i;

/** Returns true when class tokens suggest orientation locking. */
function hasOrientationLockClasses(classTokens: string[]): boolean {
  return classTokens.some((token) =>
    ORIENTATION_LOCK_CLASS_PATTERN.test(token),
  );
}

/** Returns true when inline styles lock orientation. */
function hasOrientationLockStyle(
  styles: Record<string, string>,
): boolean {
  const orientation = styles.orientation ?? styles.Orientation;
  if (!orientation) return false;

  const normalized = orientation.toLowerCase();
  return normalized === "portrait" || normalized === "landscape";
}

/** Flags orientation lock patterns in styles or classes (WCAG 1.3.4). */
export const orientationLockRule: A11yRule = {
  id: "orientation-lock",
  description: "Content must not restrict display orientation",
  wcagCriteria: ["1.3.4"],
  severity: "blocking",
  check(context: RuleContext): A11yFinding[] {
    const findings: A11yFinding[] = [];
    if (!context.ast) return findings;

    walkJsxElements(context.ast, (path: NodePath<t.JSXElement>) => {
      const opening = path.node.openingElement;
      const tag = getElementName(opening) ?? "div";
      const classTokens = parseClassTokens(getClassNames(opening));
      const inlineStyles = getInlineStyleProperties(opening);

      const locksOrientation =
        hasOrientationLockClasses(classTokens) ||
        hasOrientationLockStyle(inlineStyles);

      if (!locksOrientation) return;

      const loc = getLocation(opening);
      findings.push({
        ruleId: "orientation-lock",
        message:
          "Element may lock content to a single orientation (portrait or landscape).",
        severity: "blocking",
        wcagCriteria: ["1.3.4"],
        line: loc.line,
        column: loc.column,
        element: tag,
        suggestion:
          "Remove orientation lock styles so content works in both portrait and landscape.",
        fixSnippet: mergeClassNameSnippet(
          tag,
          classTokens.filter(
            (token) => !ORIENTATION_LOCK_CLASS_PATTERN.test(token),
          ),
          ["w-full", "max-w-full"],
        ),
      });
    });

    return findings;
  },
};
