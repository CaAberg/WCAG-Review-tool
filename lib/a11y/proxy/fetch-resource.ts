import { validateScanUrl } from "../page-scan/validate-url";

const MAX_RESPONSE_BYTES = 10 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 20_000;

/** Resolves a potentially relative URL against a base page URL. */
export function resolveProxyUrl(baseUrl: string, candidate: string): string {
  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return candidate;
  }
}

/** Builds the proxy URL served by the page analyzer. */
export function buildProxyResourceUrl(targetUrl: string): string {
  return `/page-analyzer/proxy?url=${encodeURIComponent(targetUrl)}`;
}

/** Fetches a remote resource through SSRF-safe validation. */
export async function fetchProxyResource(
  targetUrl: string,
): Promise<{ ok: true; body: Buffer; contentType: string } | { ok: false; error: string }> {
  const validation = validateScanUrl(targetUrl);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(validation.url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "*/*",
        "User-Agent":
          "WCAG-Access-PageAnalyzer/1.0 (+https://wcagaccess.vercel.app/page-analyzer)",
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Resource returned HTTP ${response.status}.`,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_RESPONSE_BYTES) {
      return { ok: false, error: "Resource is too large to proxy." };
    }

    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream";

    return {
      ok: true,
      body: Buffer.from(arrayBuffer),
      contentType,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not fetch resource.";
    return { ok: false, error: message };
  } finally {
    clearTimeout(timeout);
  }
}
