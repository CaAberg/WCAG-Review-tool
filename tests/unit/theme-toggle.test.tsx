import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { ThemeToggle } from "@/components/theme-toggle";

const mockTheme = vi.hoisted(() => ({
  resolvedTheme: "light",
  setTheme: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => mockTheme,
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockTheme.resolvedTheme = "light";
    mockTheme.setTheme.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows switch to dark mode label in light theme", async () => {
    render(<ThemeToggle />);

    expect(
      await screen.findByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
  });

  it("calls setTheme with dark when clicked in light mode", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(
      await screen.findByRole("button", { name: "Switch to dark mode" }),
    );

    expect(mockTheme.setTheme).toHaveBeenCalledWith("dark");
  });

  it("shows switch to light mode label in dark theme", async () => {
    mockTheme.resolvedTheme = "dark";

    render(<ThemeToggle />);

    expect(
      await screen.findByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });

  it("calls setTheme with light when clicked in dark mode", async () => {
    mockTheme.resolvedTheme = "dark";
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(
      await screen.findByRole("button", { name: "Switch to light mode" }),
    );

    expect(mockTheme.setTheme).toHaveBeenCalledWith("light");
  });
});
