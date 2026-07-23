"use client";

import { Badge } from "@/components/ui/badge";
import { getSeverityLabel } from "@/lib/a11y/severity-labels";
import type { A11yFinding } from "@/lib/a11y/types";
import { cn } from "@/lib/utils";

export type FindingsSidebarProps = {
  findings: A11yFinding[];
  selectedFindingId: string | null;
  onSelectFinding: (findingId: string) => void;
  className?: string;
};

/** Sidebar list of findings synced with page overlay markers. */
export function FindingsSidebar({
  findings,
  selectedFindingId,
  onSelectFinding,
  className,
}: FindingsSidebarProps) {
  if (findings.length === 0) {
    return (
      <div className={cn("border-r p-4 text-sm text-muted-foreground", className)}>
        No accessibility issues detected on this snapshot.
      </div>
    );
  }

  return (
    <div className={cn("overflow-y-auto border-r", className)}>
      <ul className="divide-y" role="listbox" aria-label="Accessibility findings">
        {findings.map((finding, index) => {
          const findingId = finding.findingId ?? `${finding.ruleId}-${index}`;
          const isSelected = selectedFindingId === findingId;

          return (
            <li key={findingId}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                  isSelected && "bg-muted",
                )}
                onClick={() => onSelectFinding(findingId)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold text-white",
                      finding.severity === "blocking"
                        ? "bg-destructive"
                        : "bg-amber-500",
                    )}
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <Badge variant="outline">{getSeverityLabel(finding.severity)}</Badge>
                </div>
                <span className="text-sm font-medium">{finding.message}</span>
                <span className="line-clamp-2 text-xs text-muted-foreground">
                  {finding.element}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
