"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ScanLoadingPanelProps = {
  url: string | null;
  message?: string | null;
  className?: string;
};

/** Prominent loading state shown while a page scan is in progress. */
export function ScanLoadingPanel({
  url,
  message,
  className,
}: ScanLoadingPanelProps) {
  return (
    <div
      className={cn(
        "flex min-h-[420px] flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
      <div className="space-y-2">
        <p className="text-base font-medium">Scan in progress</p>
        {url && (
          <p className="max-w-xl truncate text-sm text-muted-foreground">{url}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {message ?? "Loading the page and running accessibility checks."}
        </p>
        <p className="text-xs text-muted-foreground">
          The first scan can take up to a minute while the browser starts.
        </p>
      </div>
    </div>
  );
}
