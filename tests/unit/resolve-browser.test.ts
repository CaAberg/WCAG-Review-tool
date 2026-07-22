import { describe, expect, it } from "vitest";
import {
  findPlaywrightChromiumPath,
  isServerlessEnvironment,
} from "@/lib/a11y/page-scan/resolve-browser";

describe("resolve-browser", () => {
  it("detects serverless environments from Vercel env vars", () => {
    const originalVercel = process.env.VERCEL;
    process.env.VERCEL = "1";

    expect(isServerlessEnvironment()).toBe(true);

    if (originalVercel === undefined) {
      delete process.env.VERCEL;
    } else {
      process.env.VERCEL = originalVercel;
    }
  });

  it("returns undefined when Playwright browsers are unavailable", () => {
    const originalPath = process.env.PLAYWRIGHT_BROWSERS_PATH;
    process.env.PLAYWRIGHT_BROWSERS_PATH = "/definitely/missing/browsers";

    expect(findPlaywrightChromiumPath()).toBeUndefined();

    if (originalPath === undefined) {
      delete process.env.PLAYWRIGHT_BROWSERS_PATH;
    } else {
      process.env.PLAYWRIGHT_BROWSERS_PATH = originalPath;
    }
  });
});
