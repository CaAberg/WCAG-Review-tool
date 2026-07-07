import { parse } from "@babel/parser";
import type { File } from "@babel/types";

export type ParseOutcome =
  { success: true; ast: File } | { success: false; error: string };

const MAX_SOURCE_LENGTH = 50_000;

/** Parses TSX source into a Babel AST with size and syntax guards. */
export function parseTsxSource(source: string): ParseOutcome {
  if (source.length > MAX_SOURCE_LENGTH) {
    return {
      success: false,
      error: `Source exceeds maximum length of ${MAX_SOURCE_LENGTH} characters.`,
    };
  }

  try {
    const ast = parse(source, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
      errorRecovery: false,
    });

    return { success: true, ast };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown parse error.";
    return { success: false, error: message };
  }
}

export { MAX_SOURCE_LENGTH };
