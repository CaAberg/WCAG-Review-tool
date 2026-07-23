import { injectViewerBootstrap, rewriteHtmlForProxy } from "@/lib/a11y/proxy/rewrite-html";
import {
  fetchProxyResource,
  resolveProxyUrl,
} from "@/lib/a11y/proxy/fetch-resource";
import { getRenderCache, pruneRenderCache } from "@/lib/a11y/proxy/render-cache";
import { validateScanUrl } from "@/lib/a11y/page-scan/validate-url";

export const runtime = "nodejs";

const VIEWER_BOOTSTRAP_SRC = "/page-analyzer/viewer-bootstrap.js";

/** Proxies public page HTML and assets for the interactive viewer. */
export async function GET(request: Request) {
  pruneRenderCache();

  const requestUrl = new URL(request.url);
  const target = requestUrl.searchParams.get("url");

  if (!target) {
    return new Response("Missing url parameter.", { status: 400 });
  }

  const validation = validateScanUrl(target);
  if (!validation.ok) {
    return new Response(validation.error, { status: 400 });
  }

  const cached = getRenderCache(validation.url);
  if (cached) {
    const html = injectViewerBootstrap(
      rewriteHtmlForProxy(validation.url, cached.html),
      VIEWER_BOOTSTRAP_SRC,
    );

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, max-age=60",
      },
    });
  }

  const fetched = await fetchProxyResource(validation.url);
  if (!fetched.ok) {
    return new Response(fetched.error, { status: 502 });
  }

  const contentType = fetched.contentType.toLowerCase();

  if (contentType.includes("text/html")) {
    const html = injectViewerBootstrap(
      rewriteHtmlForProxy(validation.url, fetched.body.toString("utf8")),
      VIEWER_BOOTSTRAP_SRC,
    );

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, max-age=60",
      },
    });
  }

  if (contentType.includes("text/css")) {
    const css = fetched.body.toString("utf8");
    const rewritten = css.replace(/url\(([^)]+)\)/gi, (match, rawUrl) => {
      const cleaned = String(rawUrl).trim().replace(/^['"]|['"]$/g, "");
      if (!cleaned || cleaned.startsWith("data:")) return match;

      const absolute = resolveProxyUrl(validation.url, cleaned);
      return `url("/page-analyzer/proxy?url=${encodeURIComponent(absolute)}")`;
    });

    return new Response(rewritten, {
      headers: {
        "Content-Type": fetched.contentType,
        "Cache-Control": "private, max-age=300",
      },
    });
  }

  return new Response(new Uint8Array(fetched.body), {
    headers: {
      "Content-Type": fetched.contentType,
      "Cache-Control": "private, max-age=300",
    },
  });
}
