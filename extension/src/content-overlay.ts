import type { A11yFinding, ElementRect } from "../../lib/a11y/types";
import { enrichFindingsInDocument } from "../../lib/a11y/page-scan/enrich-findings";

declare global {
  interface Window {
    __wcagAccessShowOverlay?: (findings: A11yFinding[]) => void;
    __wcagAccessClearOverlay?: () => void;
  }
}

const OVERLAY_HOST_ID = "wcag-access-overlay-host";

/** Resolves the document-space rect for a finding target. */
function resolveFindingRect(finding: A11yFinding): ElementRect | undefined {
  const selectors = finding.selectors ?? [];
  if (selectors.length === 0) return finding.boundingBox;

  try {
    let context: Document | Element = document;

    for (let index = 0; index < selectors.length - 1; index += 1) {
      const frameSelector = selectors[index];
      if (!frameSelector) return finding.boundingBox;

      const frameElement = context.querySelector(frameSelector);
      if (!(frameElement instanceof HTMLIFrameElement)) return finding.boundingBox;

      const frameDocument = frameElement.contentDocument;
      if (!frameDocument) return finding.boundingBox;
      context = frameDocument;
    }

    const finalSelector = selectors[selectors.length - 1];
    if (!finalSelector) return finding.boundingBox;

    const element = context.querySelector(finalSelector);
    if (!(element instanceof Element)) return finding.boundingBox;

    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return finding.boundingBox;

    return {
      x: rect.x + window.scrollX,
      y: rect.y + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  } catch {
    return finding.boundingBox;
  }
}

/** Removes the injected overlay from the page. */
export function clearPageOverlay(): void {
  document.getElementById(OVERLAY_HOST_ID)?.remove();
}

/** Renders WAVE-style markers on the live page. */
export function renderPageOverlay(findings: A11yFinding[]): void {
  clearPageOverlay();

  const host = document.createElement("div");
  host.id = OVERLAY_HOST_ID;
  host.style.all = "initial";
  host.style.position = "absolute";
  host.style.inset = "0";
  host.style.pointerEvents = "none";
  host.style.zIndex = "2147483646";

  const shadow = host.attachShadow({ mode: "open" });
  const layer = document.createElement("div");
  layer.style.cssText =
    "position:absolute;inset:0;pointer-events:none;font-family:system-ui,sans-serif;";
  shadow.appendChild(layer);

  const enriched = enrichFindingsInDocument(document, findings, window.location.href);
  const markers: HTMLElement[] = [];

  enriched.forEach((finding, index) => {
    const rect = resolveFindingRect(finding);
    if (!rect) return;

    const marker = document.createElement("button");
    marker.type = "button";
    marker.textContent = String(index + 1);
    marker.setAttribute("aria-label", `${index + 1}. ${finding.message}`);
    marker.style.cssText = [
      "position:absolute",
      "pointer-events:auto",
      "transform:translate(-50%, -50%)",
      "width:1.75rem",
      "height:1.75rem",
      "border-radius:9999px",
      "border:2px solid white",
      "color:white",
      "font-size:0.75rem",
      "font-weight:700",
      "cursor:pointer",
      "box-shadow:0 2px 8px rgba(0,0,0,0.25)",
      finding.severity === "blocking" ? "background:#dc2626" : "background:#f59e0b",
      `left:${rect.x + rect.width / 2}px`,
      `top:${rect.y}px`,
    ].join(";");

    layer.appendChild(marker);
    markers.push(marker);
  });

  const reposition = () => {
    enriched.forEach((finding, index) => {
      const marker = markers[index];
      if (!marker) return;

      const rect = resolveFindingRect(finding);
      if (!rect) return;

      marker.style.left = `${rect.x + rect.width / 2}px`;
      marker.style.top = `${rect.y}px`;
    });
  };

  window.addEventListener("scroll", reposition, { passive: true });
  window.addEventListener("resize", reposition);

  document.documentElement.appendChild(host);
}

window.__wcagAccessShowOverlay = renderPageOverlay;
window.__wcagAccessClearOverlay = clearPageOverlay;
