import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import { ManualChecksPanel } from "@/components/analyzer/manual-checks-panel";

describe("ManualChecksPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows manual video checks when video is present", () => {
    render(
      <ManualChecksPanel code={'export function X() { return <video src="/a.mp4" />; }'} />,
    );

    expect(screen.getByText("Suggested manual checks")).toBeInTheDocument();
    expect(screen.getByText("1.2.4")).toBeInTheDocument();
  });

  it("renders nothing when no manual tags match", () => {
    const { container } = render(
      <ManualChecksPanel code={'export function X() { return <p>Hello</p>; }'} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
