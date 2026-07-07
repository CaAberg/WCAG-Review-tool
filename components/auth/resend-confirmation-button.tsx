"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { getEmailConfirmRedirectUrl } from "@/lib/supabase/site-url";
import { Button } from "@/components/ui/button";

export type ResendConfirmationButtonProps = {
  email: string;
};

/** Resends the signup confirmation email via Supabase Auth. */
export function ResendConfirmationButton({
  email,
}: ResendConfirmationButtonProps) {
  const [isSending, setIsSending] = useState(false);

  const handleResend = async () => {
    setIsSending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: getEmailConfirmRedirectUrl(),
      },
    });

    setIsSending(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Confirmation email sent. Check your inbox.");
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => void handleResend()}
      disabled={isSending}
    >
      {isSending ? "Sending..." : "Resend confirmation email"}
    </Button>
  );
}
