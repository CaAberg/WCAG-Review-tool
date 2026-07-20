import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ResendConfirmationButton } from "@/components/auth/resend-confirmation-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { getSessionUser } from "@/lib/supabase/audits";

export const metadata: Metadata = {
  title: "Check Your Email",
  description:
    "Activate your WCAG Access account using the confirmation link sent to your email.",
};

export type CheckEmailPageProps = {
  searchParams: Promise<{ email?: string }>;
};

/** Shown after sign-up when email confirmation is required. */
export default async function CheckEmailPage({
  searchParams,
}: CheckEmailPageProps) {
  const { email } = await searchParams;
  const user = await getSessionUser();

  if (user) {
    redirect("/account/confirmed");
  }

  if (!email) {
    redirect("/account");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            Check your email
          </h1>
          <CardDescription>
            We sent an activation link to{" "}
            <span className="break-all font-medium text-foreground">{email}</span>. Click
            the link in that email to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you do not see the email within a few minutes, check your spam
            folder or resend the confirmation email below.
          </p>
          <ResendConfirmationButton email={email} />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/account">Back to sign in</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
