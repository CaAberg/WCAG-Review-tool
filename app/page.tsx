import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Globe,
  Puzzle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Build accessible apps with confidence
        </h1>
        <p className="mt-6 break-words text-lg text-muted-foreground">
          Choose how you want to check accessibility — paste React components,
          scan a live page, or use the browser extension on whatever you are
          viewing.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/component-analyzer">
              Component Analyzer
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/page-analyzer">Page Analyzer</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/guides">Browse WCAG Guides</Link>
          </Button>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">
          Accessibility tools
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Code2 className="h-8 w-8 text-primary" aria-hidden />
              <CardTitle className="text-xl">Component Analyzer</CardTitle>
              <CardDescription>
                Paste TSX for static checks and live preview runtime tests mapped
                to WCAG criteria with fix suggestions.
              </CardDescription>
              <Button asChild variant="link" className="h-auto p-0">
                <Link href="/component-analyzer">Open component analyzer</Link>
              </Button>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-primary" aria-hidden />
              <CardTitle className="text-xl">Page Analyzer</CardTitle>
              <CardDescription>
                Enter a public URL for a server-side axe-core scan of the
                rendered page.
              </CardDescription>
              <Button asChild variant="link" className="h-auto p-0">
                <Link href="/page-analyzer">Open page analyzer</Link>
              </Button>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Puzzle className="h-8 w-8 text-primary" aria-hidden />
              <CardTitle className="text-xl">Browser Extension</CardTitle>
              <CardDescription>
                Scan localhost, staging, or logged-in pages from the tab you
                already have open.
              </CardDescription>
              <Button asChild variant="link" className="h-auto p-0">
                <Link href="/page-analyzer#extension">Install extension</Link>
              </Button>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          Features
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden />
              <CardTitle className="text-xl">Actionable Fixes</CardTitle>
              <CardDescription>
                Every finding includes severity, criterion links, and copy-ready
                code suggestions where available.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden />
              <CardTitle className="text-xl">WCAG Guides</CardTitle>
              <CardDescription>
                Clear explanations of success criteria with practical examples
                for React developers.
              </CardDescription>
              <Button asChild variant="link" className="h-auto p-0">
                <Link href="/guides">Browse guides</Link>
              </Button>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="mt-20 rounded-lg border border-border bg-muted/50 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">Component Analyzer</h3>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>1. Paste your TSX component code.</li>
              <li>2. Run static rules and live preview checks.</li>
              <li>3. Apply suggested fixes and re-analyze.</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold">Page Analyzer & Extension</h3>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>1. Enter a public URL or scan the current browser tab.</li>
              <li>2. axe-core finds violations on the rendered DOM.</li>
              <li>3. Review grouped results and linked WCAG guides.</li>
            </ol>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Automated checks cover many WCAG criteria, but manual testing is still
          required for others. See{" "}
          <Link
            href="/guides"
            className="text-primary underline underline-offset-4 hover:underline"
          >
            WCAG guides
          </Link>{" "}
          for full coverage details.
        </p>
      </section>
    </div>
  );
}
