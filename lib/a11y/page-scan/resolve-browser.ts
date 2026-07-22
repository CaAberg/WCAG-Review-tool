import fs from "fs";
import os from "os";
import path from "path";
import type { Browser } from "playwright-core";
import { chromium as playwrightChromium } from "playwright-core";
import chromium from "@sparticuz/chromium";

const LOCAL_LAUNCH_ARGS = ["--no-sandbox", "--disable-setuid-sandbox"];

/** Returns true when running in a serverless deployment such as Vercel. */
export function isServerlessEnvironment(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

/** Finds a Playwright-managed Chromium binary installed via `playwright install`. */
export function findPlaywrightChromiumPath(): string | undefined {
  const cacheRoots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    path.join(os.homedir(), "AppData", "Local", "ms-playwright"),
    path.join(os.homedir(), "Library", "Caches", "ms-playwright"),
    path.join(os.homedir(), ".cache", "ms-playwright"),
  ].filter((value): value is string => Boolean(value));

  const executableNames =
    process.platform === "win32"
      ? ["chrome.exe", "chrome-win64/chrome.exe", "chrome-win/chrome.exe"]
      : process.platform === "darwin"
        ? ["chrome-mac/Chromium.app/Contents/MacOS/Chromium"]
        : ["chrome-linux/chrome"];

  for (const cacheRoot of cacheRoots) {
    if (!fs.existsSync(cacheRoot)) continue;

    const entries = fs.readdirSync(cacheRoot, { withFileTypes: true });
    const chromiumDirs = entries
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("chromium"))
      .map((entry) => entry.name)
      .sort()
      .reverse();

    for (const dirName of chromiumDirs) {
      for (const executableName of executableNames) {
        const candidate = path.join(cacheRoot, dirName, executableName);
        if (fs.existsSync(candidate)) return candidate;
      }
    }
  }

  return undefined;
}

/** Launches Chromium for local dev or serverless page scans. */
export async function launchScanBrowser(): Promise<Browser> {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return playwrightChromium.launch({
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      args: LOCAL_LAUNCH_ARGS,
      headless: true,
    });
  }

  if (isServerlessEnvironment()) {
    return playwrightChromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const playwrightBrowser = findPlaywrightChromiumPath();
  if (playwrightBrowser) {
    return playwrightChromium.launch({
      executablePath: playwrightBrowser,
      args: LOCAL_LAUNCH_ARGS,
      headless: true,
    });
  }

  const channels = ["msedge", "chrome", "chrome-beta"] as const;
  let lastError: unknown;

  for (const channel of channels) {
    try {
      return await playwrightChromium.launch({
        channel,
        args: LOCAL_LAUNCH_ARGS,
        headless: true,
      });
    } catch (error) {
      lastError = error;
    }
  }

  const detail =
    lastError instanceof Error ? lastError.message : "Unknown launch error.";

  throw new Error(
    `No Chromium browser found for page scans. Install one with \`npx playwright install chromium\`, set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, or install Chrome/Edge. ${detail}`,
  );
}
