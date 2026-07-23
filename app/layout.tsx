import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WCAG Access — Accessibility Tools for Developers",
    template: "%s | WCAG Access",
  },
  description:
    "Paste your React components and get WCAG-aligned accessibility suggestions. Guides, checklists, and tools to build more inclusive apps.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isPreviewSurface =
    pathname.includes("/preview") || pathname.startsWith("/page-analyzer/proxy");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          {!isPreviewSurface && <SiteHeader />}
          {isPreviewSurface ? (
            children
          ) : (
            <main className="min-w-0">{children}</main>
          )}
          {!isPreviewSurface && (
            <Toaster richColors position="top-right" />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
