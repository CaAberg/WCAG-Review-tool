import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PageAnalyzerWorkspace } from "@/components/page-analyzer/page-analyzer-workspace";

const mockScanResult = {
  url: "https://example.com",
  findings: [
    {
      findingId: "finding-1",
      ruleId: "image-alt",
      message: "Images must have alternate text",
      severity: "blocking" as const,
      wcagCriteria: ["1.1.1"],
      line: 0,
      column: 0,
      element: "img",
      suggestion: "Add alt text.",
      source: "axe" as const,
      boundingBox: { x: 10, y: 20, width: 100, height: 40 },
    },
  ],
  scannedAt: new Date().toISOString(),
  viewport: { width: 1280, height: 720 },
  pageHeight: 1200,
  proxyUrl: "/page-analyzer/proxy?url=https%3A%2F%2Fexample.com",
};

describe("PageAnalyzerWorkspace", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows a loading state while a scan is in progress", async () => {
    const user = userEvent.setup();
    let resolveFetch: ((value: unknown) => void) | undefined;

    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );

    render(<PageAnalyzerWorkspace />);

    await user.clear(screen.getByRole("textbox", { name: /page url/i }));
    await user.type(
      screen.getByRole("textbox", { name: /page url/i }),
      "https://example.com",
    );
    await user.click(screen.getByRole("button", { name: /scan page/i }));

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getAllByText(/Scan in progress/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/0 errors/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/No accessibility issues detected/i),
    ).not.toBeInTheDocument();

    resolveFetch?.({
      ok: true,
      json: async () => mockScanResult,
    });

    await waitFor(() => {
      expect(screen.getByText(/1 errors/i)).toBeInTheDocument();
    });
  });

  it("submits a URL and renders scan results", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockScanResult,
      }),
    );

    render(<PageAnalyzerWorkspace />);

    await user.clear(screen.getByRole("textbox", { name: /page url/i }));
    await user.type(
      screen.getByRole("textbox", { name: /page url/i }),
      "https://example.com",
    );
    await user.click(screen.getByRole("button", { name: /scan page/i }));

    await waitFor(() => {
      expect(screen.getByText(/Images must have alternate text/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/1 errors/i)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Images must have alternate text/i })).toBeInTheDocument();
  });

  it("shows scan errors from the API", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          error:
            "Private, local, or reserved hosts cannot be scanned from the server.",
        }),
      }),
    );

    render(<PageAnalyzerWorkspace />);

    await user.clear(screen.getByRole("textbox", { name: /page url/i }));
    await user.type(
      screen.getByRole("textbox", { name: /page url/i }),
      "http://localhost:3000",
    );
    await user.click(screen.getByRole("button", { name: /scan page/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Private, local, or reserved hosts cannot be scanned/i),
      ).toBeInTheDocument();
    });
  });
});
