import type { UrlValidationResult } from "./types";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "0.0.0.0",
  "[::]",
  "[::1]",
]);

/** Returns true when an IPv4 address is in a private or reserved range. */
function isPrivateOrReservedIpv4(host: string): boolean {
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;

  const octets = match.slice(1, 5).map(Number);
  if (octets.some((octet) => octet > 255)) return true;

  const [a, b] = octets;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;

  return false;
}

/** Returns true when a hostname is blocked for server-side scanning. */
function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (BLOCKED_HOSTNAMES.has(normalized)) return true;
  if (normalized === "localhost" || normalized.endsWith(".localhost")) return true;
  if (normalized.endsWith(".local")) return true;
  if (normalized.endsWith(".internal")) return true;
  if (isPrivateOrReservedIpv4(normalized)) return true;

  return false;
}

/** Parses optional comma-separated host allowlist from environment. */
function getAllowedHosts(): Set<string> | null {
  const raw = process.env.SCAN_ALLOWED_HOSTS?.trim();
  if (!raw) return null;

  return new Set(
    raw
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Validates a URL for server-side scanning with SSRF protections.
 * Only http/https public URLs are permitted unless allowlisted.
 */
export function validateScanUrl(input: string): UrlValidationResult {
  let parsed: URL;

  try {
    parsed = new URL(input.trim());
  } catch {
    return { ok: false, error: "Enter a valid URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs can be scanned." };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, error: "URLs with embedded credentials are not allowed." };
  }

  const hostname = parsed.hostname.toLowerCase();
  const allowedHosts = getAllowedHosts();

  if (allowedHosts) {
    if (!allowedHosts.has(hostname)) {
      return { ok: false, error: "This host is not on the scan allowlist." };
    }
  } else if (isBlockedHostname(hostname)) {
    return {
      ok: false,
      error: "Private, local, or reserved hosts cannot be scanned from the server.",
    };
  }

  return { ok: true, url: parsed.toString() };
}
