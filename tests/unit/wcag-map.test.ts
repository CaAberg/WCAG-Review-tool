import { describe, expect, it } from "vitest";
import {
  WCAG_CATALOG,
  WCAG_CATALOG_COUNT,
  WCAG_GUIDELINES,
  WCAG_CRITERIA,
} from "@/lib/a11y/wcag-map";

describe("wcag catalog", () => {
  it("contains 85 active success criteria", () => {
    expect(WCAG_CATALOG_COUNT).toBe(85);
    expect(WCAG_CATALOG).toHaveLength(85);
  });

  it("indexes all criteria by id", () => {
    expect(Object.keys(WCAG_CRITERIA)).toHaveLength(85);
    expect(WCAG_CRITERIA["1.1.1"]?.name).toBe("Non-text Content");
  });

  it("includes guideline metadata on each criterion", () => {
    for (const criterion of WCAG_CATALOG) {
      expect(criterion.guidelineId).toMatch(/^\d\.\d$/);
      expect(criterion.guidelineName.length).toBeGreaterThan(0);
      expect(criterion.understandingUrl.toLowerCase()).toContain("w3.org");
    }
  });

  it("lists 13 guidelines", () => {
    expect(WCAG_GUIDELINES).toHaveLength(13);
  });
});
