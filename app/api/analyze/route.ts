import { z } from "zod";
import { analyzeTsx, MAX_SOURCE_LENGTH } from "@/lib/a11y/engine";

const analyzeRequestSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required.")
    .max(
      MAX_SOURCE_LENGTH,
      `Code must be under ${MAX_SOURCE_LENGTH} characters.`,
    ),
});

/** Analyzes pasted TSX for accessibility issues. */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = analyzeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const result = analyzeTsx(parsed.data.code);

  if (result.parseError) {
    return Response.json(
      { findings: [], parseError: result.parseError },
      { status: 422 },
    );
  }

  return Response.json(result);
}
