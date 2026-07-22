import { describe, expect, it } from "vitest";
import { targetSizeRule } from "@/lib/a11y/rules/target-size";
import { parseTsxSource } from "@/lib/a11y/parser";

function analyze(code: string) {
  const parsed = parseTsxSource(code);
  if (!parsed.success) throw new Error(parsed.error);
  return targetSizeRule.check({ source: code, ast: parsed.ast });
}

describe("targetSizeRule", () => {
  it("flags tiny buttons without compensating padding", () => {
    const findings = analyze(`
      export function X() {
        return <button className="h-4 w-4"><Icon /></button>;
      }
    `);

    expect(findings.some((f) => f.ruleId === "target-size")).toBe(true);
    expect(findings[0]?.wcagCriteria).toContain("2.5.8");
    expect(findings[0]?.fixSnippet).toContain("min-h-6 min-w-6 p-2");
  });

  it("passes buttons with adequate minimum size", () => {
    const findings = analyze(`
      export function X() {
        return <button className="min-h-6 min-w-6 p-2">OK</button>;
      }
    `);

    expect(findings).toHaveLength(0);
  });

  it("passes small visual size when padding expands the target", () => {
    const findings = analyze(`
      export function X() {
        return <button className="h-4 w-4 p-2" aria-label="Close"><Icon /></button>;
      }
    `);

    expect(findings).toHaveLength(0);
  });
});
