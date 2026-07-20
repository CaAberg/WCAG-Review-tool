import type { FindingSeverity } from "./types";

/** User-facing label for a finding severity level. */
export function getSeverityLabel(severity: FindingSeverity): string {
  return severity === "blocking" ? "Must fix" : "Should fix";
}
