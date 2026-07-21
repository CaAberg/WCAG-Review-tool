import Link from "next/link";
import { Accessibility } from "lucide-react";
import { AuthNav } from "@/components/auth/auth-nav";
import { SiteHeaderMobileNav } from "@/components/site-header-mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export type SiteHeaderProps = {
  className?: string;
};

/** Main site navigation header. */
export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        className,
      )}
    >
      <div className="mx-auto flex h-16 min-w-0 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          <Accessibility className="h-6 w-6 shrink-0 text-primary" aria-hidden />
          <span className="truncate">WCAG Access</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 md:flex"
        >
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link
                href="/analyzer"
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                Analyzer
              </Link>
            </li>
            <li>
              <Link
                href="/guides"
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                aria-label="Help — WCAG accessibility guides"
              >
                Help
              </Link>
            </li>
            <li>
              <Link
                href="/audits"
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                My Audits
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AuthNav />
          </div>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <SiteHeaderMobileNav />
        </div>
      </div>
    </header>
  );
}
