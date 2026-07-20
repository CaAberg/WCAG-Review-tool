"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getEmailConfirmRedirectUrl } from "@/lib/supabase/site-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const signUpSchema = signInSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

export type AuthFormProps = {
  className?: string;
  compact?: boolean;
  callbackUrl?: string;
  onSuccess?: () => void;
};

function isEmailNotConfirmedError(message: string): boolean {
  return /email not confirmed/i.test(message);
}

/** Email/password sign-in and sign-up form backed by Supabase Auth. */
export function AuthForm({
  className,
  compact = false,
  callbackUrl,
  onSuccess,
}: AuthFormProps) {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const completeSignIn = () => {
    onSuccess?.();
    if (callbackUrl) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      router.refresh();
    }
  };

  const handleSignIn = async (data: SignInForm) => {
    setIsSubmitting(true);
    setAuthError(null);
    setUnconfirmedEmail(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    setIsSubmitting(false);

    if (error) {
      setAuthError(error.message);
      if (isEmailNotConfirmedError(error.message)) {
        setUnconfirmedEmail(data.email);
      }
      return;
    }

    completeSignIn();
  };

  const handleSignUp = async (data: SignUpForm) => {
    setIsSubmitting(true);
    setAuthError(null);
    setUnconfirmedEmail(null);

    const supabase = createClient();
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: getEmailConfirmRedirectUrl(),
      },
    });

    setIsSubmitting(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (!signUpData.session) {
      const params = new URLSearchParams({ email: data.email });
      router.push(`/account/check-email?${params.toString()}`);
      return;
    }

    completeSignIn();
  };

  return (
    <div className={cn(className)}>
      {!isSupabaseConfigured() ? (
        <p className="text-sm text-muted-foreground">
          Supabase is not configured. Copy <code>.env.example</code> to{" "}
          <code>.env.local</code> and add your project credentials to enable
          sign-in and saved audits.
        </p>
      ) : (
      <Tabs defaultValue="signin">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Create account</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <form
            className="mt-4 space-y-4"
            noValidate
            onSubmit={(e) => void signInForm.handleSubmit(handleSignIn)(e)}
          >
            <div className="space-y-2">
              <Label htmlFor={compact ? "dialog-signin-email" : "signin-email"}>
                Email
              </Label>
              <Input
                id={compact ? "dialog-signin-email" : "signin-email"}
                type="email"
                autoComplete="email"
                {...signInForm.register("email")}
              />
              {signInForm.formState.errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {signInForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor={compact ? "dialog-signin-password" : "signin-password"}
              >
                Password
              </Label>
              <Input
                id={compact ? "dialog-signin-password" : "signin-password"}
                type="password"
                autoComplete="current-password"
                {...signInForm.register("password")}
              />
              {signInForm.formState.errors.password && (
                <p className="text-sm text-destructive" role="alert">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>
            {authError && (
              <p className="text-sm text-destructive" role="alert">
                {authError}
              </p>
            )}
            {unconfirmedEmail && (
              <p className="text-sm text-muted-foreground">
                <Link
                  href={`/account/check-email?email=${encodeURIComponent(unconfirmedEmail)}`}
                  className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  Check your email or resend confirmation
                </Link>
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Log in"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form
            className="mt-4 space-y-4"
            noValidate
            onSubmit={(e) => void signUpForm.handleSubmit(handleSignUp)(e)}
          >
            <div className="space-y-2">
              <Label htmlFor={compact ? "dialog-signup-email" : "signup-email"}>
                Email
              </Label>
              <Input
                id={compact ? "dialog-signup-email" : "signup-email"}
                type="email"
                autoComplete="email"
                {...signUpForm.register("email")}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor={compact ? "dialog-signup-password" : "signup-password"}
              >
                Password
              </Label>
              <Input
                id={compact ? "dialog-signup-password" : "signup-password"}
                type="password"
                autoComplete="new-password"
                {...signUpForm.register("password")}
              />
              {signUpForm.formState.errors.password && (
                <p className="text-sm text-destructive" role="alert">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor={compact ? "dialog-signup-confirm" : "signup-confirm"}
              >
                Confirm password
              </Label>
              <Input
                id={compact ? "dialog-signup-confirm" : "signup-confirm"}
                type="password"
                autoComplete="new-password"
                {...signUpForm.register("confirmPassword")}
              />
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive" role="alert">
                  {signUpForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            {authError && (
              <p className="text-sm text-destructive" role="alert">
                {authError}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
}
