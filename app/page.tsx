import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, FileSearch } from "lucide-react";
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
          Paste your React components and get instant WCAG 2.2-aligned suggestions.
          Learn what to fix, why it matters, and how to improve your UI for
          everyone.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/analyzer">
              Try the Analyzer
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/guides">Browse WCAG Guides</Link>
          </Button>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          Features
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Code2 className="h-8 w-8 text-primary" aria-hidden />
              <CardTitle className="text-xl">Component Analysis</CardTitle>
              <CardDescription>
                Paste TSX and get static accessibility checks mapped to WCAG
                criteria with fix suggestions.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <FileSearch className="h-8 w-8 text-primary" aria-hidden />
              <CardTitle className="text-xl">WCAG Guides</CardTitle>
              <CardDescription>
                Clear explanations of success criteria with practical examples
                for React developers.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden />
              <CardTitle className="text-xl">Actionable Fixes</CardTitle>
              <CardDescription>
                Every finding includes severity, criterion links, and copy-ready
                code suggestions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="mt-20 rounded-lg border border-border bg-muted/50 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-6 space-y-4 text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-mono font-semibold text-foreground">1.</span>
            Paste your component code into the analyzer editor.
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-semibold text-foreground">2.</span>
            Our static rule engine checks JSX for common accessibility issues.
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-semibold text-foreground">3.</span>
            Review findings grouped by WCAG criterion and apply the suggested
            fixes.
          </li>
        </ol>
        <div className="mt-8">
          <Button asChild>
            <Link href="/analyzer">Open Analyzer</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
