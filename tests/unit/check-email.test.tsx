import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CheckEmailPage from "@/app/account/check-email/page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/supabase/audits", () => ({
  getSessionUser: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/components/auth/resend-confirmation-button", () => ({
  ResendConfirmationButton: () => (
    <button type="button">Resend confirmation email</button>
  ),
}));

describe("CheckEmailPage", () => {
  it("renders check your email heading when email is provided", async () => {
    const page = await CheckEmailPage({
      searchParams: Promise.resolve({ email: "user@example.com" }),
    });

    render(page);
    expect(
      screen.getByRole("heading", { name: "Check your email" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/user@example.com/)).toBeInTheDocument();
  });
});
