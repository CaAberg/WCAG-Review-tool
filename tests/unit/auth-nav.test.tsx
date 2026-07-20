import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { AuthNav } from "@/components/auth/auth-nav";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

describe("AuthNav", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);
  });

  it("shows sign in link without calling Supabase when not configured", async () => {
    render(<AuthNav />);

    expect(await screen.findByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });
});
