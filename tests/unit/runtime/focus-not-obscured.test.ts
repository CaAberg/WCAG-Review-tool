import { describe, expect, it } from "vitest";
import {
  intersectionArea,
  isFullyObscured,
  rectArea,
  toRect,
} from "@/lib/a11y/runtime/focus-not-obscured";

describe("focus-not-obscured helpers", () => {
  it("computes intersection area between overlapping rects", () => {
    const a = toRect({
      top: 0,
      left: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    const b = toRect({
      top: 50,
      left: 50,
      width: 100,
      height: 100,
      right: 150,
      bottom: 150,
      x: 50,
      y: 50,
      toJSON: () => ({}),
    } as DOMRect);

    expect(intersectionArea(a, b)).toBe(50 * 50);
  });

  it("detects full obscuring when covered area meets threshold", () => {
    const focusRect = toRect({
      top: 10,
      left: 10,
      width: 20,
      height: 20,
      right: 30,
      bottom: 30,
      x: 10,
      y: 10,
      toJSON: () => ({}),
    } as DOMRect);

    const obscurer = document.createElement("div");
    obscurer.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        right: 100,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    expect(rectArea(focusRect)).toBe(400);
    expect(isFullyObscured(focusRect, [obscurer])).toBe(true);
  });
});

describe("checkFocusNotObscured", () => {
  it("flags focusables fully covered by fixed overlays", async () => {
    const { checkFocusNotObscured } = await import(
      "@/lib/a11y/runtime/focus-not-obscured"
    );

    const root = document.createElement("div");
    const button = document.createElement("button");
    button.textContent = "Submit";
    button.setAttribute("data-source-line", "4");

    const overlay = document.createElement("div");
    overlay.setAttribute("data-overlay", "true");

    root.appendChild(button);
    root.appendChild(overlay);
    document.body.appendChild(root);

    button.getBoundingClientRect = () =>
      ({
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        right: 50,
        bottom: 50,
        x: 10,
        y: 10,
        toJSON: () => ({}),
      }) as DOMRect;

    overlay.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        width: 200,
        height: 200,
        right: 200,
        bottom: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    window.getComputedStyle = (element: Element) => {
      if (element === overlay) {
        return {
          position: "fixed",
          visibility: "visible",
          display: "block",
          opacity: "1",
        } as CSSStyleDeclaration;
      }
      if (element === button) {
        return {
          position: "static",
          visibility: "visible",
          display: "inline-block",
          opacity: "1",
        } as CSSStyleDeclaration;
      }
      return originalGetComputedStyle(element);
    };

    button.focus = () => {
      // jsdom no-op
    };

    const findings = checkFocusNotObscured(root);
    expect(findings.some((f) => f.ruleId === "focus-not-obscured")).toBe(true);
    expect(findings[0]?.line).toBe(4);
    expect(findings[0]?.source).toBe("preview");

    document.body.removeChild(root);
    window.getComputedStyle = originalGetComputedStyle;
  });
});
