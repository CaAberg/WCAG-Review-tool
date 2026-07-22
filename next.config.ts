import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@axe-core/playwright",
    "@sparticuz/chromium",
    "axe-core",
    "playwright-core",
  ],
  outputFileTracingIncludes: {
    "/api/scan": ["./node_modules/@sparticuz/chromium/**"],
    "/api/scan/route": ["./node_modules/@sparticuz/chromium/**"],
  },
  redirects: async () => [
    {
      source: "/analyzer",
      destination: "/component-analyzer",
      permanent: true,
    },
    {
      source: "/analyzer/:path*",
      destination: "/component-analyzer/:path*",
      permanent: true,
    },
  ],
};

export default nextConfig;
