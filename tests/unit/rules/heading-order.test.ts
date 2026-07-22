import { describe, expect, it } from "vitest";
import { headingOrderRule } from "@/lib/a11y/rules/heading-order";
import { parseTsxSource } from "@/lib/a11y/parser";

function analyze(code: string) {
  const parsed = parseTsxSource(code);
  if (!parsed.success) throw new Error(parsed.error);
  return headingOrderRule.check({ source: code, ast: parsed.ast });
}

describe("headingOrderRule", () => {
  it("emits contextual fix snippet when heading levels are skipped", () => {
    const findings = analyze(`
      export function Dashboard() {
        return (
          <section>
            <h1>Dashboard</h1>
            <h3>Recent activity</h3>
          </section>
        );
      }
    `);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.suggestion).toBe(
      "Use h2 instead of h3 to maintain logical heading order.",
    );
    expect(findings[0]?.fixSnippet).toBe("<h2>Recent activity</h2>");
  });

  it("passes when heading levels are sequential", () => {
    const findings = analyze(`
      export function Dashboard() {
        return (
          <section>
            <h1>Dashboard</h1>
            <h2>Recent activity</h2>
          </section>
        );
      }
    `);

    expect(findings).toHaveLength(0);
  });
});
