import type { A11yFinding } from "../types";
import { focusNotObscuredFixSnippet } from "../suggestion-snippets";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

/** Returns focusable elements within a preview root container. */
export function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => {
      const style = getComputedStyle(element);
      return style.visibility !== "hidden" && style.display !== "none";
    },
  );
}

function toRect(domRect: DOMRect): Rect {
  return {
    top: domRect.top,
    left: domRect.left,
    width: domRect.width,
    height: domRect.height,
    right: domRect.right,
    bottom: domRect.bottom,
  };
}

function intersectionArea(a: Rect, b: Rect): number {
  const top = Math.max(a.top, b.top);
  const left = Math.max(a.left, b.left);
  const bottom = Math.min(a.bottom, b.bottom);
  const right = Math.min(a.right, b.right);
  if (bottom <= top || right <= left) return 0;
  return (bottom - top) * (right - left);
}

function rectArea(rect: Rect): number {
  return Math.max(0, rect.width) * Math.max(0, rect.height);
}

/** Collects fixed/sticky elements that may obscure focused content. */
export function getObscuringElements(
  root: HTMLElement,
  focused: HTMLElement,
): HTMLElement[] {
  const obscurers: HTMLElement[] = [];
  const candidates = root.querySelectorAll<HTMLElement>("*");

  for (const element of candidates) {
    if (element === focused || focused.contains(element)) continue;
    const style = getComputedStyle(element);
    if (style.position !== "fixed" && style.position !== "sticky") continue;
    if (style.visibility === "hidden" || style.display === "none") continue;
    if (parseFloat(style.opacity) === 0) continue;
    obscurers.push(element);
  }

  return obscurers;
}

/** Returns true when obscurers fully cover the focused element's bounding box. */
export function isFullyObscured(
  focusRect: Rect,
  obscurers: HTMLElement[],
): boolean {
  const focusArea = rectArea(focusRect);
  if (focusArea <= 0) return false;

  let covered = 0;
  for (const obscurer of obscurers) {
    covered += intersectionArea(focusRect, toRect(obscurer.getBoundingClientRect()));
  }

  return covered >= focusArea * 0.99;
}

/** Runtime check for WCAG 2.4.11 Focus Not Obscured (Minimum). */
export function checkFocusNotObscured(root: HTMLElement): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const focusables = getFocusableElements(root);

  for (const element of focusables) {
    element.focus();
    const focusRect = toRect(element.getBoundingClientRect());
    if (rectArea(focusRect) <= 0) continue;

    const obscurers = getObscuringElements(root, element);
    if (!isFullyObscured(focusRect, obscurers)) continue;

    const sourceLine = element.getAttribute("data-source-line");
    const line = sourceLine ? Number.parseInt(sourceLine, 10) : 0;
    const tag = element.tagName.toLowerCase();

    findings.push({
      ruleId: "focus-not-obscured",
      message: `<${tag}> is fully hidden by sticky or fixed content when focused. Keyboard users cannot see where focus is.`,
      severity: "blocking",
      wcagCriteria: ["2.4.11", "2.4.12"],
      line: Number.isFinite(line) ? line : 0,
      column: 0,
      element: tag,
      suggestion:
        "Add scroll-margin to focusable elements or reduce sticky overlay height.",
      fixSnippet: focusNotObscuredFixSnippet(),
      source: "preview",
    });
  }

  return findings;
}

export { toRect, intersectionArea, rectArea };
