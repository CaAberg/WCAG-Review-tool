import "server-only";

import AxeBuilder from "@axe-core/playwright";
import type { Browser, BrowserContext, Page } from "playwright-core";
import { axeToFindings } from "./axe-to-findings";
import { enrichFindingsOnPage } from "./enrich-findings";
import { launchScanBrowser } from "./resolve-browser";
import type { PageScanResult } from "./types";
import { getRenderCache, setRenderCache } from "../proxy/render-cache";

const RENDER_TIMEOUT_MS = 120_000;

/** Closes Playwright resources opened for a render. */
async function closeRenderResources(
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

/** Loads a page and returns rendered HTML plus accessibility findings. */
export async function renderPage(url: string): Promise<PageScanResult> {
  const cached = getRenderCache(url);
  if (cached) {
    return {
      url: cached.url,
      findings: cached.findings,
      scannedAt: cached.scannedAt,
      viewport: cached.viewport,
      pageHeight: cached.pageHeight,
      proxyUrl: `/page-analyzer/proxy?url=${encodeURIComponent(cached.url)}`,
    };
  }

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
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(RENDER_TIMEOUT_MS);

    const result = await loadAndAnalyzePage(page, url);
    if (result.scanError) {
      return { ...result, scannedAt };
    }

    const html = await page.content();
    setRenderCache({
      html,
      url,
      findings: result.findings,
      viewport: result.viewport ?? { width: 1280, height: 720 },
      pageHeight: result.pageHeight ?? 720,
      scannedAt,
    });

    return {
      ...result,
      scannedAt,
      proxyUrl: `/page-analyzer/proxy?url=${encodeURIComponent(url)}`,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Page render failed unexpectedly.";

    return {
      url,
      findings: [],
      scanError: message,
      scannedAt,
    };
  } finally {
    await closeRenderResources(browser, context);
  }
}

/** Navigates a Playwright page, runs axe, and enriches findings. */
async function loadAndAnalyzePage(
  page: Page,
  url: string,
): Promise<Omit<PageScanResult, "scannedAt">> {
  const response = await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: RENDER_TIMEOUT_MS,
  });

  if (!response) {
    return {
      url,
      findings: [],
      scanError: "Could not load the page.",
    };
  }

  if (response.status() >= 400) {
    return {
      url,
      findings: [],
      scanError: `Page returned HTTP ${response.status()}.`,
    };
  }

  await page.waitForTimeout(1_000);

  const axeResults = await new AxeBuilder({ page }).analyze();
  const baseFindings = axeToFindings(axeResults);
  const findings = await enrichFindingsOnPage(page, baseFindings, url);
  const viewport = page.viewportSize() ?? { width: 1280, height: 720 };
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);

  return {
    url,
    findings,
    viewport,
    pageHeight,
  };
}
