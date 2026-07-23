"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { A11yFinding } from "@/lib/a11y/types";

export type ViewerSummaryBarProps = {
  url: string | null;
  findings: A11yFinding[];
  isLoading?: boolean;
  onRescan?: () => void;
};

/** Top summary bar for the WAVE-style page analyzer viewer. */
export function ViewerSummaryBar({
  url,
  findings,
  isLoading = false,
  onRescan,
}: ViewerSummaryBarProps) {
  const blockingCount = findings.filter(
    (finding) => finding.severity === "blocking",
  ).length;
  const enhancementCount = findings.length - blockingCount;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
      <div className="min-w-0 space-y-1">
        <p className="truncate text-sm font-medium">{url ?? "No page loaded"}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="destructive">{blockingCount} errors</Badge>
          <Badge className="bg-amber-500 text-white hover:bg-amber-500/90">
            {enhancementCount} alerts
          </Badge>
          <span className="text-xs text-muted-foreground">
            Snapshot viewer — follow links to scan other pages
          </span>
        </div>
      </div>
      {onRescan && url && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRescan}
          disabled={isLoading}
          className="min-h-9"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Rescan
        </Button>
      )}
    </div>
  );
}
