import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuditsUnauthenticated } from "@/components/audits/audits-unauthenticated";
import { getSessionUser, listAuditsForUser } from "@/lib/supabase/audits";

export const metadata: Metadata = {
  title: "My Audits",
  description: "View your saved component accessibility audits.",
};

/** Page listing the current user's saved audits. */
export default async function AuditsPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">My Audits</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to view audits you have saved.
        </p>
        <AuditsUnauthenticated />
      </div>
    );
  }

  const audits = await listAuditsForUser(user.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Audits</h1>
          <p className="mt-2 text-muted-foreground">
            Your saved component accessibility analyses.
          </p>
        </div>
        <Button asChild className="w-full shrink-0 sm:w-auto">
          <Link href="/analyzer">New audit</Link>
        </Button>
      </div>

      {audits.length === 0 ? (
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>No saved audits yet</CardTitle>
            <CardDescription>
              Run an analysis and click Save to store your results here.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className="mt-10 space-y-4">
          {audits.map((audit) => (
            <li key={audit.id}>
              <Link
                href={`/audits/${audit.id}`}
                className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="min-w-0 transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="break-words text-lg">{audit.title}</CardTitle>
                      <Badge variant="secondary">
                        {audit.findings.length} issue
                        {audit.findings.length === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {new Date(audit.created_at).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
