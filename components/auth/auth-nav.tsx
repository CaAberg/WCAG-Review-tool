"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

/** Header navigation showing sign-in link or user email with sign-out. */
export function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  if (isLoading) {
    return (
      <span className="text-sm text-muted-foreground" aria-live="polite">
        ...
      </span>
    );
  }

  if (!user) {
    return (
      <Link
        href="/account"
        className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      >
        Sign in
      </Link>
    );
  }

  const displayEmail =
    user.email && user.email.length > 20
      ? `${user.email.slice(0, 18)}…`
      : user.email;

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {displayEmail}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => void handleSignOut()}
      >
        Sign out
      </Button>
    </div>
  );
}
