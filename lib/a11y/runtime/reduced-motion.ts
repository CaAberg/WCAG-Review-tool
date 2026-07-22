import type { A11yFinding } from "../types";

/** Flags animations that ignore prefers-reduced-motion (WCAG 2.3.3). */
export function checkReducedMotion(root: HTMLElement): A11yFinding[] {
  const findings: A11yFinding[] = [];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced) return findings;

  const animated = root.querySelectorAll<HTMLElement>("*");

  for (const element of animated) {
    const style = getComputedStyle(element);
    const hasMotion =
      style.animationName !== "none" || style.transitionDuration !== "0s";

    if (!hasMotion) continue;

    const line = Number(element.dataset.sourceLine ?? 0);
    findings.push({
      ruleId: "reduced-motion",
      message:
        "Animation or transition runs while prefers-reduced-motion is enabled.",
      severity: "enhancement",
      wcagCriteria: ["2.3.3"],
      line: Number.isFinite(line) ? line : 0,
      column: 0,
      element: element.tagName.toLowerCase(),
      suggestion:
        "Respect prefers-reduced-motion with motion-reduce:animate-none or CSS media query.",
      fixSnippet: 'className="motion-reduce:animate-none motion-reduce:transition-none"',
      source: "preview",
    });
    break;
  }

  return findings;
}
