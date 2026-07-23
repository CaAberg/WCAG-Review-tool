/** Service worker message router for the WCAG Access extension. */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "scan-active-tab") {
    void handleScanActiveTab(sendResponse);
    return true;
  }

  if (message?.type === "show-overlay") {
    void handleShowOverlay(message.findings ?? [], sendResponse);
    return true;
  }

  if (message?.type === "clear-overlay") {
    void handleClearOverlay(sendResponse);
    return true;
  }

  return false;
});

type ScanResponse =
  | {
      ok: true;
      url: string;
      findings: unknown[];
      violationCount: number;
    }
  | {
      ok: false;
      error: string;
    };

async function getActiveTabId(): Promise<number | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id ?? null;
}

async function handleScanActiveTab(
  sendResponse: (response: ScanResponse) => void,
): Promise<void> {
  try {
    const tabId = await getActiveTabId();
    if (!tabId) {
      sendResponse({ ok: false, error: "No active tab." });
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url?.startsWith("http")) {
      sendResponse({
        ok: false,
        error: "Open an http or https page to scan.",
      });
      return;
    }

    const [injection] = await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content-scan.js"],
    });

    sendResponse(
      (injection?.result as ScanResponse | undefined) ?? {
        ok: false,
        error: "Scan failed.",
      },
    );
  } catch (error) {
    sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : "Scan failed.",
    });
  }
}

async function handleShowOverlay(
  findings: unknown[],
  sendResponse: (response: { ok: boolean; error?: string }) => void,
): Promise<void> {
  try {
    const tabId = await getActiveTabId();
    if (!tabId) {
      sendResponse({ ok: false, error: "No active tab." });
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content-overlay.js"],
    });

    await chrome.scripting.executeScript({
      target: { tabId },
      func: (overlayFindings: unknown[]) => {
        window.__wcagAccessShowOverlay?.(overlayFindings as never);
      },
      args: [findings],
    });

    sendResponse({ ok: true });
  } catch (error) {
    sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : "Could not show overlay.",
    });
  }
}

async function handleClearOverlay(
  sendResponse: (response: { ok: boolean; error?: string }) => void,
): Promise<void> {
  try {
    const tabId = await getActiveTabId();
    if (!tabId) {
      sendResponse({ ok: false, error: "No active tab." });
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        window.__wcagAccessClearOverlay?.();
      },
    });

    sendResponse({ ok: true });
  } catch (error) {
    sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : "Could not clear overlay.",
    });
  }
}
