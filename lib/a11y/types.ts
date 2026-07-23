import type { File } from "@babel/types";

/** WCAG conformance level for a criterion. */
export type WcagLevel = "A" | "AA" | "AAA";

/** Severity of an accessibility finding. */
export type FindingSeverity = "blocking" | "enhancement";

/** Document-space bounding box for page overlay markers. */
export type ElementRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

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
  /** Stable identifier for overlay selection sync. */
  findingId?: string;
  /** Axe selector chain for resolving the flagged element. */
  selectors?: string[];
  /** Document-space coordinates for overlay markers. */
  boundingBox?: ElementRect;
  /** Page URL where the finding was detected. */
  pageUrl?: string;
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
