import type { A11yFinding } from "../types";
import { checkFocusNotObscured } from "./focus-not-obscured";
import { checkFocusTrap } from "./focus-trap";
import { checkFocusOrder } from "./focus-order";
import { checkHoverFocusContent } from "./hover-focus-content";
import { checkReducedMotion } from "./reduced-motion";
import { checkFocusAppearance } from "./focus-appearance";
import { checkPointerCancellation } from "./pointer-cancellation";

/** Runs all live-preview accessibility checks against a mounted preview root. */
export function runRuntimeChecks(root: HTMLElement): A11yFinding[] {
  return [
    ...checkFocusNotObscured(root),
    ...checkFocusTrap(root),
    ...checkFocusOrder(root),
    ...checkHoverFocusContent(root),
    ...checkReducedMotion(root),
    ...checkFocusAppearance(root),
    ...checkPointerCancellation(root),
  ];
}
