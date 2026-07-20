import { describe, expect, it } from "vitest";
import { contrastMinimumRule } from "@/lib/a11y/rules/contrast-minimum";
import { parseTsxSource } from "@/lib/a11y/parser";

function analyze(code: string) {
  const parsed = parseTsxSource(code);
  if (!parsed.success) throw new Error(parsed.error);
  return contrastMinimumRule.check({ source: code, ast: parsed.ast });
}

describe("contrastMinimumRule", () => {
  it("flags inline styles below 4.5:1 contrast", () => {
    const findings = analyze(`
      export function X() {
        return (
          <p style={{ color: "#cccccc", backgroundColor: "#ffffff" }}>Text</p>
        );
      }
    `);

    expect(findings.some((f) => f.ruleId === "contrast-minimum")).toBe(true);
    expect(findings[0]?.wcagCriteria).toContain("1.4.3");
  });

  it("passes inline styles with sufficient contrast", () => {
    const findings = analyze(`
      export function X() {
        return (
          <p style={{ color: "#1a1a1a", backgroundColor: "#ffffff" }}>Text</p>
        );
      }
    `);

    expect(findings).toHaveLength(0);
  });

  it("flags known failing Tailwind utility pairs", () => {
    const findings = analyze(`
      export function X() {
        return <p className="text-gray-300 bg-white">Muted</p>;
      }
    `);

    expect(findings.some((f) => f.ruleId === "contrast-minimum")).toBe(true);
    expect(findings[0]?.message).toContain("text-gray-300");
  });

  it("passes design-token-like classes not in the lookup table", () => {
    const findings = analyze(`
      export function X() {
        return <p className="text-foreground bg-background">Token text</p>;
      }
    `);

    expect(findings).toHaveLength(0);
  });
});
