import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Not found page for missing audit. */
export default function AuditNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Audit not found</h1>
      <p className="mt-2 text-muted-foreground">
        This audit does not exist or you do not have access to it.
      </p>
      <Button asChild className="mt-4">
        <Link href="/audits">Back to audits</Link>
      </Button>
    </div>
  );
}
