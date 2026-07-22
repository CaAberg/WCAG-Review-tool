import { describe, expect, it } from "vitest";
import { parseTsxSource } from "@/lib/a11y/parser";
import { accesskeyRule } from "@/lib/a11y/rules/accesskey";
import { ariaValidRule } from "@/lib/a11y/rules/aria-valid";
import { bypassBlocksRule } from "@/lib/a11y/rules/bypass-blocks";
import { dragAlternativeRule } from "@/lib/a11y/rules/drag-alternative";
import { duplicateIdRule } from "@/lib/a11y/rules/duplicate-id";
import { emptyHeadingLabelRule } from "@/lib/a11y/rules/empty-heading-label";
import { errorIdentificationRule } from "@/lib/a11y/rules/error-identification";
import { iframeTitleRule } from "@/lib/a11y/rules/iframe-title";
import { interactiveTabindexRule } from "@/lib/a11y/rules/interactive-tabindex";
import { labelInNameRule } from "@/lib/a11y/rules/label-in-name";
import { langPageRule } from "@/lib/a11y/rules/lang-page";
import { langPartsRule } from "@/lib/a11y/rules/lang-parts";
import { linkNameRule } from "@/lib/a11y/rules/link-name";
import { linkPurposeRule } from "@/lib/a11y/rules/link-purpose";
import { motionActuationRule } from "@/lib/a11y/rules/motion-actuation";
import { onFocusChangeRule } from "@/lib/a11y/rules/on-focus-change";
import { onInputChangeRule } from "@/lib/a11y/rules/on-input-change";
import { pointerGesturesRule } from "@/lib/a11y/rules/pointer-gestures";
import { requiredFieldRule } from "@/lib/a11y/rules/required-field";
import { statusMessagesRule } from "@/lib/a11y/rules/status-messages";
import type { A11yRule } from "@/lib/a11y/types";

function analyze(rule: A11yRule, code: string) {
  const parsed = parseTsxSource(code);
  if (!parsed.success) throw new Error(parsed.error);
  return rule.check({ source: code, ast: parsed.ast });
}

describe("new WCAG static rules", () => {
  it("flags native controls with tabIndex={-1}", () => {
    const findings = analyze(
      interactiveTabindexRule,
      `export function Example() { return <button tabIndex={-1}>Save</button>; }`,
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]?.fixSnippet).toContain("<button>");
  });

  it("flags single-character accessKey values", () => {
    const findings = analyze(
      accesskeyRule,
      `export function Example() { return <button accessKey="s">Save</button>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags layouts missing skip links", () => {
    const findings = analyze(
      bypassBlocksRule,
      `export function Layout() { return (<><nav>Menu</nav><main>Content</main></>); }`,
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]?.suggestion).toContain("Skip to main content");
  });

  it("flags generic link text", () => {
    const findings = analyze(
      linkPurposeRule,
      `export function Example() { return <a href="/pricing">Click here</a>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags empty headings", () => {
    const findings = analyze(
      emptyHeadingLabelRule,
      `export function Example() { return <h2></h2>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags touch-only handlers", () => {
    const findings = analyze(
      pointerGesturesRule,
      `export function Example() { return <div onTouchStart={handleSwipe}>Swipe</div>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags aria-label that omits visible text", () => {
    const findings = analyze(
      labelInNameRule,
      `export function Example() { return <button aria-label="Submit form">Send</button>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags device motion without alternatives", () => {
    const findings = analyze(
      motionActuationRule,
      `export function Example() { return <div onDeviceMotion={handleShake}>Shake</div>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags drag-only interactions", () => {
    const findings = analyze(
      dragAlternativeRule,
      `export function Example() { return <div draggable onDragStart={handleDrag}>Item</div>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags html without lang", () => {
    const findings = analyze(
      langPageRule,
      `export function RootLayout() { return <html><body>App</body></html>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags non-ascii passages without lang", () => {
    const findings = analyze(
      langPartsRule,
      `export function Example() { return <p>Mañana por la mañana</p>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags select with onFocus", () => {
    const findings = analyze(
      onFocusChangeRule,
      `export function Example() { return <select onFocus={handleFocus}><option>A</option></select>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags select with onChange", () => {
    const findings = analyze(
      onInputChangeRule,
      `export function Example() { return <select onChange={handleChange}><option>A</option></select>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags aria-invalid without aria-describedby", () => {
    const findings = analyze(
      errorIdentificationRule,
      `export function Example() { return <input aria-invalid="true" />; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags required fields without aria-required or visible indicator", () => {
    const findings = analyze(
      requiredFieldRule,
      `export function Example() { return (<><label htmlFor="name">Name</label><input id="name" required /></>); }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags iframes without title", () => {
    const findings = analyze(
      iframeTitleRule,
      `export function Example() { return <iframe src="https://example.com" />; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags duplicate ids", () => {
    const findings = analyze(
      duplicateIdRule,
      `export function Example() { return (<><div id="panel">A</div><div id="panel">B</div></>); }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags unnamed links", () => {
    const findings = analyze(
      linkNameRule,
      `export function Example() { return <a href="/details"></a>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags invalid aria roles", () => {
    const findings = analyze(
      ariaValidRule,
      `export function Example() { return <div role="foo">Action</div>; }`,
    );
    expect(findings).toHaveLength(1);
  });

  it("flags status-like messages without live region semantics", () => {
    const findings = analyze(
      statusMessagesRule,
      `export function Example() { return <div className="toast success">Saved</div>; }`,
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]?.fixSnippet).toContain('role="status"');
  });
});
