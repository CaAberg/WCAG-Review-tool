import { describe, expect, it } from "vitest";
import { axeToFindings } from "@/lib/a11y/page-scan/axe-to-findings";

describe("axeToFindings", () => {
  it("maps axe violations to A11yFinding objects", () => {
    const findings = axeToFindings({
      violations: [
        {
          id: "image-alt",
          impact: "critical",
          description: "Images must have alternate text",
          help: "Images must have alternate text",
          helpUrl: "https://dequeuniversity.com/rules/axe/4.12/image-alt",
          tags: ["wcag111", "wcag2a"],
          nodes: [
            {
              html: '<img src="logo.png">',
              target: ["img"],
            },
          ],
        },
      ],
    });

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "image-alt",
      severity: "blocking",
      wcagCriteria: ["1.1.1"],
      source: "axe",
      line: 0,
      column: 0,
      element: "img",
    });
    expect(findings[0]?.fixSnippet).toContain("img");
  });

  it("maps moderate impact to enhancement severity", () => {
    const findings = axeToFindings({
      violations: [
        {
          id: "region",
          impact: "moderate",
          description: "Page should have landmarks",
          help: "Page should have landmarks",
          helpUrl: "https://example.com",
          tags: ["best-practice"],
          nodes: [],
        },
      ],
    });

    expect(findings[0]?.severity).toBe("enhancement");
  });
});
