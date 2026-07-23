import "server-only";

import AxeBuilder from "@axe-core/playwright";
import type { Browser, BrowserContext } from "playwright-core";
import { axeToFindings } from "./axe-to-findings";
import { enrichFindingsOnPage } from "./enrich-findings";
import { launchScanBrowser } from "./resolve-browser";
import type { PageScanResult } from "./types";

const SCAN_TIMEOUT_MS = 120_000;

/** Closes Playwright resources opened for a scan. */
async function closeScanResources(
  browser: Browser | undefined,
  context: BrowserContext | undefined,
): Promise<void> {
  if (context) {
    await context.close().catch(() => undefined);
  }

  if (browser) {
    await browser.close().catch(() => undefined);
  }
}

/** Scans a public URL with headless Chromium and axe-core. */
export async function scanPage(url: string): Promise<PageScanResult> {
  const scannedAt = new Date().toISOString();
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;

  try {
    browser = await launchScanBrowser();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not launch a browser.";

    return {
      url,
      findings: [],
      scanError: message,
      scannedAt,
    };
  }

  try {
    context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(SCAN_TIMEOUT_MS);
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: SCAN_TIMEOUT_MS,
    });

    if (!response) {
      return {
        url,
        findings: [],
        scanError: "Could not load the page.",
        scannedAt,
      };
    }

    if (response.status() >= 400) {
      return {
        url,
        findings: [],
        scanError: `Page returned HTTP ${response.status()}.`,
        scannedAt,
      };
    }

    const axeResults = await new AxeBuilder({ page }).analyze();
    const baseFindings = axeToFindings(axeResults);
    const findings = await enrichFindingsOnPage(page, baseFindings, url);
    const viewport = page.viewportSize() ?? { width: 1280, height: 720 };
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);

    return {
      url,
      findings,
      scannedAt,
      viewport,
      pageHeight,
      proxyUrl: `/page-analyzer/proxy?url=${encodeURIComponent(url)}`,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Page scan failed unexpectedly.";

    return {
      url,
      findings: [],
      scanError: message,
      scannedAt,
    };
  } finally {
    await closeScanResources(browser, context);
  }
}
