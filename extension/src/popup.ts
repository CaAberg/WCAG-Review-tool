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
const openReportButton = document.getElementById(
  "open-report",
) as HTMLButtonElement;

const APP_ORIGIN = "https://wcagaccess.vercel.app";

/** Encodes findings for the page analyzer import hash. */
function encodeFindings(findings: A11yFinding[], url: string): string {
  const payload = JSON.stringify({ findings, url });
  return `#results=${encodeURIComponent(btoa(payload))}`;
}

/** Renders a short summary of scan results in the popup. */
function renderSummary(result: Extract<ScanResponse, { ok: true }>) {
  if (!statusEl || !summaryEl) return;

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
