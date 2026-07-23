"use client";

import { useMemo } from "react";
import type { A11yFinding } from "@/lib/a11y/types";
import type { PageViewport } from "@/lib/a11y/page-scan/types";
import { ExtensionInstallCard } from "@/components/page-analyzer/extension-install-card";
import { FindingsSidebar } from "@/components/page-analyzer/findings-sidebar";
import { PageViewer } from "@/components/page-analyzer/page-viewer";
import { ScanLoadingPanel } from "@/components/page-analyzer/scan-loading-panel";
import { UrlScanForm } from "@/components/page-analyzer/url-scan-form";
import { ViewerSummaryBar } from "@/components/page-analyzer/viewer-summary-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFindingId } from "@/components/page-analyzer/finding-markers-layer";

export type PageAnalyzerShellProps = {
  scannedUrl: string | null;
  proxyUrl: string | null;
  findings: A11yFinding[];
  viewport?: PageViewport;
  pageHeight?: number;
  scanError?: string | null;
  isLoading?: boolean;
  loadingMessage?: string | null;
  selectedFindingId: string | null;
  onSelectFinding: (findingId: string | null) => void;
  onScan: (url: string) => void;
  onRescan?: () => void;
  onNavigate?: (url: string) => void;
  onFindingsUpdate?: (findings: A11yFinding[]) => void;
};

/** WAVE-inspired layout for the interactive page analyzer. */
export function PageAnalyzerShell({
  scannedUrl,
  proxyUrl,
  findings,
  viewport,
  pageHeight,
  scanError,
  isLoading = false,
  loadingMessage,
  selectedFindingId,
  onSelectFinding,
  onScan,
  onRescan,
  onNavigate,
  onFindingsUpdate,
}: PageAnalyzerShellProps) {
  const selectedFinding = useMemo(
    () =>
      findings.find(
        (finding, index) => getFindingId(finding, index) === selectedFindingId,
      ) ?? null,
    [findings, selectedFindingId],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Page Analyzer
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Scan a public URL to view a proxied snapshot with WAVE-style issue
          markers. Use the browser extension for faster live browsing on
          localhost, login, and client-rendered apps.
        </p>
      </div>

      <UrlScanForm onSubmit={onScan} isLoading={isLoading} />

      {(scanError || isLoading || scannedUrl) && (
        <Card aria-busy={isLoading}>
          <CardHeader className="space-y-0 pb-0">
            <CardTitle>{isLoading ? "Scan in progress" : "Interactive results"}</CardTitle>
            <CardDescription>
              {isLoading
                ? "Please wait while the page loads and accessibility checks run."
                : "Click a numbered marker or sidebar item to inspect an issue."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            {isLoading ? (
              <ScanLoadingPanel url={scannedUrl} message={loadingMessage} />
            ) : (
              <>
                <ViewerSummaryBar
                  url={scannedUrl}
                  findings={findings}
                  isLoading={isLoading}
                  onRescan={onRescan}
                />

                {scanError && (
                  <div className="border-b px-4 py-3 text-sm text-destructive" role="alert">
                    {scanError}
                  </div>
                )}

                <div className="grid min-h-[520px] lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.6fr)]">
                  <FindingsSidebar
                    findings={findings}
                    selectedFindingId={selectedFindingId}
                    onSelectFinding={(findingId) => onSelectFinding(findingId)}
                    className="max-h-[70vh]"
                  />
                  <PageViewer
                    proxyUrl={proxyUrl}
                    findings={findings}
                    viewport={viewport}
                    pageHeight={pageHeight}
                    selectedFindingId={selectedFindingId}
                    onSelectFinding={onSelectFinding}
                    onNavigate={onNavigate}
                    onFindingsUpdate={onFindingsUpdate}
                    className="min-h-[520px] rounded-none border-0 border-l"
                  />
                </div>

                {selectedFinding && (
                  <div className="border-t px-4 py-3 text-sm text-muted-foreground">
                    Selected: {selectedFinding.message}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <ExtensionInstallCard />
    </div>
  );
}
