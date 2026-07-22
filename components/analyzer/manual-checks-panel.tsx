"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  detectComponentTags,
  getManualCriteriaForTags,
} from "@/lib/a11y/coverage-map";
import { WCAG_CRITERIA, getGuidePath } from "@/lib/a11y/wcag-map";

export type ManualChecksPanelProps = {
  code: string;
  className?: string;
};

/** Lists manual WCAG checks suggested for patterns in pasted code. */
export function ManualChecksPanel({ code, className }: ManualChecksPanelProps) {
  const tags = detectComponentTags(code);
  const manualIds = getManualCriteriaForTags(tags);

  if (manualIds.length === 0) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Suggested manual checks</CardTitle>
        <CardDescription>
          These criteria cannot be fully verified from static TSX alone. Review
          them manually for this component.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {manualIds.map((criterionId) => {
            const criterion = WCAG_CRITERIA[criterionId];
            if (!criterion) return null;

            return (
              <li
                key={criterionId}
                className="rounded-md border border-border p-3 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs">{criterionId}</span>
                  <Badge variant="outline">Manual</Badge>
                  <Badge variant="secondary">Level {criterion.level}</Badge>
                </div>
                <p className="mt-1 font-medium">{criterion.name}</p>
                <p className="mt-1 text-muted-foreground">
                  {criterion.description}
                </p>
                <div className="mt-2">
                  <Link
                    href={getGuidePath(criterionId)}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Read guide
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
