"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth/auth-form";

export type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  callbackUrl?: string;
};

/** Modal dialog prompting users to sign in or create an account. */
export function AuthDialog({
  open,
  onOpenChange,
  onSuccess,
  callbackUrl,
}: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Sign in to continue</DialogTitle>
        <DialogDescription>
          Create a free account or sign in to save and view your accessibility
          audits.
        </DialogDescription>
        <AuthForm
          compact
          callbackUrl={callbackUrl}
          onSuccess={() => {
            onOpenChange(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
