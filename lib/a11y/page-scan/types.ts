import type { A11yFinding } from "../types";

/** Viewport dimensions captured during a page scan or render. */
export type PageViewport = {
  width: number;
  height: number;
};

/** Result of scanning a live web page for accessibility issues. */
export type PageScanResult = {
  url: string;
  findings: A11yFinding[];
  scanError?: string;
  scannedAt: string;
  viewport?: PageViewport;
  pageHeight?: number;
  proxyUrl?: string;
};

/** Outcome of validating a scan target URL. */
export type UrlValidationResult =
  | { ok: true; url: string }
  | { ok: false; error: string };
