"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { groupFindingsByCriterion } from "@/lib/a11y/engine";
import { getRuleCount } from "@/lib/a11y/rules";
import { getSeverityLabel } from "@/lib/a11y/severity-labels";
import { getGuidePath, WCAG_CRITERIA } from "@/lib/a11y/wcag-map";
import type { A11yFinding } from "@/lib/a11y/types";
import { cn } from "@/lib/utils";

export type ResultsPanelProps = {
  findings: A11yFinding[];
  parseError?: string | null;
  isLoading?: boolean;
  className?: string;
};

/** Displays grouped accessibility findings with fix suggestions. */
export function ResultsPanel({
  findings,
  parseError,
  isLoading = false,
  className,
}: ResultsPanelProps) {
  const ruleCount = getRuleCount();

  if (isLoading) {
    return (
      <Card className={className} aria-live="polite" aria-busy="true">
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Analyzing your component...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 animate-pulse rounded-md bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (parseError) {
    return (
      <Card className={className} role="alert">
        <CardHeader>
          <CardTitle>Parse Error</CardTitle>
          <CardDescription>
            Could not parse your code. Fix syntax errors and try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">
            {parseError}
          </pre>
        </CardContent>
      </Card>
    );
  }

  if (findings.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>No issues found</CardTitle>
          <CardDescription>
            Great work! No issues were detected by the current {ruleCount}{" "}
            analyzer checks. Some WCAG criteria still require manual testing.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const grouped = groupFindingsByCriterion(findings);

  const mustFixCount = findings.filter(
    (f) => f.severity === "blocking",
  ).length;
  const shouldFixCount = findings.length - mustFixCount;

  return (
    <Card className={className} aria-live="polite">
      <CardHeader>
        <CardTitle>
          {findings.length} issue{findings.length === 1 ? "" : "s"} found
        </CardTitle>
        <CardDescription>
          {mustFixCount} must fix · {shouldFixCount} should fix — review each
          item below and apply the suggested fix.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {Array.from(grouped.entries()).map(([criterionId, items]) => {
            const criterion = WCAG_CRITERIA[criterionId];
            return (
              <AccordionItem key={criterionId} value={criterionId}>
                <AccordionTrigger>
                  <div className="flex flex-wrap items-center gap-2 text-left">
                    <span className="font-mono text-sm">{criterionId}</span>
                    <span>{criterion?.name ?? "WCAG Criterion"}</span>
                    {criterion && (
                      <Badge variant="outline">Level {criterion.level}</Badge>
                    )}
                    <Badge variant="secondary">{items.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {criterion && (
                    <p className="mb-4 text-sm text-muted-foreground">
                      {criterion.description}{" "}
                      <Link
                        href={getGuidePath(criterionId)}
                        className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      >
                        Read guide
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </Link>
                    </p>
                  )}
                  <ul className="space-y-4">
                    {items.map((finding, index) => (
                      <li
                        key={`${finding.ruleId}-${finding.line}-${index}`}
                        className="rounded-md border border-border p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              finding.severity === "blocking"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {getSeverityLabel(finding.severity)}
                          </Badge>
                          <span className="font-mono text-xs text-muted-foreground">
                            Line {finding.line}:{finding.column}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            &lt;{finding.element}&gt;
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{finding.message}</p>
                        <div className="mt-3">
                          <p className="text-xs font-medium text-muted-foreground">
                            Suggested fix
                          </p>
                          <pre
                            className={cn(
                              "mt-1 overflow-x-auto rounded-md bg-muted p-3 text-xs font-mono",
                            )}
                          >
                            {finding.suggestion}
                          </pre>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              void navigator.clipboard.writeText(
                                finding.suggestion,
                              );
                              toast.success("Suggestion copied to clipboard");
                            }}
                          >
                            Copy suggestion
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
