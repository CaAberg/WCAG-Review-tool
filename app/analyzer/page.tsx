import type { Metadata } from "next";
import { AnalyzerWorkspace } from "@/components/analyzer/analyzer-workspace";
import { loadAuditForAnalyzer } from "@/lib/supabase/load-audit-for-analyzer";

export const metadata: Metadata = {
  title: "Component Analyzer",
  description:
    "Paste your React TSX components and get WCAG-aligned accessibility suggestions.",
};

export type AnalyzerPageProps = {
  searchParams: Promise<{ audit?: string }>;
};

/** Analyzer page for pasting and analyzing component code. */
export default async function AnalyzerPage({
  searchParams,
}: AnalyzerPageProps) {
  const { audit: auditId } = await searchParams;
  const savedAudit = auditId ? await loadAuditForAnalyzer(auditId) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Component Analyzer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Paste your TSX component below and run static accessibility checks
          mapped to WCAG 2.2 criteria, plus a live preview check for focus
          obscured (2.4.11).
        </p>
      </div>
      <AnalyzerWorkspace
        initialCode={savedAudit?.code}
        initialFindings={savedAudit?.findings}
      />
    </div>
  );
}
