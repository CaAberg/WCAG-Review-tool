"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/** Error boundary for the page analyzer route. */
export default function PageAnalyzerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">
        The page analyzer encountered an error. Please try again.
      </p>
      <Button type="button" onClick={reset} className="mt-4 min-h-11">
        Try again
      </Button>
    </div>
  );
}
