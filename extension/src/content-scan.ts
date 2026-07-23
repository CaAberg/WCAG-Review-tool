import axe from "axe-core";
import { axeToFindings } from "../../lib/a11y/page-scan/axe-to-findings";
import { enrichFindingsInDocument } from "../../lib/a11y/page-scan/enrich-findings";

/** Runs axe on the active page DOM and returns normalized findings. */
export default (async () => {
  try {
    const results = await axe.run(document, {
      resultTypes: ["violations"],
    });

    const findings = enrichFindingsInDocument(
      document,
      axeToFindings(results),
      window.location.href,
    );

    return {
      ok: true as const,
      url: window.location.href,
      findings,
      violationCount: results.violations.length,
    };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Scan failed.",
    };
  }
})();
