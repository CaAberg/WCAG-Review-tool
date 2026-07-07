import { imgAltRule, imgEmptyAltRule } from "./img-alt";
import { clickHandlerRule } from "./click-handler";
import { headingOrderRule } from "./heading-order";
import { formLabelRule } from "./form-label";
import { buttonNameRule } from "./button-name";
import { focusVisibleRule } from "./focus-visible";
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
];
