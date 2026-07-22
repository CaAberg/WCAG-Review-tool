import { describe, expect, it } from "vitest";
import { validateScanUrl } from "@/lib/a11y/page-scan/validate-url";

describe("validateScanUrl", () => {
  it("accepts public https URLs", () => {
    const result = validateScanUrl("https://example.com/about");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.url).toBe("https://example.com/about");
    }
  });

  it("rejects invalid URLs", () => {
    const result = validateScanUrl("not-a-url");
    expect(result.ok).toBe(false);
  });

  it("rejects non-http protocols", () => {
    const result = validateScanUrl("file:///etc/passwd");
    expect(result.ok).toBe(false);
  });

  it("blocks localhost", () => {
    const result = validateScanUrl("http://localhost:3000");
    expect(result.ok).toBe(false);
  });

  it("blocks private IPv4 addresses", () => {
    expect(validateScanUrl("http://127.0.0.1").ok).toBe(false);
    expect(validateScanUrl("http://10.0.0.5").ok).toBe(false);
    expect(validateScanUrl("http://192.168.1.10").ok).toBe(false);
  });

  it("blocks URLs with embedded credentials", () => {
    const result = validateScanUrl("https://user:pass@example.com");
    expect(result.ok).toBe(false);
  });
});
