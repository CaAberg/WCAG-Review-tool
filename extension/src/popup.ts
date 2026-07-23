import type { A11yFinding } from "../../lib/a11y/types";

type ScanResponse =
  | {
      ok: true;
      url: string;
      findings: A11yFinding[];
      violationCount: number;
    }
  | {
      ok: false;
      error: string;
    };

const statusEl = document.getElementById("status");
const summaryEl = document.getElementById("summary");
const scanButton = document.getElementById("scan-button") as HTMLButtonElement;
const showOverlayButton = document.getElementById(
  "show-overlay",
) as HTMLButtonElement;
const clearOverlayButton = document.getElementById(
  "clear-overlay",
) as HTMLButtonElement;
const openReportButton = document.getElementById(
  "open-report",
) as HTMLButtonElement;

const APP_ORIGIN = "https://wcagaccess.vercel.app";

let latestFindings: A11yFinding[] = [];
let latestUrl = "";

/** Encodes findings for the page analyzer import hash. */
function encodeFindings(findings: A11yFinding[], url: string): string {
  const payload = JSON.stringify({ findings, url });
  return `#results=${encodeURIComponent(btoa(payload))}`;
}

/** Renders a short summary of scan results in the popup. */
function renderSummary(result: Extract<ScanResponse, { ok: true }>) {
  if (!statusEl || !summaryEl) return;

  latestFindings = result.findings;
  latestUrl = result.url;

  const blocking = result.findings.filter(
    (finding) => finding.severity === "blocking",
  ).length;
  const enhancement = result.findings.length - blocking;

  statusEl.textContent = `Scanned ${result.url}`;
  summaryEl.hidden = false;
  summaryEl.innerHTML = `
    <p class="issue-count">${result.findings.length} issue${result.findings.length === 1 ? "" : "s"} found</p>
    <p>${blocking} must fix · ${enhancement} should fix</p>
    <ul>
      ${result.findings
        .slice(0, 5)
        .map((finding) => `<li>${finding.message}</li>`)
        .join("")}
    </ul>
  `;

  if (showOverlayButton) {
    showOverlayButton.hidden = false;
    showOverlayButton.disabled = result.findings.length === 0;
  }

  if (clearOverlayButton) {
    clearOverlayButton.hidden = false;
  }

  if (openReportButton) {
    openReportButton.hidden = false;
    openReportButton.onclick = () => {
      const hash = encodeFindings(result.findings, result.url);
      void chrome.tabs.create({ url: `${APP_ORIGIN}/page-analyzer${hash}` });
    };
  }
}

scanButton?.addEventListener("click", () => {
  if (!statusEl || !scanButton) return;

  scanButton.disabled = true;
  statusEl.textContent = "Scanning...";
  summaryEl && (summaryEl.hidden = true);
  openReportButton && (openReportButton.hidden = true);
  showOverlayButton && (showOverlayButton.hidden = true);
  clearOverlayButton && (clearOverlayButton.hidden = true);

  chrome.runtime.sendMessage({ type: "scan-active-tab" }, (response: ScanResponse) => {
    scanButton.disabled = false;

    if (chrome.runtime.lastError) {
      statusEl.textContent = chrome.runtime.lastError.message ?? "Scan failed.";
      return;
    }

    if (!response?.ok) {
      statusEl.textContent = response?.error ?? "Scan failed.";
      return;
    }

    renderSummary(response);
  });
});

showOverlayButton?.addEventListener("click", () => {
  chrome.runtime.sendMessage(
    { type: "show-overlay", findings: latestFindings },
    (response: { ok?: boolean; error?: string }) => {
      if (chrome.runtime.lastError) {
        statusEl && (statusEl.textContent = chrome.runtime.lastError.message ?? "Overlay failed.");
        return;
      }

      if (!response?.ok) {
        statusEl && (statusEl.textContent = response?.error ?? "Overlay failed.");
        return;
      }

      statusEl && (statusEl.textContent = `Showing ${latestFindings.length} markers on ${latestUrl}`);
    },
  );
});

clearOverlayButton?.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "clear-overlay" }, (response: { ok?: boolean }) => {
    if (response?.ok) {
      statusEl && (statusEl.textContent = "Overlay cleared.");
    }
  });
});
