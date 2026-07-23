"use client";

import type { A11yFinding, ElementRect } from "@/lib/a11y/types";
import { cn } from "@/lib/utils";

export type MarkerViewportState = {
  scrollX: number;
  scrollY: number;
  scale: number;
};

export type FindingMarkersLayerProps = {
  findings: A11yFinding[];
  selectedFindingId: string | null;
  viewportState: MarkerViewportState;
  onSelectFinding: (findingId: string) => void;
  className?: string;
};

/** Returns a stable finding identifier. */
export function getFindingId(finding: A11yFinding, index: number): string {
  return finding.findingId ?? `${finding.ruleId}-${index}`;
}

/** Converts a document-space rect into overlay coordinates. */
export function toOverlayRect(
  boundingBox: ElementRect,
  viewportState: MarkerViewportState,
): ElementRect {
  return {
    x: boundingBox.x * viewportState.scale - viewportState.scrollX,
    y: boundingBox.y * viewportState.scale - viewportState.scrollY,
    width: boundingBox.width * viewportState.scale,
    height: boundingBox.height * viewportState.scale,
  };
}

/** Absolutely positioned WAVE-style marker bubbles over the page viewer. */
export function FindingMarkersLayer({
  findings,
  selectedFindingId,
  viewportState,
  onSelectFinding,
  className,
}: FindingMarkersLayerProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {findings.map((finding, index) => {
        if (!finding.boundingBox) return null;

        const findingId = getFindingId(finding, index);
        const rect = toOverlayRect(finding.boundingBox, viewportState);
        const isSelected = selectedFindingId === findingId;

        if (rect.y + rect.height < 0 || rect.x + rect.width < 0) {
          return null;
        }

        return (
          <button
            key={findingId}
            type="button"
            className={cn(
              "pointer-events-auto absolute z-10 inline-flex h-7 min-w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white px-1 text-xs font-semibold text-white shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              finding.severity === "blocking" ? "bg-destructive" : "bg-amber-500",
              isSelected && "scale-110 ring-2 ring-ring",
            )}
            style={{
              left: rect.x + rect.width / 2,
              top: rect.y,
            }}
            aria-label={`${index + 1}. ${finding.message}`}
            aria-pressed={isSelected}
            onClick={() => onSelectFinding(findingId)}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
