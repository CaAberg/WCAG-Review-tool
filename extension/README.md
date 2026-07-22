# WCAG Access Browser Extension

Chrome MV3 extension that scans the **current tab** with axe-core — useful for localhost, staging, and login-protected pages that the server-side Page Analyzer cannot reach.

## Build

From the repository root:

```bash
npm run build:extension
```

Output is written to `extension/dist/`.

## Install (load unpacked)

1. Run the build command above.
2. Open `chrome://extensions` in Chrome or Edge.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `extension/dist` folder.

## Usage

1. Navigate to any http or https page.
2. Click the WCAG Access extension icon.
3. Choose **Scan this page**.
4. Review the summary in the popup, or click **Open full report** to view results in the web app Page Analyzer.

## Permissions

- `activeTab` — access the current tab when you click the extension icon
- `scripting` — inject the axe scan script on demand
- `<all_urls>` — required to scan pages on any origin

## Local development

The popup links to `https://wcagaccess.vercel.app/page-analyzer` for full reports. When developing the web app locally, scan results are still shown in the popup; use the exported hash flow against your local origin by adjusting `APP_ORIGIN` in `extension/src/popup.ts` if needed.

For the server-side Page Analyzer locally, ensure a Chromium-based browser is available:

```bash
npx playwright install chromium
```

Or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a local Chrome/Edge binary. On Windows, the scanner also tries installed Edge or Chrome automatically.

## Server-side alternative

For public URLs without installing an extension, use the [Page Analyzer](/page-analyzer) in the web app instead.
