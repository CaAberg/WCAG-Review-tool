import { accesskeyRule } from "./accesskey";
import { ariaValidRule } from "./aria-valid";
import { audioAutoplayRule } from "./audio-autoplay";
import { autocompleteAttrRule } from "./autocomplete-attr";
import { buttonNameRule } from "./button-name";
import { bypassBlocksRule } from "./bypass-blocks";
import { clickHandlerRule } from "./click-handler";
import { contrastMinimumRule } from "./contrast-minimum";
import { dragAlternativeRule } from "./drag-alternative";
import { duplicateIdRule } from "./duplicate-id";
import { emptyHeadingLabelRule } from "./empty-heading-label";
import { errorIdentificationRule } from "./error-identification";
import { focusVisibleRule } from "./focus-visible";
import { formLabelRule } from "./form-label";
import { headingOrderRule } from "./heading-order";
import { iframeTitleRule } from "./iframe-title";
import { imgAltRule, imgEmptyAltRule } from "./img-alt";
import { inputImageAltRule } from "./input-image-alt";
import { interactiveTabindexRule } from "./interactive-tabindex";
import { labelInNameRule } from "./label-in-name";
import { landmarkOneMainRule } from "./landmark-one-main";
import { langPageRule } from "./lang-page";
import { langPartsRule } from "./lang-parts";
import { linkNameRule } from "./link-name";
import { linkPurposeRule } from "./link-purpose";
import { listStructureRule } from "./list-structure";
import { mediaAlternativeRule } from "./media-alternative";
import { motionActuationRule } from "./motion-actuation";
import { nonTextContrastRule } from "./non-text-contrast";
import { onFocusChangeRule } from "./on-focus-change";
import { onInputChangeRule } from "./on-input-change";
import { orientationLockRule } from "./orientation-lock";
import { pointerGesturesRule } from "./pointer-gestures";
import { reflowFixedWidthRule } from "./reflow-fixed-width";
import { requiredFieldRule } from "./required-field";
import { resizeTextRule } from "./resize-text";
import { statusMessagesRule } from "./status-messages";
import { svgAltRule } from "./svg-alt";
import { tableHeadersRule } from "./table-headers";
import { targetSizeRule } from "./target-size";
import { textSpacingRule } from "./text-spacing";
import { videoCaptionsRule } from "./video-captions";
import type { A11yRule } from "../types";

/** All static accessibility rules run against pasted TSX. */
export const ALL_RULES: A11yRule[] = [
  imgAltRule,
  imgEmptyAltRule,
  inputImageAltRule,
  svgAltRule,
  mediaAlternativeRule,
  videoCaptionsRule,
  headingOrderRule,
  tableHeadersRule,
  listStructureRule,
  landmarkOneMainRule,
  formLabelRule,
  requiredFieldRule,
  orientationLockRule,
  autocompleteAttrRule,
  audioAutoplayRule,
  contrastMinimumRule,
  nonTextContrastRule,
  resizeTextRule,
  reflowFixedWidthRule,
  textSpacingRule,
  clickHandlerRule,
  interactiveTabindexRule,
  accesskeyRule,
  bypassBlocksRule,
  focusVisibleRule,
  linkPurposeRule,
  emptyHeadingLabelRule,
  targetSizeRule,
  pointerGesturesRule,
  labelInNameRule,
  motionActuationRule,
  dragAlternativeRule,
  langPageRule,
  langPartsRule,
  onFocusChangeRule,
  onInputChangeRule,
  errorIdentificationRule,
  buttonNameRule,
  iframeTitleRule,
  duplicateIdRule,
  linkNameRule,
  ariaValidRule,
  statusMessagesRule,
];

/** WCAG criterion IDs covered by at least one static analyzer rule. */
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
