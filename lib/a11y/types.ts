import type { File } from "@babel/types";

/** WCAG conformance level for a criterion. */
export type WcagLevel = "A" | "AA" | "AAA";

/** Severity of an accessibility finding. */
export type FindingSeverity = "blocking" | "enhancement";

/** Metadata for a WCAG guideline grouping success criteria. */
export type WcagGuideline = {
  id: string;
  name: string;
  principle: "1" | "2" | "3" | "4";
  principleName: string;
};

/** Metadata for a WCAG success criterion. */
export type WcagCriterion = {
  id: string;
  name: string;
  level: WcagLevel;
  description: string;
  guideSlug: string;
  guidelineId: string;
  guidelineName: string;
  understandingUrl: string;
};

/** A single accessibility issue found in pasted TSX. */
export type A11yFinding = {
  ruleId: string;
  message: string;
  severity: FindingSeverity;
  wcagCriteria: string[];
  line: number;
  column: number;
  element: string;
  suggestion: string;
  /** Paste-ready JSX/HTML derived from the flagged element, when available. */
  fixSnippet?: string;
  /** Origin of the finding — static AST rules, live preview, or axe page scan. */
  source?: "static" | "preview" | "axe";
};

/** Result of parsing and analyzing TSX source code. */
export type AnalyzeResult = {
  findings: A11yFinding[];
  parseError?: string;
  runtimeFindings?: A11yFinding[];
  previewError?: string;
};

/** Context passed to each static analysis rule. */
export type RuleContext = {
  source: string;
  ast?: File;
};

/** Definition of a static accessibility rule. */
export type A11yRule = {
  id: string;
  description: string;
  wcagCriteria: string[];
  severity: FindingSeverity;
  check: (context: RuleContext) => A11yFinding[];
};

/** Saved audit record shape for Supabase. */
export type SavedAudit = {
  id: string;
  user_id: string | null;
  title: string;
  code: string;
  findings: A11yFinding[];
  created_at: string;
};
