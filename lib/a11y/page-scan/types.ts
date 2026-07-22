import type { A11yFinding } from "../types";

/** Result of scanning a live web page for accessibility issues. */
export type PageScanResult = {
  url: string;
  findings: A11yFinding[];
  scanError?: string;
  scannedAt: string;
};

/** Outcome of validating a scan target URL. */
export type UrlValidationResult =
  | { ok: true; url: string }
  | { ok: false; error: string };
