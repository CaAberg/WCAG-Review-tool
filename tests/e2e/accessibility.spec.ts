import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("WCAG Access site", () => {
  test("home page has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("analyzer page has no accessibility violations", async ({ page }) => {
    await page.goto("/analyzer");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("guides page has no accessibility violations", async ({ page }) => {
    await page.goto("/guides");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("guides page lists WCAG guidelines", async ({ page }) => {
    await page.goto("/guides");
    await expect(page.getByRole("heading", { name: "1.1 Text Alternatives" })).toBeVisible();
    await expect(page.getByText("1.1.1").first()).toBeVisible();
  });

  test("account page has no accessibility violations", async ({ page }) => {
    await page.goto("/account");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("check-email page has no accessibility violations", async ({ page }) => {
    await page.goto("/account/check-email?email=test%40example.com");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("analyzer returns findings for bad component", async ({ page }) => {
    await page.goto("/analyzer");
    await page.getByRole("button", { name: "Analyze" }).click();
    await expect(page.getByText(/issue/i)).toBeVisible({ timeout: 10000 });
  });

  test("analyzer shows manual checks for video components", async ({ page }) => {
    await page.goto("/analyzer");
    await page.locator(".cm-content").click();
    await page.keyboard.press("Control+A");
    await page.keyboard.type(
      'export function Demo() { return <video src="/demo.mp4" controls />; }',
    );
    await page.getByRole("button", { name: "Analyze" }).click();
    await expect(page.getByText("Suggested manual checks")).toBeVisible({
      timeout: 10000,
    });
  });

  test("can navigate from home to analyzer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Try the Analyzer" }).first().click();
    await page.waitForURL("**/analyzer");
    await expect(
      page.getByRole("heading", { name: "Component Analyzer" }),
    ).toBeVisible();
  });
});

test.describe("Theme toggle", () => {
  test("toggles dark class on html and passes axe", async ({ page }) => {
    await page.goto("/");

    const toggle = page
      .getByRole("button", { name: /Switch to (dark|light) mode/ })
      .first();
    await expect(toggle).toBeVisible();

    const initialDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );

    await toggle.click();

    await expect
      .poll(async () =>
        page.evaluate(() =>
          document.documentElement.classList.contains("dark"),
        ),
      )
      .toBe(!initialDark);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test("opens mobile menu and navigates to analyzer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("link", { name: "Analyzer" })).toBeVisible();
    await page.getByRole("link", { name: "Analyzer" }).click();
    await page.waitForURL("**/analyzer");
    await expect(
      page.getByRole("heading", { name: "Component Analyzer" }),
    ).toBeVisible();
  });

  test("home page has no axe violations with menu open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("home page has no axe violations with menu closed", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("Mobile analyzer layout", () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test("analyzer page has no horizontal overflow", async ({ page }) => {
    await page.goto("/analyzer");
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  });

  test("analyzer toolbar buttons are visible", async ({ page }) => {
    await page.goto("/analyzer");
    await expect(page.getByRole("button", { name: "Analyze" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
  });

  test("analyzer results render without horizontal overflow", async ({ page }) => {
    await page.goto("/analyzer");
    await page.getByRole("button", { name: "Analyze" }).click();
    await expect(page.getByText(/issue/i)).toBeVisible({ timeout: 10000 });

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  });

  test("unauthenticated audits page has no horizontal overflow", async ({ page }) => {
    await page.goto("/audits");
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  });
});

test.describe("Auth flows", () => {
  test("unauthenticated /audits shows sign in prompt", async ({ page }) => {
    await page.goto("/audits");
    await expect(
      page.getByRole("heading", { name: "Sign in to view your audits" }),
    ).toBeVisible();
  });

  test("save audit opens auth dialog when not signed in", async ({ page }) => {
    await page.goto("/analyzer");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByRole("heading", { name: "Sign in to continue" }),
    ).toBeVisible();
  });

  test("account page shows sign in form", async ({ page }) => {
    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Sign in" })).toBeVisible();
    await expect(
      page.getByRole("tab", { name: "Create account" }),
    ).toBeVisible();
  });
});
