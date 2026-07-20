declare module "culori" {
  /** Computes WCAG 2.x contrast ratio between two CSS color values. */
  export function wcagContrast(
    foreground: string,
    background: string,
  ): number;
}
