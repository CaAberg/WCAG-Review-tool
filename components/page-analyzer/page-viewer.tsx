"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { A11yFinding } from "@/lib/a11y/types";
import type { PageViewport } from "@/lib/a11y/page-scan/types";
import {
  FindingMarkersLayer,
  getFindingId,
  type MarkerViewportState,
} from "@/components/page-analyzer/finding-markers-layer";
import { FindingDetailPopover } from "@/components/page-analyzer/finding-detail-popover";

export type ViewerBootstrapMessage =
  | {
      type: "viewer-scroll";
      scrollX: number;
      scrollY: number;
      pageHeight: number;
    }
  | {
      type: "viewer-findings";
      findings: A11yFinding[];
      pageHeight: number;
    }
  | {
      type: "viewer-navigate";
      url: string;
    };

export type PageViewerProps = {
  proxyUrl: string | null;
  findings: A11yFinding[];
  viewport?: PageViewport;
  pageHeight?: number;
  selectedFindingId: string | null;
  onSelectFinding: (findingId: string | null) => void;
  onNavigate?: (url: string) => void;
  onFindingsUpdate?: (findings: A11yFinding[]) => void;
  className?: string;
};

/** Embedded proxy iframe with synchronized accessibility markers. */
export function PageViewer({
  proxyUrl,
  findings,
  viewport,
  pageHeight,
  selectedFindingId,
  onSelectFinding,
  onNavigate,
  onFindingsUpdate,
  className,
}: PageViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportState, setViewportState] = useState<MarkerViewportState>({
    scrollX: 0,
    scrollY: 0,
    scale: 1,
  });
  const [liveFindings, setLiveFindings] = useState(findings);

  useEffect(() => {
    setLiveFindings(findings);
  }, [findings]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !viewport) return;

    const updateScale = () => {
      const scale = container.clientWidth / viewport.width;
      setViewportState((current) => ({ ...current, scale }));
    };

    updateScale();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateScale);
      observer.observe(container);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [viewport]);

  const handleMessage = useCallback(
    (event: MessageEvent<ViewerBootstrapMessage>) => {
      if (event.source !== iframeRef.current?.contentWindow) return;

      const data = event.data;
      if (!data || typeof data !== "object" || !("type" in data)) return;

      if (data.type === "viewer-scroll") {
        setViewportState((current) => ({
          ...current,
          scrollX: data.scrollX * current.scale,
          scrollY: data.scrollY * current.scale,
        }));
      }

      if (data.type === "viewer-findings") {
        setLiveFindings(data.findings);
        onFindingsUpdate?.(data.findings);
      }

      if (data.type === "viewer-navigate" && onNavigate) {
        onNavigate(data.url);
      }
    },
    [onFindingsUpdate, onNavigate],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  const selectedFinding = liveFindings.find(
    (finding, index) => getFindingId(finding, index) === selectedFindingId,
  );
  const selectedIndex =
    selectedFindingId === null
      ? null
      : liveFindings.findIndex(
          (finding, index) => getFindingId(finding, index) === selectedFindingId,
        ) + 1;

  if (!proxyUrl) {
    return (
      <div
        className={`flex min-h-[420px] items-center justify-center rounded-md border bg-muted/20 text-sm text-muted-foreground ${className ?? ""}`}
      >
        Scan a URL to load the interactive page viewer.
      </div>
    );
  }

  const iframeHeight = Math.max(
    (pageHeight ?? viewport?.height ?? 720) * viewportState.scale,
    420,
  );

  return (
    <div className={`relative overflow-hidden rounded-md border bg-background ${className ?? ""}`}>
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ maxHeight: "70vh" }}
      >
        <div className="relative" style={{ height: iframeHeight }}>
          <iframe
            ref={iframeRef}
            src={proxyUrl}
            title="Scanned page preview"
            className="absolute inset-0 h-full w-full border-0 bg-white"
            style={{
              width: viewport?.width ?? 1280,
              height: pageHeight ?? viewport?.height ?? 720,
              transform: `scale(${viewportState.scale})`,
              transformOrigin: "top left",
            }}
          />
          <FindingMarkersLayer
            findings={liveFindings}
            selectedFindingId={selectedFindingId}
            viewportState={viewportState}
            onSelectFinding={onSelectFinding}
          />
        </div>
      </div>
      <FindingDetailPopover
        finding={selectedFinding ?? null}
        markerIndex={selectedIndex}
        onClose={() => onSelectFinding(null)}
      />
    </div>
  );
}
