"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type AuditDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Error boundary for audit detail page. */
export default function AuditDetailError({
  error,
  reset,
}: AuditDetailErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Could not load audit</h1>
      <p className="mt-2 text-muted-foreground">
        Something went wrong while loading this audit.
      </p>
      <div className="mt-4 flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/audits">Back to audits</Link>
        </Button>
      </div>
    </div>
  );
}
