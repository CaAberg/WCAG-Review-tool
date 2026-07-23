import type { A11yFinding } from "../types";
import type { PageViewport } from "../page-scan/types";

/** In-memory cache entry for Playwright-rendered HTML snapshots. */
export type RenderCacheEntry = {
  html: string;
  url: string;
  findings: A11yFinding[];
  viewport: PageViewport;
  pageHeight: number;
  scannedAt: string;
  expiresAt: number;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const renderCache = new Map<string, RenderCacheEntry>();

/** Returns a cache key for a normalized URL. */
export function getRenderCacheKey(url: string): string {
  return url.trim();
}

/** Stores rendered HTML and scan metadata for proxy serving. */
export function setRenderCache(entry: Omit<RenderCacheEntry, "expiresAt">): void {
  renderCache.set(getRenderCacheKey(entry.url), {
    ...entry,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/** Reads rendered HTML from cache when still valid. */
export function getRenderCache(url: string): RenderCacheEntry | undefined {
  const entry = renderCache.get(getRenderCacheKey(url));
  if (!entry) return undefined;

  if (entry.expiresAt <= Date.now()) {
    renderCache.delete(getRenderCacheKey(url));
    return undefined;
  }

  return entry;
}

/** Clears expired cache entries. */
export function pruneRenderCache(): void {
  const now = Date.now();

  for (const [key, entry] of renderCache.entries()) {
    if (entry.expiresAt <= now) {
      renderCache.delete(key);
    }
  }
}
