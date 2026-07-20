"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";

/** Signs the user out and refreshes the page. */
export function AccountSignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => void handleSignOut()}
    >
      Sign out
    </Button>
  );
}
