import { getAuditById, getSessionUser } from "@/lib/supabase/audits";

export type AuditLoaderProps = {
  auditId: string;
};

/** Loads audit data for the analyzer when opened via ?audit=id. */
export async function loadAuditForAnalyzer(auditId: string) {
  const user = await getSessionUser();
  if (!user) return null;
  return getAuditById(auditId, user.id);
}
