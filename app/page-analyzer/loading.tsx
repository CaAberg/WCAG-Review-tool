/** Loading state for the page analyzer. */
export default function PageAnalyzerLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="h-64 animate-pulse rounded-lg bg-muted" aria-hidden />
      <p className="sr-only">Loading page analyzer...</p>
    </div>
  );
}
