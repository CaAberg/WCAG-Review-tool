/** Converts a criterion ID and name into a kebab-case guide slug. */
export function criterionToGuideSlug(id: string, name: string): string {
  const kebab = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${id.replace(/\./g, "-")}-${kebab}`;
}

/** Returns the W3C Understanding doc URL for a criterion ID. */
export function criterionUnderstandingUrl(id: string): string {
  const slug = id.replace(/\./g, "");
  return `https://www.w3.org/WAI/WCAG22/Understanding/${slug}.html`;
}
