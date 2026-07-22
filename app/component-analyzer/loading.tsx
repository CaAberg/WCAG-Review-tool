/** Loading state for the analyzer page. */
export default function AnalyzerLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
      <div className="mt-4 h-4 w-96 animate-pulse rounded-md bg-muted" />
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="h-[400px] animate-pulse rounded-md bg-muted" />
        <div className="h-[400px] animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}
