"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { A11yFinding } from "@/lib/a11y/types";

const saveAuditSchema = z.object({
  title: z.string().min(1, "Title is required.").max(100),
});

type SaveAuditForm = z.infer<typeof saveAuditSchema>;

export type SaveAuditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  findings: A11yFinding[];
};

/** Dialog for saving an audit; prompts for auth when not signed in. */
export function SaveAuditDialog({
  open,
  onOpenChange,
  code,
  findings,
}: SaveAuditDialogProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaveAuditForm>({
    resolver: zodResolver(saveAuditSchema),
    defaultValues: { title: "My component audit" },
  });

  useEffect(() => {
    if (!open) return;

    if (!isSupabaseConfigured()) {
      setAuthChecked(true);
      toast.error(
        "Saved audits require Supabase. Copy .env.example to .env.local and add your credentials.",
      );
      onOpenChange(false);
      return;
    }

    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthChecked(true);
      if (!data.user) {
        setAuthOpen(true);
      }
    });
  }, [open, onOpenChange]);

  const onSubmit = async (data: SaveAuditForm) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          code,
          findings,
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        id?: string;
      };

      if (response.status === 401) {
        setAuthOpen(true);
        return;
      }

      if (!response.ok) {
        toast.error(result.error ?? "Failed to save audit.");
        return;
      }

      toast.success("Audit saved successfully.");
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAuthSuccess = async () => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    setAuthOpen(false);
  };

  if (!open) return null;

  return (
    <>
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => void handleAuthSuccess()}
        callbackUrl="/component-analyzer"
      />

      {!authOpen && authChecked && user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-audit-title"
        >
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
            <h2 id="save-audit-title" className="text-lg font-semibold">
              Save Audit
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Save this analysis to your account and revisit it anytime.
            </p>
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => void handleSubmit(onSubmit)(e)}
            >
              <div className="space-y-2">
                <Label htmlFor="audit-title">Title</Label>
                <Input id="audit-title" {...register("title")} />
                {errors.title && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save audit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
