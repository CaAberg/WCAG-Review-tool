"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { AuthNav } from "@/components/auth/auth-nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const navLinkClassName =
  "block rounded-sm px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/** Mobile navigation menu using an accessible dialog panel. */
export function SiteHeaderMobileNav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
      >
        <Menu className="h-5 w-5" aria-hidden />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          id={menuId}
          className="left-auto top-0 h-full max-w-xs translate-x-0 translate-y-0 overflow-y-auto overscroll-contain p-4 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed right-0 sm:rounded-none sm:p-6"
        >
          <DialogTitle className="sr-only">Main navigation</DialogTitle>
          <DialogDescription className="sr-only">
            Site sections and account actions
          </DialogDescription>
          <nav aria-label="Main navigation">
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/analyzer"
                  className={navLinkClassName}
                  onClick={() => setOpen(false)}
                >
                  Analyzer
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className={navLinkClassName}
                  aria-label="Help — WCAG accessibility guides"
                  onClick={() => setOpen(false)}
                >
                  Help
                </Link>
              </li>
              <li>
                <Link
                  href="/audits"
                  className={navLinkClassName}
                  onClick={() => setOpen(false)}
                >
                  My Audits
                </Link>
              </li>
            </ul>
            <div className={cn("mt-6 border-t border-border pt-4")}>
              <AuthNav />
            </div>
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
}
