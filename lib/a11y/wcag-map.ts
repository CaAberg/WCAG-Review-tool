import type { WcagCriterion } from "./types";

/** WCAG 2.2 criteria referenced by guides and static analysis rules. */
export const WCAG_CRITERIA: Record<string, WcagCriterion> = {
  "1.1.1": {
    id: "1.1.1",
    name: "Non-text Content",
    level: "A",
    description:
      "All non-text content that is presented to the user has a text alternative that serves the equivalent purpose.",
    guideSlug: "1-1-1-non-text-content",
  },
  "1.3.1": {
    id: "1.3.1",
    name: "Info and Relationships",
    level: "A",
    description:
      "Information, structure, and relationships conveyed through presentation can be programmatically determined.",
    guideSlug: "1-3-1-info-and-relationships",
  },
  "1.4.3": {
    id: "1.4.3",
    name: "Contrast (Minimum)",
    level: "AA",
    description:
      "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.",
    guideSlug: "1-4-3-contrast-minimum",
  },
  "2.1.1": {
    id: "2.1.1",
    name: "Keyboard",
    level: "A",
    description:
      "All functionality of the content is operable through a keyboard interface.",
    guideSlug: "2-1-1-keyboard",
  },
  "2.4.7": {
    id: "2.4.7",
    name: "Focus Visible",
    level: "AA",
    description:
      "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.",
    guideSlug: "2-4-7-focus-visible",
  },
  "2.4.11": {
    id: "2.4.11",
    name: "Focus Not Obscured (Minimum)",
    level: "AA",
    description:
      "When a user interface component receives keyboard focus, the component is not entirely hidden by author-created content.",
    guideSlug: "2-4-11-focus-not-obscured",
  },
  "2.5.8": {
    id: "2.5.8",
    name: "Target Size (Minimum)",
    level: "AA",
    description:
      "Target size for pointer inputs is at least 24 by 24 CSS pixels, except where spacing or equivalent alternatives apply.",
    guideSlug: "2-5-8-target-size-minimum",
  },
  "3.2.6": {
    id: "3.2.6",
    name: "Consistent Help",
    level: "A",
    description:
      "Help mechanisms are available in the same relative order on each page within a set of web pages.",
    guideSlug: "3-2-6-consistent-help",
  },
  "3.3.2": {
    id: "3.3.2",
    name: "Labels or Instructions",
    level: "A",
    description:
      "Labels or instructions are provided when content requires user input.",
    guideSlug: "3-3-2-labels-or-instructions",
  },
  "4.1.2": {
    id: "4.1.2",
    name: "Name, Role, Value",
    level: "A",
    description:
      "For all user interface components, the name and role can be programmatically determined.",
    guideSlug: "4-1-2-name-role-value",
  },
};

/** Returns the guide path for a WCAG criterion ID. */
export function getGuidePath(criterionId: string): string {
  const criterion = WCAG_CRITERIA[criterionId];
  return criterion ? `/guides/${criterion.guideSlug}` : "/guides";
}

/** Returns all criteria covered by guides. */
export function getAllCriteria(): WcagCriterion[] {
  return Object.values(WCAG_CRITERIA);
}
