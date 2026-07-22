import { describe, expect, it } from "vitest";
import { CRITERION_COVERAGE } from "@/lib/a11y/coverage-map";
import { WCAG_CATALOG_COUNT } from "@/lib/a11y/wcag-map";

describe("coverage map", () => {
  it("covers every catalogued success criterion", () => {
    expect(Object.keys(CRITERION_COVERAGE)).toHaveLength(WCAG_CATALOG_COUNT);
  });

  it("uses only valid coverage statuses", () => {
    for (const coverage of Object.values(CRITERION_COVERAGE)) {
      expect(["static", "runtime", "manual"]).toContain(coverage.status);
    }
  });
});
