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
  suggestion: "Add alt text to this image.",
  fixSnippet: '<img src="/logo.png" alt="Description" />',
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

  it("copies fixSnippet to clipboard when present", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator.clipboard, "writeText").mockImplementation(writeText);

    render(<ResultsPanel findings={[sampleFinding]} />);

    await user.click(screen.getByRole("button", { name: /Non-text Content/i }));
    await user.click(screen.getByRole("button", { name: "Copy suggestion" }));
    expect(writeText).toHaveBeenCalledWith(sampleFinding.fixSnippet);
  });

  it("copies suggestion when fixSnippet is absent", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator.clipboard, "writeText").mockImplementation(writeText);

    const findingWithoutSnippet: A11yFinding = {
      ...sampleFinding,
      fixSnippet: undefined,
    };

    render(<ResultsPanel findings={[findingWithoutSnippet]} />);

    await user.click(screen.getByRole("button", { name: /Non-text Content/i }));
    await user.click(screen.getByRole("button", { name: "Copy suggestion" }));
    expect(writeText).toHaveBeenCalledWith(findingWithoutSnippet.suggestion);
  });

  it("renders page mode empty state copy", () => {
    render(
      <ResultsPanel
        findings={[]}
        mode="page"
        scannedUrl="https://example.com"
      />,
    );
    expect(screen.getByText(/No axe violations were detected/i)).toBeInTheDocument();
  });
});
