import { z } from "zod";
import { renderPage, validateScanUrl } from "@/lib/a11y/page-scan";

export const runtime = "nodejs";
/** Cold-start Chromium download plus page render can exceed 60s on Vercel. */
export const maxDuration = 300;

const renderRequestSchema = z.object({
  url: z.string().min(1, "URL is required.").max(2048, "URL is too long."),
});

/** Renders a public page with Playwright and returns findings plus proxy URL. */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = renderRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const validation = validateScanUrl(parsed.data.url);

  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const result = await renderPage(validation.url);

  if (result.scanError && result.findings.length === 0) {
    const isTimeout = /timeout/i.test(result.scanError);
    return Response.json(result, { status: isTimeout ? 504 : 422 });
  }

  return Response.json(result);
}
