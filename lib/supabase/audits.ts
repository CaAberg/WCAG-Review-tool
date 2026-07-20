import type { User } from "@supabase/supabase-js";
import type { A11yFinding } from "@/lib/a11y/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type AuditRow = {
  id: string;
  user_id: string | null;
  title: string;
  code: string;
  findings: A11yFinding[];
  created_at: string;
};

export { isSupabaseConfigured };

/** In-memory fallback store for unit tests only. */
const memoryAudits: AuditRow[] = [];

/** Returns the authenticated user from the current session, or null. */
export async function getSessionUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/** Saves an audit for the authenticated user. */
export async function saveAudit(input: {
  title: string;
  code: string;
  findings: A11yFinding[];
  userId: string;
}): Promise<AuditRow> {
  if (!isSupabaseConfigured()) {
    const audit: AuditRow = {
      id: crypto.randomUUID(),
      user_id: input.userId,
      title: input.title,
      code: input.code,
      findings: input.findings,
      created_at: new Date().toISOString(),
    };
    memoryAudits.unshift(audit);
    return audit;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audits")
    .insert({
      title: input.title,
      code: input.code,
      findings: input.findings,
      user_id: input.userId,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as AuditRow;
}

/** Lists audits belonging to a specific user. */
export async function listAuditsForUser(userId: string): Promise<AuditRow[]> {
  if (!isSupabaseConfigured()) {
    return memoryAudits.filter((a) => a.user_id === userId);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return (data ?? []) as AuditRow[];
}

/** Fetches a single audit by ID for the given user. */
export async function getAuditById(
  id: string,
  userId: string,
): Promise<AuditRow | null> {
  if (!isSupabaseConfigured()) {
    return (
      memoryAudits.find((a) => a.id === id && a.user_id === userId) ?? null
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data as AuditRow;
}

/** Clears in-memory audits — for testing only. */
export function clearMemoryAudits(): void {
  memoryAudits.length = 0;
}
