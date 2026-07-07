import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { getSessionUser } from "@/lib/supabase/audits";

export const metadata: Metadata = {
  title: "Account Activated",
  description:
    "Your WCAG Access account has been confirmed. Start analyzing components for accessibility.",
};

/** Success page shown after email confirmation. */
export default async function AccountConfirmedPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/account");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            Account activated
          </h1>
          <CardDescription>
            Your email is confirmed and you are signed in as{" "}
            <span className="font-medium text-foreground">{user.email}</span>.
            You can now save audits and access them from any device.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/">Go to homepage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/analyzer">Open analyzer</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/audits">My audits</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
