import axe from "axe-core";
import { axeToFindings } from "../../lib/a11y/page-scan/axe-to-findings";

/** Runs axe on the active page DOM and returns normalized findings. */
export default (async () => {
  try {
    const results = await axe.run(document, {
      resultTypes: ["violations"],
    });

    return {
      ok: true as const,
      url: window.location.href,
      findings: axeToFindings(results),
      violationCount: results.violations.length,
    };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Scan failed.",
    };
  }
})();
