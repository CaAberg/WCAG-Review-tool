import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PageAnalyzerWorkspace } from "@/components/page-analyzer/page-analyzer-workspace";

describe("PageAnalyzerWorkspace", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("submits a URL and renders scan results", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          url: "https://example.com",
          findings: [
            {
              ruleId: "image-alt",
              message: "Images must have alternate text",
              severity: "blocking",
              wcagCriteria: ["1.1.1"],
              line: 0,
              column: 0,
              element: "img",
              suggestion: "Add alt text.",
              source: "axe",
            },
          ],
          scannedAt: new Date().toISOString(),
        }),
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
      expect(screen.getByText(/1 issue found/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /1\.1\.1/i }));
    expect(
      screen.getByText(/Images must have alternate text/i),
    ).toBeInTheDocument();
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
      expect(screen.getByText(/scan error/i)).toBeInTheDocument();
    });
  });
});
