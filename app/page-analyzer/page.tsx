import type { Metadata } from "next";
import { PageAnalyzerWorkspace } from "@/components/page-analyzer/page-analyzer-workspace";

export const metadata: Metadata = {
  title: "Page Analyzer",
  description:
    "Scan any public web page for WCAG accessibility issues using axe-core.",
};

/** Page analyzer for live URL accessibility scans. */
export default function PageAnalyzerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageAnalyzerWorkspace />
    </div>
  );
}
