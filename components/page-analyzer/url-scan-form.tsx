"use client";

import { useId, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type UrlScanFormProps = {
  defaultUrl?: string;
  isLoading?: boolean;
  onSubmit: (url: string) => void;
};

/** Accessible URL input form for page accessibility scans. */
export function UrlScanForm({
  defaultUrl = "https://",
  isLoading = false,
  onSubmit,
}: UrlScanFormProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setError("Enter a URL to scan.");
      return;
    }

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setError("Only http and https URLs are supported.");
        return;
      }
    } catch {
      setError("Enter a valid URL.");
      return;
    }

    setError(null);
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor={inputId}>Page URL</Label>
        <Input
          id={inputId}
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://example.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          disabled={isLoading}
          required
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isLoading} className="min-h-11">
        <Search className="h-4 w-4" aria-hidden />
        {isLoading ? "Scanning..." : "Scan page"}
      </Button>
    </form>
  );
}
