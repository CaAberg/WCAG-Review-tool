import { describe, expect, it, vi } from "vitest";
import fs from "fs";
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

    const originalExistsSync = fs.existsSync;
    vi.spyOn(fs, "existsSync").mockImplementation((target) => {
      const normalized = String(target);
      if (normalized.includes("ms-playwright")) {
        return false;
      }

      return originalExistsSync(target);
    });

    expect(findPlaywrightChromiumPath()).toBeUndefined();

    vi.restoreAllMocks();

    if (originalPath === undefined) {
      delete process.env.PLAYWRIGHT_BROWSERS_PATH;
    } else {
      process.env.PLAYWRIGHT_BROWSERS_PATH = originalPath;
    }
  });
});
