import { describe, expect, it } from "vitest";
import { analyzeTsx } from "@/lib/a11y/engine";

describe("analyzeTsx", () => {
  it("flags images without alt text", () => {
    const code = `export function X() { return <img src="/a.png" />; }`;
    const result = analyzeTsx(code);

    expect(result.parseError).toBeUndefined();
    expect(result.findings.some((f) => f.ruleId === "image-alt")).toBe(true);
    expect(result.findings[0]?.wcagCriteria).toContain("1.1.1");
  });

  it("flags div onClick without keyboard support", () => {
    const code = `export function X() { return <div onClick={() => {}}>Click</div>; }`;
    const result = analyzeTsx(code);

    expect(
      result.findings.some((f) => f.ruleId === "click-events-have-key-events"),
    ).toBe(true);
  });

  it("flags heading level skips", () => {
    const code = `export function X() { return <><h1>Title</h1><h3>Sub</h3></>; }`;
    const result = analyzeTsx(code);

    expect(result.findings.some((f) => f.ruleId === "heading-order")).toBe(
      true,
    );
  });

  it("flags inputs without labels", () => {
    const code = `export function X() { return <input type="text" />; }`;
    const result = analyzeTsx(code);

    expect(result.findings.some((f) => f.ruleId === "label")).toBe(true);
  });

  it("flags icon-only buttons", () => {
    const code = `export function X() { return <button><span /></button>; }`;
    const result = analyzeTsx(code);

    expect(result.findings.some((f) => f.ruleId === "button-name")).toBe(true);
  });

  it("flags outline-none without focus replacement", () => {
    const code = `export function X() { return <button className="outline-none">Go</button>; }`;
    const result = analyzeTsx(code);

    expect(result.findings.some((f) => f.ruleId === "focus-visible")).toBe(
      true,
    );
  });

  it("flags low-contrast Tailwind text pairs", () => {
    const code = `export function X() { return <p className="text-gray-300 bg-white">Text</p>; }`;
    const result = analyzeTsx(code);

    expect(result.findings.some((f) => f.ruleId === "contrast-minimum")).toBe(
      true,
    );
  });

  it("flags inline color styles below contrast minimum", () => {
    const code = `export function X() { return <p style={{ color: "#cccccc", backgroundColor: "#ffffff" }}>Text</p>; }`;
    const result = analyzeTsx(code);

    expect(result.findings.some((f) => f.ruleId === "contrast-minimum")).toBe(
      true,
    );
  });

  it("flags tiny interactive targets", () => {
    const code = `export function X() { return <button className="h-4 w-4">X</button>; }`;
    const result = analyzeTsx(code);

    expect(result.findings.some((f) => f.ruleId === "target-size")).toBe(true);
  });

  it("flags decorative images with empty alt and no role", () => {
    const code = `export function X() { return <img src="/d.svg" alt="" />; }`;
    const result = analyzeTsx(code);

    expect(result.findings.some((f) => f.ruleId === "image-redundant-alt")).toBe(
      true,
    );
  });

  it("returns parse error for invalid syntax", () => {
    const result = analyzeTsx("export function {{{");

    expect(result.parseError).toBeDefined();
    expect(result.findings).toHaveLength(0);
  });

  it("passes accessible component", () => {
    const code = `
      export function Good() {
        return (
          <div>
            <h1>Title</h1>
            <h2>Section</h2>
            <img src="/a.png" alt="Chart showing growth" />
            <label htmlFor="email">Email</label>
            <input id="email" type="email" />
            <button type="button" aria-label="Close">X</button>
            <button className="outline-none focus-visible:ring-2">Submit</button>
          </div>
        );
      }
    `;
    const result = analyzeTsx(code);

    const blocking = result.findings.filter((f) => f.severity === "blocking");
    expect(blocking).toHaveLength(0);
  });
});
