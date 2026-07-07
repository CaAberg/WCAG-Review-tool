import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AccountConfirmedPage from "@/app/account/confirmed/page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/supabase/audits", () => ({
  getSessionUser: vi.fn().mockResolvedValue({
    id: "user-1",
    email: "user@example.com",
  }),
}));

describe("AccountConfirmedPage", () => {
  it("renders success message and navigation links", async () => {
    const page = await AccountConfirmedPage();
    render(page);

    expect(
      screen.getByRole("heading", { name: "Account activated" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to homepage" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Open analyzer" })).toHaveAttribute(
      "href",
      "/analyzer",
    );
    expect(screen.getByRole("link", { name: "My audits" })).toHaveAttribute(
      "href",
      "/audits",
    );
  });
});
