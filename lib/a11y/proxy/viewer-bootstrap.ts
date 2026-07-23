import axe from "axe-core";
import { axeToFindings } from "../page-scan/axe-to-findings";
import { enrichFindingsInDocument } from "../page-scan/enrich-findings";

/** Posts scroll position updates to the parent viewer shell. */
function postScrollUpdate(): void {
  window.parent.postMessage(
    {
      type: "viewer-scroll",
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      pageHeight: document.documentElement.scrollHeight,
    },
    "*",
  );
}

/** Runs axe in the proxied page and reports findings to the parent frame. */
async function analyzeAndReport(): Promise<void> {
  const results = await axe.run(document, {
    resultTypes: ["violations"],
  });

  const findings = enrichFindingsInDocument(
    document,
    axeToFindings(results),
    window.location.href,
  );

  window.parent.postMessage(
    {
      type: "viewer-findings",
      findings,
      pageHeight: document.documentElement.scrollHeight,
    },
    "*",
  );
}

/** Intercepts proxy link clicks and asks the parent shell to render a new page. */
function installNavigationBridge(): void {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
      return;
    }

    if (!href.startsWith("/page-analyzer/proxy?url=")) return;

    event.preventDefault();
    const proxyUrl = new URL(href, window.location.origin);
    const nextUrl = proxyUrl.searchParams.get("url");
    if (!nextUrl) return;

    window.parent.postMessage({ type: "viewer-navigate", url: nextUrl }, "*");
  });
}

void (async () => {
  installNavigationBridge();

  window.addEventListener("scroll", postScrollUpdate, { passive: true });
  window.addEventListener("resize", postScrollUpdate);
  window.addEventListener("load", postScrollUpdate);

  try {
    await analyzeAndReport();
  } catch {
    // Parent viewer keeps server-side findings if client analysis fails.
  }

  postScrollUpdate();
})();
