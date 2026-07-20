/** Known failing Tailwind text + background utility pairs (default palette). */
export type TailwindContrastPair = {
  textClass: string;
  bgClass: string;
};

/** Static pairs that fail WCAG AA 4.5:1 for normal text. */
export const FAILING_TAILWIND_CONTRAST_PAIRS: TailwindContrastPair[] = [
  { textClass: "text-gray-300", bgClass: "bg-white" },
  { textClass: "text-gray-400", bgClass: "bg-white" },
  { textClass: "text-gray-300", bgClass: "bg-gray-50" },
  { textClass: "text-gray-400", bgClass: "bg-gray-50" },
  { textClass: "text-slate-300", bgClass: "bg-white" },
  { textClass: "text-slate-400", bgClass: "bg-white" },
  { textClass: "text-zinc-300", bgClass: "bg-white" },
  { textClass: "text-yellow-200", bgClass: "bg-white" },
  { textClass: "text-green-300", bgClass: "bg-white" },
  { textClass: "text-blue-300", bgClass: "bg-white" },
];

/**
 * Returns a matching failing Tailwind pair when both classes appear on an element.
 */
export function findFailingTailwindPair(
  classTokens: string[],
): TailwindContrastPair | null {
  const tokenSet = new Set(classTokens);
  for (const pair of FAILING_TAILWIND_CONTRAST_PAIRS) {
    if (tokenSet.has(pair.textClass) && tokenSet.has(pair.bgClass)) {
      return pair;
    }
  }
  return null;
}
