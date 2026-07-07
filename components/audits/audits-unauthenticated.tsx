"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** Shown when unauthenticated users visit /audits. */
export function AuditsUnauthenticated() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        callbackUrl="/audits"
      />
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Sign in to view your audits</CardTitle>
          <CardDescription>
            Create a free account to save component analyses and access them
            anytime from this page.
          </CardDescription>
        </CardHeader>
        <div className="flex gap-3 px-6 pb-6">
          <Button type="button" onClick={() => setAuthOpen(true)}>
            Sign in
          </Button>
          <Button asChild variant="outline">
            <Link href="/account?callbackUrl=/audits">Create account</Link>
          </Button>
        </div>
      </Card>
    </>
  );
}
