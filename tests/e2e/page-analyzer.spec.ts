import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Page Analyzer", () => {
  test("page has no accessibility violations", async ({ page }) => {
    await page.goto("/page-analyzer");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("renders mocked scan results", async ({ page }) => {
    await page.route("**/api/scan", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
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
      });
    });

    await page.goto("/page-analyzer");
    await page.getByLabel("Page URL").fill("https://example.com");
    await page.getByRole("button", { name: "Scan page" }).click();
    await expect(page.getByText("1 issue found")).toBeVisible({
      timeout: 15_000,
    });
    await page.getByRole("button", { name: /1\.1\.1/i }).click();
    await expect(
      page.getByText("Images must have alternate text"),
    ).toBeVisible();
  });
});

test.describe("Route redirects", () => {
  test("redirects /analyzer to /component-analyzer", async ({ page }) => {
    await page.goto("/analyzer");
    await page.waitForURL("**/component-analyzer");
    expect(page.url()).toContain("/component-analyzer");
  });
});
