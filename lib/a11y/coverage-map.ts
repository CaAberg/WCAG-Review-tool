import { WCAG_CATALOG } from "./wcag-catalog-data";

export type CoverageStatus = "static" | "runtime" | "manual";

export type CriterionCoverage = {
  criterionId: string;
  status: CoverageStatus;
  ruleIds?: string[];
  /** Tags used to suggest manual checks when component patterns match. */
  componentTags?: string[];
};

/** Maps each criterion to static, runtime, or manual coverage. */
export const CRITERION_COVERAGE: Record<string, CriterionCoverage> = {
  "1.1.1": { criterionId: "1.1.1", status: "static", ruleIds: ["image-alt", "image-redundant-alt", "svg-alt", "input-image-alt"] },
  "1.2.1": { criterionId: "1.2.1", status: "static", ruleIds: ["media-alternative"], componentTags: ["video", "audio"] },
  "1.2.2": { criterionId: "1.2.2", status: "static", ruleIds: ["video-captions"], componentTags: ["video"] },
  "1.2.3": { criterionId: "1.2.3", status: "manual", componentTags: ["video"] },
  "1.2.4": { criterionId: "1.2.4", status: "manual", componentTags: ["video"] },
  "1.2.5": { criterionId: "1.2.5", status: "manual", componentTags: ["video"] },
  "1.2.6": { criterionId: "1.2.6", status: "manual", componentTags: ["video"] },
  "1.2.7": { criterionId: "1.2.7", status: "manual", componentTags: ["video"] },
  "1.2.8": { criterionId: "1.2.8", status: "manual", componentTags: ["video", "audio"] },
  "1.2.9": { criterionId: "1.2.9", status: "manual", componentTags: ["audio"] },
  "1.3.1": { criterionId: "1.3.1", status: "static", ruleIds: ["heading-order", "label", "table-headers", "list-structure", "landmark-one-main"] },
  "1.3.2": { criterionId: "1.3.2", status: "manual" },
  "1.3.3": { criterionId: "1.3.3", status: "manual" },
  "1.3.4": { criterionId: "1.3.4", status: "static", ruleIds: ["orientation-lock"] },
  "1.3.5": { criterionId: "1.3.5", status: "static", ruleIds: ["autocomplete-attr"] },
  "1.3.6": { criterionId: "1.3.6", status: "manual" },
  "1.4.1": { criterionId: "1.4.1", status: "manual" },
  "1.4.2": { criterionId: "1.4.2", status: "static", ruleIds: ["audio-autoplay"], componentTags: ["video", "audio"] },
  "1.4.3": { criterionId: "1.4.3", status: "static", ruleIds: ["contrast-minimum"] },
  "1.4.4": { criterionId: "1.4.4", status: "static", ruleIds: ["resize-text"] },
  "1.4.5": { criterionId: "1.4.5", status: "manual" },
  "1.4.6": { criterionId: "1.4.6", status: "manual" },
  "1.4.7": { criterionId: "1.4.7", status: "manual", componentTags: ["audio"] },
  "1.4.8": { criterionId: "1.4.8", status: "manual" },
  "1.4.9": { criterionId: "1.4.9", status: "manual" },
  "1.4.10": { criterionId: "1.4.10", status: "static", ruleIds: ["reflow-fixed-width"] },
  "1.4.11": { criterionId: "1.4.11", status: "static", ruleIds: ["non-text-contrast"] },
  "1.4.12": { criterionId: "1.4.12", status: "static", ruleIds: ["text-spacing"] },
  "1.4.13": { criterionId: "1.4.13", status: "runtime", ruleIds: ["hover-focus-content"] },
  "2.1.1": { criterionId: "2.1.1", status: "static", ruleIds: ["click-events-have-key-events", "interactive-tabindex"] },
  "2.1.2": { criterionId: "2.1.2", status: "runtime", ruleIds: ["focus-trap"] },
  "2.1.4": { criterionId: "2.1.4", status: "static", ruleIds: ["accesskey"] },
  "2.2.1": { criterionId: "2.2.1", status: "manual" },
  "2.2.2": { criterionId: "2.2.2", status: "manual" },
  "2.2.3": { criterionId: "2.2.3", status: "manual" },
  "2.2.4": { criterionId: "2.2.4", status: "manual" },
  "2.2.5": { criterionId: "2.2.5", status: "manual" },
  "2.2.6": { criterionId: "2.2.6", status: "manual" },
  "2.3.1": { criterionId: "2.3.1", status: "manual" },
  "2.3.2": { criterionId: "2.3.2", status: "manual" },
  "2.3.3": { criterionId: "2.3.3", status: "runtime", ruleIds: ["reduced-motion"] },
  "2.4.1": { criterionId: "2.4.1", status: "static", ruleIds: ["bypass-blocks"] },
  "2.4.2": { criterionId: "2.4.2", status: "manual" },
  "2.4.3": { criterionId: "2.4.3", status: "runtime", ruleIds: ["focus-order"] },
  "2.4.4": { criterionId: "2.4.4", status: "static", ruleIds: ["link-purpose"] },
  "2.4.5": { criterionId: "2.4.5", status: "manual" },
  "2.4.6": { criterionId: "2.4.6", status: "static", ruleIds: ["empty-heading-label"] },
  "2.4.7": { criterionId: "2.4.7", status: "static", ruleIds: ["focus-visible"] },
  "2.4.8": { criterionId: "2.4.8", status: "manual" },
  "2.4.9": { criterionId: "2.4.9", status: "static", ruleIds: ["link-purpose"] },
  "2.4.10": { criterionId: "2.4.10", status: "manual" },
  "2.4.11": { criterionId: "2.4.11", status: "runtime", ruleIds: ["focus-not-obscured"] },
  "2.4.12": { criterionId: "2.4.12", status: "runtime", ruleIds: ["focus-not-obscured"] },
  "2.4.13": { criterionId: "2.4.13", status: "runtime", ruleIds: ["focus-appearance"] },
  "2.5.1": { criterionId: "2.5.1", status: "static", ruleIds: ["pointer-gestures"] },
  "2.5.2": { criterionId: "2.5.2", status: "runtime", ruleIds: ["pointer-cancellation"] },
  "2.5.3": { criterionId: "2.5.3", status: "static", ruleIds: ["label-in-name"] },
  "2.5.4": { criterionId: "2.5.4", status: "static", ruleIds: ["motion-actuation"] },
  "2.5.5": { criterionId: "2.5.5", status: "manual" },
  "2.5.6": { criterionId: "2.5.6", status: "manual" },
  "2.5.7": { criterionId: "2.5.7", status: "static", ruleIds: ["drag-alternative"] },
  "2.5.8": { criterionId: "2.5.8", status: "static", ruleIds: ["target-size"] },
  "3.1.1": { criterionId: "3.1.1", status: "static", ruleIds: ["lang-page"] },
  "3.1.2": { criterionId: "3.1.2", status: "static", ruleIds: ["lang-parts"] },
  "3.1.3": { criterionId: "3.1.3", status: "manual" },
  "3.1.4": { criterionId: "3.1.4", status: "manual" },
  "3.1.5": { criterionId: "3.1.5", status: "manual" },
  "3.1.6": { criterionId: "3.1.6", status: "manual" },
  "3.2.1": { criterionId: "3.2.1", status: "static", ruleIds: ["on-focus-change"] },
  "3.2.2": { criterionId: "3.2.2", status: "static", ruleIds: ["on-input-change"] },
  "3.2.3": { criterionId: "3.2.3", status: "manual" },
  "3.2.4": { criterionId: "3.2.4", status: "manual" },
  "3.2.5": { criterionId: "3.2.5", status: "manual" },
  "3.2.6": { criterionId: "3.2.6", status: "manual" },
  "3.3.1": { criterionId: "3.3.1", status: "static", ruleIds: ["error-identification"] },
  "3.3.2": { criterionId: "3.3.2", status: "static", ruleIds: ["label", "required-field"] },
  "3.3.3": { criterionId: "3.3.3", status: "manual" },
  "3.3.4": { criterionId: "3.3.4", status: "manual", componentTags: ["form"] },
  "3.3.5": { criterionId: "3.3.5", status: "manual" },
  "3.3.6": { criterionId: "3.3.6", status: "manual", componentTags: ["form"] },
  "3.3.7": { criterionId: "3.3.7", status: "manual", componentTags: ["form"] },
  "3.3.8": { criterionId: "3.3.8", status: "manual", componentTags: ["form"] },
  "3.3.9": { criterionId: "3.3.9", status: "manual", componentTags: ["form"] },
  "4.1.2": { criterionId: "4.1.2", status: "static", ruleIds: ["click-events-have-key-events", "button-name", "iframe-title", "duplicate-id", "link-name", "aria-valid"] },
  "4.1.3": { criterionId: "4.1.3", status: "static", ruleIds: ["status-messages"] },
};

