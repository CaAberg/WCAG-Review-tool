"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGuidePath } from "@/lib/a11y/wcag-map";
import { getSeverityLabel } from "@/lib/a11y/severity-labels";
import type { A11yFinding } from "@/lib/a11y/types";
import { cn } from "@/lib/utils";

export type FindingDetailPopoverProps = {
  finding: A11yFinding | null;
  markerIndex: number | null;
  onClose: () => void;
  className?: string;
};

/** Detail card shown when a marker or sidebar item is selected. */
export function FindingDetailPopover({
  finding,
  markerIndex,
  onClose,
  className,
}: FindingDetailPopoverProps) {
  if (!finding) return null;

  return (
    <Card className={cn("absolute bottom-4 right-4 z-20 w-full max-w-md shadow-lg", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {markerIndex !== null && (
              <span
                className={cn(
                  "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold text-white",
                  finding.severity === "blocking" ? "bg-destructive" : "bg-amber-500",
                )}
              >
                {markerIndex}
              </span>
            )}
            <Badge variant="outline">{getSeverityLabel(finding.severity)}</Badge>
          </div>
          <CardTitle className="text-base">{finding.message}</CardTitle>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="min-h-9 min-w-9 shrink-0"
          onClick={onClose}
          aria-label="Close finding details"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">{finding.suggestion}</p>
        {finding.fixSnippet && (
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
            {finding.fixSnippet}
          </pre>
        )}
        {finding.wcagCriteria.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {finding.wcagCriteria.map((criterion) => (
              <Link
                key={criterion}
                href={getGuidePath(criterion)}
                className="text-sm underline underline-offset-4"
              >
                WCAG {criterion}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
