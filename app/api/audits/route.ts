import { z } from "zod";
import { MAX_SOURCE_LENGTH } from "@/lib/a11y/engine";
import {
  getSessionUser,
  listAuditsForUser,
  saveAudit,
} from "@/lib/supabase/audits";

const findingSchema = z.object({
  ruleId: z.string(),
  message: z.string(),
  severity: z.enum(["blocking", "enhancement"]),
  wcagCriteria: z.array(z.string()),
  line: z.number(),
  column: z.number(),
  element: z.string(),
  suggestion: z.string(),
});

const saveAuditSchema = z.object({
  title: z.string().min(1).max(100),
  code: z.string().min(1).max(MAX_SOURCE_LENGTH),
  findings: z.array(findingSchema),
});

/** Lists saved audits for the authenticated user. */
export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const audits = await listAuditsForUser(user.id);
    return Response.json({ audits });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load audits.";
    return Response.json({ error: message }, { status: 500 });
  }
}

/** Saves a new audit for the authenticated user. */
export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = saveAuditSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  try {
    const audit = await saveAudit({ ...parsed.data, userId: user.id });
    return Response.json(audit, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save audit.";
    return Response.json({ error: message }, { status: 500 });
  }
}
