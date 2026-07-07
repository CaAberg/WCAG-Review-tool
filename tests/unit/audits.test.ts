import { describe, expect, it, beforeEach } from "vitest";
import {
  clearMemoryAudits,
  listAuditsForUser,
  saveAudit,
  getAuditById,
} from "@/lib/supabase/audits";

describe("audits storage", () => {
  beforeEach(() => {
    clearMemoryAudits();
  });

  it("saves and lists audits for a specific user", async () => {
    await saveAudit({
      title: "Test audit",
      code: "<button>Go</button>",
      findings: [],
      userId: "user-1",
    });

    await saveAudit({
      title: "Other user audit",
      code: "<button>Other</button>",
      findings: [],
      userId: "user-2",
    });

    const audits = await listAuditsForUser("user-1");
    expect(audits).toHaveLength(1);
    expect(audits[0]?.title).toBe("Test audit");
  });

  it("fetches audit by id for the owning user only", async () => {
    const saved = await saveAudit({
      title: "Owned audit",
      code: "<div />",
      findings: [],
      userId: "user-1",
    });

    const found = await getAuditById(saved.id, "user-1");
    expect(found?.title).toBe("Owned audit");

    const notFound = await getAuditById(saved.id, "user-2");
    expect(notFound).toBeNull();
  });
});
