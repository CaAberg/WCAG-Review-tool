"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { A11yFinding } from "@/lib/a11y/types";
import type { PreviewResultMessage } from "@/app/analyzer/preview/page";

export type PreviewFrameResult = {
  runtimeFindings: A11yFinding[];
  previewError?: string;
};

export type PreviewFrameProps = {
  onReady?: () => void;
};

/** Hidden iframe bridge that runs runtime preview accessibility checks. */
export function PreviewFrame({ onReady }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);
  const pendingRef = useRef<
    Map<
      string,
      {
        resolve: (result: PreviewFrameResult) => void;
        reject: (error: Error) => void;
      }
    >
  >(new Map());

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "preview-ready") {
        setIsReady(true);
        onReady?.();
        return;
      }

      if (event.data?.type !== "preview-result") return;

      const data = event.data as PreviewResultMessage;
      const pending = pendingRef.current.get(data.requestId);
      if (!pending) return;

      pendingRef.current.delete(data.requestId);
      pending.resolve({
        runtimeFindings: data.runtimeFindings,
        previewError: data.previewError,
      });
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onReady]);

  const runPreviewAnalysis = useCallback(
    (code: string): Promise<PreviewFrameResult> => {
      return new Promise((resolve, reject) => {
        const iframe = iframeRef.current;
        if (!iframe?.contentWindow) {
          reject(new Error("Preview frame is not available."));
          return;
        }

        if (!isReady) {
          resolve({ runtimeFindings: [], previewError: "Preview not ready." });
          return;
        }

        const requestId = crypto.randomUUID();
        pendingRef.current.set(requestId, { resolve, reject });

        iframe.contentWindow.postMessage(
          { type: "preview-analyze", requestId, code },
          window.location.origin,
        );

        window.setTimeout(() => {
          if (!pendingRef.current.has(requestId)) return;
          pendingRef.current.delete(requestId);
          resolve({
            runtimeFindings: [],
            previewError: "Preview analysis timed out.",
          });
        }, 15_000);
      });
    },
    [isReady],
  );

  useEffect(() => {
    (window as Window & { __runPreviewAnalysis?: typeof runPreviewAnalysis }).__runPreviewAnalysis =
      runPreviewAnalysis;
  }, [runPreviewAnalysis]);

  return (
    <iframe
      ref={iframeRef}
      src="/analyzer/preview"
      title="Accessibility preview"
      className="sr-only"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}

/** Runs preview analysis via the hidden iframe bridge. */
export function runPreviewAnalysis(code: string): Promise<PreviewFrameResult> {
  const runner = (
    window as Window & {
      __runPreviewAnalysis?: (code: string) => Promise<PreviewFrameResult>;
    }
  ).__runPreviewAnalysis;

  if (!runner) {
    return Promise.resolve({
      runtimeFindings: [],
      previewError: "Preview frame is not mounted.",
    });
  }

  return runner(code);
}
