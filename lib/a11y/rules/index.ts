import { imgAltRule, imgEmptyAltRule } from "./img-alt";
import { clickHandlerRule } from "./click-handler";
import { headingOrderRule } from "./heading-order";
import { formLabelRule } from "./form-label";
import { buttonNameRule } from "./button-name";
import { focusVisibleRule } from "./focus-visible";
import { contrastMinimumRule } from "./contrast-minimum";
import { targetSizeRule } from "./target-size";
import type { A11yRule } from "../types";

/** All static accessibility rules run against pasted TSX. */
export const ALL_RULES: A11yRule[] = [
  imgAltRule,
  imgEmptyAltRule,
  clickHandlerRule,
  headingOrderRule,
  formLabelRule,
  buttonNameRule,
  focusVisibleRule,
  contrastMinimumRule,
  targetSizeRule,
];

/** WCAG criterion IDs covered by at least one analyzer rule. */
export function getCriteriaWithRules(): Set<string> {
  const ids = new Set<string>();
  for (const rule of ALL_RULES) {
    for (const criterionId of rule.wcagCriteria) {
      ids.add(criterionId);
    }
  }
  return ids;
}

/** Total number of registered analyzer rules. */
export function getRuleCount(): number {
  return ALL_RULES.length;
}
