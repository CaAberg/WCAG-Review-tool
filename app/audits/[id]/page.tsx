import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ReadOnlyCodeViewer } from "@/components/analyzer/read-only-code-viewer";
import { ResultsPanel } from "@/components/analyzer/results-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuditById, getSessionUser } from "@/lib/supabase/audits";

export type AuditDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AuditDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return { title: "Audit" };

  const audit = await getAuditById(id, user.id);
  return { title: audit?.title ?? "Audit not found" };
}

/** Detail page for a single saved audit. */
export default async function AuditDetailPage({
  params,
}: AuditDetailPageProps) {
  const { id } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect(`/account?callbackUrl=/audits/${id}`);
  }

  const audit = await getAuditById(id, user.id);

  if (!audit) notFound();

  const blockingCount = audit.findings.filter(
    (f) => f.severity === "blocking",
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">{audit.title}</h1>
            <Badge variant="secondary">
              {audit.findings.length} issue
              {audit.findings.length === 1 ? "" : "s"}
            </Badge>
            {blockingCount > 0 && (
              <Badge variant="destructive">{blockingCount} blocking</Badge>
            )}
          </div>
          <p className="mt-2 text-muted-foreground">
            Saved {new Date(audit.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/audits">Back to audits</Link>
          </Button>
          <Button asChild>
            <Link href={`/analyzer?audit=${audit.id}`}>Open in analyzer</Link>
          </Button>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:gap-8">
        <section aria-labelledby="saved-code-heading" className="min-w-0">
          <h2 id="saved-code-heading" className="mb-4 text-lg font-semibold">
            Component Code
          </h2>
          <ReadOnlyCodeViewer value={audit.code} />
        </section>

        <section aria-labelledby="saved-results-heading" className="min-w-0">
          <h2 id="saved-results-heading" className="sr-only">
            Analysis Results
          </h2>
          <ResultsPanel findings={audit.findings} />
        </section>
      </div>
    </div>
  );
}
