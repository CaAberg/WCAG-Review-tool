import type { File } from "@babel/types";
import { parseTsxSource } from "./parser";
import { ALL_RULES } from "./rules";
import type { AnalyzeResult, RuleContext } from "./types";

export type { AnalyzeResult, A11yFinding, SavedAudit } from "./types";
export { WCAG_CRITERIA, getGuidePath, getAllCriteria } from "./wcag-map";
export { getCriteriaWithRules, getRuleCount } from "./rules";
export { MAX_SOURCE_LENGTH } from "./parser";

/** Runs all static accessibility rules against TSX source code. */
export function analyzeTsx(source: string): AnalyzeResult {
  const parseResult = parseTsxSource(source);

  if (!parseResult.success) {
    return { findings: [], parseError: parseResult.error };
  }

  const context: RuleContext & { ast: File } = {
    source,
    ast: parseResult.ast,
  };

  const findings = ALL_RULES.flatMap((rule) => rule.check(context));

  findings.sort((a, b) => {
    if (a.line !== b.line) return a.line - b.line;
    return a.column - b.column;
  });

  return { findings };
}

/** Groups findings by WCAG criterion ID. */
export function groupFindingsByCriterion(
  findings: AnalyzeResult["findings"],
): Map<string, AnalyzeResult["findings"]> {
  const grouped = new Map<string, AnalyzeResult["findings"]>();

  for (const finding of findings) {
    for (const criterion of finding.wcagCriteria) {
      const existing = grouped.get(criterion) ?? [];
      existing.push(finding);
      grouped.set(criterion, existing);
    }
  }

  return grouped;
}
