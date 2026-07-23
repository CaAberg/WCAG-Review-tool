import { buildProxyResourceUrl, resolveProxyUrl } from "./fetch-resource";

const PROXYABLE_ATTRIBUTES = ["href", "src", "srcset", "action", "poster", "data-src"];

/** Rewrites a single URL attribute value to route through the proxy. */
function rewriteAttributeValue(
  pageUrl: string,
  attribute: string,
  value: string,
): string {
  if (!value || value.startsWith("#") || value.startsWith("javascript:")) {
    return value;
  }

  if (attribute === "srcset") {
    return value
      .split(",")
      .map((entry) => {
        const trimmed = entry.trim();
        const parts = trimmed.split(/\s+/);
        const urlPart = parts[0];
        if (!urlPart) return trimmed;

        const absolute = resolveProxyUrl(pageUrl, urlPart);
        parts[0] = buildProxyResourceUrl(absolute);
        return parts.join(" ");
      })
      .join(", ");
  }

  const absolute = resolveProxyUrl(pageUrl, value);
  return buildProxyResourceUrl(absolute);
}

/** Rewrites CSS url(...) values to route through the proxy. */
function rewriteCssUrls(pageUrl: string, css: string): string {
  return css.replace(/url\(([^)]+)\)/gi, (match, rawUrl) => {
    const cleaned = String(rawUrl).trim().replace(/^['"]|['"]$/g, "");
    if (
      !cleaned ||
      cleaned.startsWith("#") ||
      cleaned.startsWith("data:") ||
      cleaned.startsWith("javascript:")
    ) {
      return match;
    }

    const absolute = resolveProxyUrl(pageUrl, cleaned);
    return `url("${buildProxyResourceUrl(absolute)}")`;
  });
}

/** Removes frame-busting meta tags from proxied HTML. */
function stripFrameBlockingMeta(html: string): string {
  return html
    .replace(
      /<meta[^>]+http-equiv=["']content-security-policy["'][^>]*>/gi,
      "",
    )
    .replace(
      /<meta[^>]+http-equiv=["']x-frame-options["'][^>]*>/gi,
      "",
    );
}

/** Injects the viewer bootstrap script before </body>. */
export function injectViewerBootstrap(html: string, bootstrapSrc: string): string {
  const scriptTag = `<script src="${bootstrapSrc}" defer></script>`;

  if (html.includes("</body>")) {
    return html.replace("</body>", `${scriptTag}</body>`);
  }

  return `${html}${scriptTag}`;
}

/** Rewrites HTML links and assets to stay within the proxy viewer. */
export function rewriteHtmlForProxy(pageUrl: string, html: string): string {
  let rewritten = stripFrameBlockingMeta(html);

  for (const attribute of PROXYABLE_ATTRIBUTES) {
    const pattern = new RegExp(
      `(${attribute}\\s*=\\s*)(["'])([^"']*)(\\2)`,
      "gi",
    );

    rewritten = rewritten.replace(pattern, (_match, prefix, quote, value) => {
      const nextValue = rewriteAttributeValue(pageUrl, attribute, value);
      return `${prefix}${quote}${nextValue}${quote}`;
    });
  }

  rewritten = rewritten.replace(
    /<style([^>]*)>([\s\S]*?)<\/style>/gi,
    (_match, attrs, css) => `<style${attrs}>${rewriteCssUrls(pageUrl, css)}</style>`,
  );

  return rewritten;
}