/** Returns coverage metadata for a criterion ID. */
export function getCoverageForCriterion(
  criterionId: string,
): CriterionCoverage | undefined {
  return CRITERION_COVERAGE[criterionId];
}

export type CoverageStats = {
  total: number;
  static: number;
  runtime: number;
  manual: number;
};

/** Returns counts of criteria by coverage status. */
export function getCoverageStats(): CoverageStats {
  const stats: CoverageStats = {
    total: WCAG_CATALOG.length,
    static: 0,
    runtime: 0,
    manual: 0,
  };

  for (const criterion of WCAG_CATALOG) {
    const coverage = CRITERION_COVERAGE[criterion.id];
    if (!coverage) continue;
    stats[coverage.status] += 1;
  }

  return stats;
}

/** Returns manual criteria suggested for detected component tags. */
export function getManualCriteriaForTags(tags: Set<string>): string[] {
  const matches: string[] = [];

  for (const criterion of WCAG_CATALOG) {
    const coverage = CRITERION_COVERAGE[criterion.id];
    if (!coverage || coverage.status !== "manual") continue;
    if (!coverage.componentTags?.some((tag) => tags.has(tag))) continue;
    matches.push(criterion.id);
  }

  return matches.sort();
}

/** Returns all manual-only criterion IDs. */
export function getManualCriteriaIds(): string[] {
  return WCAG_CATALOG.filter(
    (criterion) => CRITERION_COVERAGE[criterion.id]?.status === "manual",
  ).map((criterion) => criterion.id);
}

/** Detects component pattern tags from TSX source for manual check suggestions. */
export function detectComponentTags(source: string): Set<string> {
  const tags = new Set<string>();

  if (/<video\b/i.test(source)) tags.add("video");
  if (/<audio\b/i.test(source)) tags.add("audio");
  if (/<form\b/i.test(source)) tags.add("form");
  if (/<input\b/i.test(source)) tags.add("form");
  if (/<select\b/i.test(source)) tags.add("form");
  if (/<textarea\b/i.test(source)) tags.add("form");

  return tags;
}
