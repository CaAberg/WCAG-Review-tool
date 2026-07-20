import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUser } from "@/lib/supabase/audits";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AccountSignOutButton } from "@/components/auth/account-sign-out-button";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Sign in or create an account to save your accessibility audits.",
};

export type AccountPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

/** Account page for sign up, sign in, and sign out. */
export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { callbackUrl, error } = await searchParams;
  const user = await getSessionUser();

  if (user && callbackUrl) {
    redirect(callbackUrl);
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Account unavailable</CardTitle>
            <CardDescription>
              Sign-in and saved audits require Supabase. Copy{" "}
              <code>.env.example</code> to <code>.env.local</code>, add your
              project URL and anon key, then restart the dev server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/analyzer">Back to analyzer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Your account</CardTitle>
            <CardDescription>Signed in as {user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row">
            <Button asChild>
              <Link href="/audits">My audits</Link>
            </Button>
            <AccountSignOutButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Account</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in or create an account to save and revisit your audits.
        </p>
      </div>
      {error === "confirmation_failed" && (
        <div
          className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
        >
          Email confirmation failed or the link has expired. Please sign in or
          create an account again to receive a new link.
        </div>
      )}
      <Card>
        <CardContent className="pt-6">
          <AuthForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
