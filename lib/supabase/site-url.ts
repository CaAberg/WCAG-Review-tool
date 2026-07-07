/** Returns the public site URL for auth email redirects. */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/** Returns the email confirmation redirect URL. */
export function getEmailConfirmRedirectUrl(): string {
  return `${getSiteUrl()}/auth/confirm`;
}
