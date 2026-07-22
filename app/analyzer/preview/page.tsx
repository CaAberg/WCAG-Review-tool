"use client";

import { useCallback, useEffect, useRef } from "react";
import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { compileTsxForPreview } from "@/lib/a11y/preview/compile-tsx";
import { runRuntimeChecks } from "@/lib/a11y/runtime";
import type { A11yFinding } from "@/lib/a11y/types";

export type PreviewAnalyzeMessage = {
  type: "preview-analyze";
  requestId: string;
  code: string;
};

export type PreviewResultMessage = {
  type: "preview-result";
  requestId: string;
  runtimeFindings: A11yFinding[];
  previewError?: string;
};

type PreviewWindow = Window & {
  React?: typeof React;
  ReactDOM?: { createRoot: typeof createRoot };
  __PREVIEW_COMPONENT__?: React.ComponentType;
};

/** Sandboxed preview surface that compiles TSX and runs runtime accessibility checks. */
export default function AnalyzerPreviewPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reactRootRef = useRef<Root | null>(null);

  useEffect(() => {
    const previewWindow = window as unknown as PreviewWindow;
    previewWindow.React = React;
    previewWindow.ReactDOM = { createRoot };
  }, []);

  const runPreview = useCallback((code: string): A11yFinding[] => {
    const container = rootRef.current;
    if (!container) return [];

    if (reactRootRef.current) {
      reactRootRef.current.unmount();
      reactRootRef.current = null;
    }

    container.innerHTML = "";

    const compiled = compileTsxForPreview(code);
    if (compiled.error) {
      throw new Error(compiled.error);
    }
    if (!compiled.componentName) {
      throw new Error("Export a component function for preview analysis.");
    }

    const previewWindow = window as unknown as PreviewWindow;
    const runCompiled = new Function("React", "ReactDOM", compiled.code);
    runCompiled(previewWindow.React, previewWindow.ReactDOM);

    const PreviewComponent = previewWindow.__PREVIEW_COMPONENT__;
    if (!PreviewComponent) {
      throw new Error("Preview component was not exported.");
    }

    const mount = document.createElement("div");
    mount.id = "preview-mount";
    container.appendChild(mount);

    const reactRoot = createRoot(mount);
    reactRootRef.current = reactRoot;
    reactRoot.render(React.createElement(PreviewComponent));

    return runRuntimeChecks(mount);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<PreviewAnalyzeMessage>) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "preview-analyze") return;

      const { requestId, code } = event.data;
      let runtimeFindings: A11yFinding[] = [];
      let previewError: string | undefined;

      try {
        runtimeFindings = runPreview(code);
      } catch (error) {
        previewError =
          error instanceof Error ? error.message : "Preview analysis failed.";
      }

      const response: PreviewResultMessage = {
        type: "preview-result",
        requestId,
        runtimeFindings,
        previewError,
      };

      window.parent.postMessage(response, window.location.origin);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [runPreview]);

  useEffect(() => {
    if (window.parent === window) return;
    window.parent.postMessage({ type: "preview-ready" }, window.location.origin);
  }, []);

  return (
    <div
      ref={rootRef}
      id="preview-root"
      className="min-h-screen bg-background p-4 text-foreground"
      aria-hidden="true"
    />
  );
}
