import { WCAG_CATALOG } from "../wcag-catalog-data";
import type { A11yFinding, FindingSeverity } from "../types";
import { createFindingId, parseAxeTarget } from "./enrich-findings";

/** Minimal axe violation shape used by the mapper. */
export type AxeViolationLike = {
  id: string;
  impact?: string | null;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: Array<{
    html: string;
    target: unknown;
  }>;
};

/** Minimal axe results payload accepted by the mapper. */
export type AxeResultsLike = {
  violations: AxeViolationLike[];
};

const CRITERION_BY_COMPACT_ID = new Map(
  WCAG_CATALOG.map((criterion) => [criterion.id.replace(/\./g, ""), criterion.id]),
);

/** Formats axe target selectors for display. */
function formatTarget(target: unknown): string {
  if (Array.isArray(target)) {
    return target.map((entry) => String(entry)).join(", ");
  }

  return String(target);
}

/** Maps axe impact levels to WCAG Access finding severity. */
function mapImpactToSeverity(impact?: string | null): FindingSeverity {
  if (impact === "critical" || impact === "serious") return "blocking";
  return "enhancement";
}

/** Extracts WCAG criterion IDs from axe rule tags. */
export function extractWcagCriteriaFromTags(tags: string[]): string[] {
  const criteria = new Set<string>();

  for (const tag of tags) {
    const match = tag.match(/^wcag(\d+)$/i);
    if (!match) continue;

    const criterionId = CRITERION_BY_COMPACT_ID.get(match[1]);
    if (criterionId) criteria.add(criterionId);
  }

  return [...criteria].sort();
}

/** Converts axe violations into normalized accessibility findings. */
export function axeToFindings(results: AxeResultsLike): A11yFinding[] {
  const findings: A11yFinding[] = [];

  for (const violation of results.violations) {
    const wcagCriteria = extractWcagCriteriaFromTags(violation.tags);
    const severity = mapImpactToSeverity(violation.impact);

    if (violation.nodes.length === 0) {
      findings.push({
        findingId: createFindingId(),
        ruleId: violation.id,
        message: violation.help,
        severity,
        wcagCriteria,
        line: 0,
        column: 0,
        element: violation.id,
        suggestion: violation.description,
        source: "axe",
      });
      continue;
    }

    for (const node of violation.nodes) {
      const selectors = parseAxeTarget(node.target);

      findings.push({
        findingId: createFindingId(),
        ruleId: violation.id,
        message: violation.help,
        severity,
        wcagCriteria,
        line: 0,
        column: 0,
        element: formatTarget(node.target) || node.html.slice(0, 120),
        selectors: selectors.length > 0 ? selectors : undefined,
        suggestion: `${violation.description} See ${violation.helpUrl}`,
        fixSnippet: node.html.length <= 500 ? node.html : undefined,
        source: "axe",
      });
    }
  }

  return findings;
}
