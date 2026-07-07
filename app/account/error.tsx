"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export type AccountErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Error boundary for the account page. */
export default function AccountError({ error, reset }: AccountErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">
        We could not load your account. Please try again.
      </p>
      <Button className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
