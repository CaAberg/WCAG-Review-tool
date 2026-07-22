"use client";

import { useCallback, useEffect, useState } from "react";
import { ResultsPanel } from "@/components/analyzer/results-panel";
import { ExtensionInstallCard } from "@/components/page-analyzer/extension-install-card";
import { UrlScanForm } from "@/components/page-analyzer/url-scan-form";
import type { A11yFinding } from "@/lib/a11y/types";
import type { PageScanResult } from "@/lib/a11y/page-scan";

const MAX_IMPORTED_RESULTS_BYTES = 500_000;

/** Decodes extension results passed via URL hash. */
function decodeImportedResults(hash: string): A11yFinding[] | null {
  if (!hash.startsWith("#results=")) return null;

  try {
    const encoded = hash.slice("#results=".length);
    if (encoded.length > MAX_IMPORTED_RESULTS_BYTES) return null;

    const json = atob(decodeURIComponent(encoded));
    const parsed = JSON.parse(json) as { findings?: A11yFinding[] };
    return Array.isArray(parsed.findings) ? parsed.findings : null;
  } catch {
    return null;
  }
}

/** Main workspace for scanning live web pages. */
export function PageAnalyzerWorkspace() {
  const [findings, setFindings] = useState<A11yFinding[]>([]);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const imported = decodeImportedResults(window.location.hash);
    if (!imported) return;

    setFindings(imported);
    setScannedUrl("Imported from browser extension");
    setScanError(null);
  }, []);

  const runScan = useCallback(async (url: string) => {
    setIsLoading(true);
    setScanError(null);
    setFindings([]);
    setScannedUrl(url);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = (await response.json()) as PageScanResult & { error?: string };

      if (!response.ok) {
        setScanError(data.scanError ?? data.error ?? "Scan failed.");
        setFindings(data.findings ?? []);
        return;
      }

      setFindings(data.findings);
      setScanError(data.scanError ?? null);
    } catch {
      setScanError("Network error while scanning. Try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Page Analyzer
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter a public URL to run an automated axe-core accessibility scan.
            Private, localhost, and authenticated pages are best checked with the
            browser extension below.
          </p>
        </div>
        <UrlScanForm onSubmit={runScan} isLoading={isLoading} />
        <ExtensionInstallCard />
      </div>
      <ResultsPanel
        findings={findings}
        scanError={scanError}
        scannedUrl={scannedUrl}
        mode="page"
        isLoading={isLoading}
      />
    </div>
  );
}
