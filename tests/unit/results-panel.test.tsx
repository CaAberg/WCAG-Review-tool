import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach } from "vitest";
import { ResultsPanel } from "@/components/analyzer/results-panel";
import type { A11yFinding } from "@/lib/a11y/types";

const sampleFinding: A11yFinding = {
  ruleId: "image-alt",
  message: "<img> element is missing an alt attribute.",
  severity: "blocking",
  wcagCriteria: ["1.1.1"],
  line: 3,
  column: 4,
  element: "img",
  suggestion: '<img src="..." alt="Description" />',
};

describe("ResultsPanel", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders no issues state", () => {
    render(<ResultsPanel findings={[]} />);
    expect(screen.getByText("No issues found")).toBeInTheDocument();
  });

  it("renders parse error state", () => {
    render(<ResultsPanel findings={[]} parseError="Unexpected token" />);
    expect(screen.getByText("Parse Error")).toBeInTheDocument();
    expect(screen.getByText("Unexpected token")).toBeInTheDocument();
  });

  it("renders findings grouped by criterion", () => {
    render(<ResultsPanel findings={[sampleFinding]} />);
    expect(screen.getByText(/1 issue found/)).toBeInTheDocument();
    expect(screen.getByText("1.1.1")).toBeInTheDocument();
    expect(screen.getByText(/must fix/i)).toBeInTheDocument();
  });

  it("shows dynamic rule count in empty state", () => {
    render(<ResultsPanel findings={[]} />);
    expect(screen.getByText(/analyzer checks/i)).toBeInTheDocument();
  });

  it("copies suggestion to clipboard", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator.clipboard, "writeText").mockImplementation(writeText);

    render(<ResultsPanel findings={[sampleFinding]} />);

    await user.click(screen.getByRole("button", { name: /Non-text Content/i }));
    await user.click(screen.getByRole("button", { name: "Copy suggestion" }));
    expect(writeText).toHaveBeenCalledWith(sampleFinding.suggestion);
  });
});
