import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/audits/route";

vi.mock("@/lib/supabase/audits", () => ({
  getSessionUser: vi.fn(),
  listAuditsForUser: vi.fn(),
  saveAudit: vi.fn(),
}));

import {
  getSessionUser,
  listAuditsForUser,
  saveAudit,
} from "@/lib/supabase/audits";

describe("audits API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns 401 when unauthenticated", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(null);

    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("GET returns audits for authenticated user", async () => {
    vi.mocked(getSessionUser).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
    } as never);
    vi.mocked(listAuditsForUser).mockResolvedValue([]);

    const response = await GET();
    expect(response.status).toBe(200);
    expect(listAuditsForUser).toHaveBeenCalledWith("user-1");
  });

  it("POST returns 401 when unauthenticated", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost/api/audits", {
        method: "POST",
        body: JSON.stringify({
          title: "Test",
          code: "<div />",
          findings: [],
        }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("POST saves audit for authenticated user", async () => {
    vi.mocked(getSessionUser).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
    } as never);
    vi.mocked(saveAudit).mockResolvedValue({
      id: "audit-1",
      user_id: "user-1",
      title: "Test",
      code: "<div />",
      findings: [],
      created_at: new Date().toISOString(),
    });

    const response = await POST(
      new Request("http://localhost/api/audits", {
        method: "POST",
        body: JSON.stringify({
          title: "Test",
          code: "<div />",
          findings: [],
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(saveAudit).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1", title: "Test" }),
    );
  });
});
