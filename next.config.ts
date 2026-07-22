import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@axe-core/playwright",
    "@sparticuz/chromium",
    "axe-core",
    "playwright-core",
  ],
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
