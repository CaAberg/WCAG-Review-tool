import {
  WCAG_CATALOG,
  WCAG_CATALOG_COUNT,
  WCAG_GUIDELINES,
} from "./wcag-catalog-data";
import type { WcagCriterion, WcagGuideline } from "./types";

/** WCAG 2.1/2.2 criteria indexed by ID. */
export const WCAG_CRITERIA: Record<string, WcagCriterion> = Object.fromEntries(
  WCAG_CATALOG.map((criterion) => [criterion.id, criterion]),
);

export { WCAG_CATALOG, WCAG_CATALOG_COUNT, WCAG_GUIDELINES };

/** Returns the guide path for a WCAG criterion ID. */
export function getGuidePath(criterionId: string): string {
  const criterion = WCAG_CRITERIA[criterionId];
  return criterion ? `/guides/${criterion.guideSlug}` : "/guides";
}

/** Returns all criteria in the catalog. */
export function getAllCriteria(): WcagCriterion[] {
  return WCAG_CATALOG;
}

/** Returns criteria grouped by guideline ID. */
export function getCriteriaByGuideline(): Map<string, WcagCriterion[]> {
  const grouped = new Map<string, WcagCriterion[]>();

  for (const criterion of WCAG_CATALOG) {
    const list = grouped.get(criterion.guidelineId) ?? [];
    list.push(criterion);
    grouped.set(criterion.guidelineId, list);
  }

  return grouped;
}

/** Returns a guideline by ID. */
export function getGuideline(guidelineId: string): WcagGuideline | undefined {
  return WCAG_GUIDELINES.find((guideline) => guideline.id === guidelineId);
}

/** WCAG criterion IDs checked at runtime via live preview. */
export const RUNTIME_WCAG_CRITERIA = new Set([
  "1.4.13",
  "2.1.2",
  "2.3.3",
  "2.4.3",
  "2.4.11",
  "2.4.12",
  "2.4.13",
  "2.5.2",
]);
