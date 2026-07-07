/** Loading state for the account page. */
export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="mt-8 h-64 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
