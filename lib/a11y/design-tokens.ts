/** Semantic design token colors from app/globals.css :root (light theme). */
export const DESIGN_TOKEN_COLORS: Record<string, string> = {
  "text-background": "#ffffff",
  "text-foreground": "#0f172a",
  "text-card": "#ffffff",
  "text-card-foreground": "#0f172a",
  "text-primary": "#1d4ed8",
  "text-primary-foreground": "#f8fafc",
  "text-secondary": "#f1f5f9",
  "text-secondary-foreground": "#0f172a",
  "text-muted": "#f1f5f9",
  "text-muted-foreground": "#475569",
  "text-accent": "#f1f5f9",
  "text-accent-foreground": "#0f172a",
  "text-destructive": "#dc2626",
  "text-destructive-foreground": "#fef2f2",
  "text-border": "#e2e8f0",
  "text-input": "#e2e8f0",
  "text-ring": "#1d4ed8",
  "bg-background": "#ffffff",
  "bg-foreground": "#0f172a",
  "bg-card": "#ffffff",
  "bg-card-foreground": "#0f172a",
  "bg-primary": "#1d4ed8",
  "bg-primary-foreground": "#f8fafc",
  "bg-secondary": "#f1f5f9",
  "bg-secondary-foreground": "#0f172a",
  "bg-muted": "#f1f5f9",
  "bg-muted-foreground": "#475569",
  "bg-accent": "#f1f5f9",
  "bg-accent-foreground": "#0f172a",
  "bg-destructive": "#dc2626",
  "bg-destructive-foreground": "#fef2f2",
  "bg-border": "#e2e8f0",
  "bg-input": "#e2e8f0",
  "bg-ring": "#1d4ed8",
};

const TEXT_TOKEN_PREFIX = "text-";
const BG_TOKEN_PREFIX = "bg-";

/** Returns the first resolvable text-* token class and its hex color. */
export function findTextTokenColor(
  classTokens: string[],
): { tokenClass: string; hex: string } | null {
  for (const token of classTokens) {
    if (!token.startsWith(TEXT_TOKEN_PREFIX)) continue;
    const hex = DESIGN_TOKEN_COLORS[token];
    if (hex) return { tokenClass: token, hex };
  }
  return null;
}

/** Returns the first resolvable bg-* token class and its hex color. */
export function findBackgroundTokenColor(
  classTokens: string[],
): { tokenClass: string; hex: string } | null {
  for (const token of classTokens) {
    if (!token.startsWith(BG_TOKEN_PREFIX)) continue;
    const hex = DESIGN_TOKEN_COLORS[token];
    if (hex) return { tokenClass: token, hex };
  }
  return null;
}
