/** Service worker message router for the WCAG Access extension. */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "scan-active-tab") return;

  void (async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id || !tab.url?.startsWith("http")) {
        sendResponse({
          ok: false,
          error: "Open an http or https page to scan.",
        });
        return;
      }

      const [injection] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content-scan.js"],
      });

      sendResponse(injection?.result ?? { ok: false, error: "Scan failed." });
    } catch (error) {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Scan failed.",
      });
    }
  })();

  return true;
});
