"use client";

import { useCallback, useEffect, useState } from "react";
import { PageAnalyzerShell } from "@/components/page-analyzer/page-analyzer-shell";
import type { A11yFinding } from "@/lib/a11y/types";
import type { PageScanResult } from "@/lib/a11y/page-scan";

const MAX_IMPORTED_RESULTS_BYTES = 500_000;

type ImportedResults = {
  findings: A11yFinding[];
  url?: string;
};

/** Decodes extension results passed via URL hash. */
function decodeImportedResults(hash: string): ImportedResults | null {
  if (!hash.startsWith("#results=")) return null;

  try {
    const encoded = hash.slice("#results=".length);
    if (encoded.length > MAX_IMPORTED_RESULTS_BYTES) return null;

    const json = atob(decodeURIComponent(encoded));
    const parsed = JSON.parse(json) as ImportedResults;
    if (!Array.isArray(parsed.findings)) return null;

    return {
      findings: parsed.findings,
      url: parsed.url,
    };
  } catch {
    return null;
  }
}

/** Main workspace for scanning live web pages. */
export function PageAnalyzerWorkspace() {
  const [findings, setFindings] = useState<A11yFinding[]>([]);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [proxyUrl, setProxyUrl] = useState<string | null>(null);
  const [viewport, setViewport] = useState<PageScanResult["viewport"]>();
  const [pageHeight, setPageHeight] = useState<number>();
  const [scanError, setScanError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);

  useEffect(() => {
    const imported = decodeImportedResults(window.location.hash);
    if (!imported) return;

    setFindings(imported.findings);
    setScannedUrl(imported.url ?? "Imported from browser extension");
    setProxyUrl(
      imported.url
        ? `/page-analyzer/proxy?url=${encodeURIComponent(imported.url)}`
        : null,
    );
    setScanError(null);
  }, []);

  const runScan = useCallback(async (url: string) => {
    setIsLoading(true);
    setLoadingMessage("Loading page and running accessibility checks...");
    setScanError(null);
    setFindings([]);
    setSelectedFindingId(null);
    setScannedUrl(url);
    setProxyUrl(null);

    try {
      const response = await fetch("/api/proxy/render", {
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
      setViewport(data.viewport);
      setPageHeight(data.pageHeight);
      setProxyUrl(data.proxyUrl ?? `/page-analyzer/proxy?url=${encodeURIComponent(url)}`);
      setScanError(data.scanError ?? null);
    } catch {
      setScanError("Network error while scanning. Try again.");
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, []);

  const handleNavigate = useCallback(
    (url: string) => {
      void runScan(url);
    },
    [runScan],
  );

  return (
    <PageAnalyzerShell
      scannedUrl={scannedUrl}
      proxyUrl={proxyUrl}
      findings={findings}
      viewport={viewport}
      pageHeight={pageHeight}
      scanError={scanError}
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      selectedFindingId={selectedFindingId}
      onSelectFinding={setSelectedFindingId}
      onScan={runScan}
      onRescan={scannedUrl ? () => runScan(scannedUrl) : undefined}
      onNavigate={handleNavigate}
      onFindingsUpdate={setFindings}
    />
  );
}
