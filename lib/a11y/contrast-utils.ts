import { wcagContrast } from "culori";

/** Minimum contrast ratio for normal text (WCAG 1.4.3 AA). */
export const NORMAL_TEXT_MIN_RATIO = 4.5;

/** Minimum contrast ratio for large text (WCAG 1.4.3 AA). */
export const LARGE_TEXT_MIN_RATIO = 3;

const LARGE_TEXT_CLASS_PATTERN =
  /\btext-(lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/;

/** Returns true when class names suggest large text (3:1 threshold). */
export function isLargeTextClass(classNames: string): boolean {
  return LARGE_TEXT_CLASS_PATTERN.test(classNames);
}

/** Computes WCAG contrast ratio between two CSS color values. */
export function getContrastRatio(
  foreground: string,
  background: string,
): number | null {
  try {
    const ratio = wcagContrast(foreground, background);
    return Number.isFinite(ratio) ? ratio : null;
  } catch {
    return null;
  }
}

/** Returns true when foreground/background pair fails the minimum ratio. */
export function failsContrastMinimum(
  foreground: string,
  background: string,
  isLargeText: boolean,
): boolean {
  const ratio = getContrastRatio(foreground, background);
  if (ratio === null) return false;
  const minimum = isLargeText ? LARGE_TEXT_MIN_RATIO : NORMAL_TEXT_MIN_RATIO;
  return ratio < minimum;
}
