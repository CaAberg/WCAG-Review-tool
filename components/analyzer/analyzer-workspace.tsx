"use client";

import { useCallback, useState } from "react";
import { Play, Save } from "lucide-react";
import { toast } from "sonner";
import { CodeEditor, defaultSample } from "@/components/analyzer/code-editor";
import {
  PreviewFrame,
  runPreviewAnalysis,
} from "@/components/analyzer/preview-frame";
import { ResultsPanel } from "@/components/analyzer/results-panel";
import { SaveAuditDialog } from "@/components/analyzer/save-audit-dialog";
import { Button } from "@/components/ui/button";
import type { A11yFinding } from "@/lib/a11y/types";

export type AnalyzerWorkspaceProps = {
  initialCode?: string;
  initialFindings?: A11yFinding[];
};

/** Main analyzer workspace with editor and results. */
export function AnalyzerWorkspace({
  initialCode,
  initialFindings,
}: AnalyzerWorkspaceProps) {
  const [code, setCode] = useState(initialCode ?? defaultSample);
  const [findings, setFindings] = useState<A11yFinding[]>(
    initialFindings ?? [],
  );
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    setParseError(null);
    setPreviewError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = (await response.json()) as {
        findings?: A11yFinding[];
        parseError?: string;
        error?: string;
      };

      if (!response.ok) {
        if (data.parseError) {
          setParseError(data.parseError);
          setFindings([]);
        } else {
          toast.error(data.error ?? "Analysis failed.");
        }
        return;
      }

      const staticFindings = (data.findings ?? []).map((finding) => ({
        ...finding,
        source: finding.source ?? "static",
      }));

      let runtimeFindings: A11yFinding[] = [];
      let runtimePreviewError: string | undefined;

      try {
        const previewResult = await runPreviewAnalysis(code);
        runtimeFindings = previewResult.runtimeFindings;
        runtimePreviewError = previewResult.previewError;
      } catch {
        runtimePreviewError = "Preview analysis failed.";
      }

      setFindings([...staticFindings, ...runtimeFindings]);
      setParseError(data.parseError ?? null);
      setPreviewError(runtimePreviewError ?? null);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  return (
    <>
      <PreviewFrame />
      <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:gap-8">
        <section aria-labelledby="editor-heading" className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="editor-heading" className="text-lg font-semibold">
              Component Code
            </h2>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                type="button"
                className="flex-1 sm:flex-none"
                onClick={() => void runAnalysis()}
                disabled={isLoading}
              >
                <Play className="h-4 w-4" aria-hidden />
                Analyze
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => setSaveOpen(true)}
                disabled={isLoading}
              >
                <Save className="h-4 w-4" aria-hidden />
                Save
              </Button>
            </div>
          </div>
          <CodeEditor value={code} onChange={setCode} />
        </section>

        <section aria-labelledby="results-heading" className="min-w-0">
          <h2 id="results-heading" className="sr-only">
            Analysis Results
          </h2>
          <ResultsPanel
            findings={findings}
            parseError={parseError}
            previewError={previewError}
            isLoading={isLoading}
          />
        </section>
      </div>

      <SaveAuditDialog
        open={saveOpen}
        onOpenChange={setSaveOpen}
        code={code}
        findings={findings}
      />
    </>
  );
}
