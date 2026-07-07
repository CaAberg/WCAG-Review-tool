"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

/** Signs the user out and refreshes the page. */
export function AccountSignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
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
