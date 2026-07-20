import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

vi.mock("@/lib/supabase/client");
vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: vi.fn(() => true),
}));

vi.mock("@/lib/supabase/site-url", () => ({
  getEmailConfirmRedirectUrl: () => "http://localhost:3000/auth/confirm",
}));

describe("AuthForm", () => {
  beforeEach(() => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(true);
    vi.mocked(createClient).mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
        signUp: vi.fn().mockResolvedValue({
          data: { user: { id: "1" }, session: null },
          error: null,
        }),
      },
    } as never);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders sign in and create account tabs", () => {
    render(<AuthForm />);
    expect(screen.getByRole("tab", { name: "Sign in" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Create account" }),
    ).toBeInTheDocument();
  });

  it("shows setup message when Supabase is not configured", () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);

    render(<AuthForm />);

    expect(screen.getByText(/Supabase is not configured/i)).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Sign in" })).not.toBeInTheDocument();
  });

  it("shows validation error for invalid email on sign in", async () => {
    const user = userEvent.setup();
    render(<AuthForm />);

    const email = document.getElementById("signin-email");
    const password = document.getElementById("signin-password");
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();

    await user.type(email!, "not-an-email");
    await user.type(password!, "secret1");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      await screen.findByText("Enter a valid email address."),
    ).toBeInTheDocument();
  });

  it("shows password mismatch error on sign up", async () => {
    const user = userEvent.setup();
    render(<AuthForm />);

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[1]!);

    await user.type(
      document.getElementById("signup-email")!,
      "user@example.com",
    );
    await user.type(document.getElementById("signup-password")!, "secret1");
    await user.type(document.getElementById("signup-confirm")!, "different");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(
      await screen.findByText("Passwords do not match."),
    ).toBeInTheDocument();
  });

  it("redirects to check-email when sign up requires confirmation", async () => {
    const user = userEvent.setup();
    render(<AuthForm />);

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[1]!);

    await user.type(
      document.getElementById("signup-email")!,
      "user@example.com",
    );
    await user.type(document.getElementById("signup-password")!, "secret12");
    await user.type(document.getElementById("signup-confirm")!, "secret12");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(mockPush).toHaveBeenCalledWith(
      "/account/check-email?email=user%40example.com",
    );
  });
});
