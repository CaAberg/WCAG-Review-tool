import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCoverageForCriterion } from "@/lib/a11y/coverage-map";
import { getCriteriaWithRules } from "@/lib/a11y/rules";
import {
  RUNTIME_WCAG_CRITERIA,
  WCAG_GUIDELINES,
  getAllCriteria,
} from "@/lib/a11y/wcag-map";
import { getAllGuides } from "@/lib/content/guides";

export const metadata: Metadata = {
  title: "WCAG Guides",
  description:
    "Learn WCAG 2.2 success criteria with practical React examples and analyzer cross-links.",
};

/** Index of all WCAG guide pages grouped by guideline. */
export default function GuidesPage() {
  const guides = getAllGuides();
  const guideByCriterion = new Map(guides.map((guide) => [guide.criterionId, guide]));
  const criteriaWithRules = getCriteriaWithRules();
  for (const criterionId of RUNTIME_WCAG_CRITERIA) {
    criteriaWithRules.add(criterionId);
  }

  const criteria = getAllCriteria();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">WCAG Guides</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        All WCAG 2.1/2.2 success criteria grouped by guideline. Badges show
        whether the component analyzer checks each criterion statically, in live
        preview, or manually.
      </p>

      {WCAG_GUIDELINES.map((guideline) => {
        const guidelineCriteria = criteria.filter(
          (criterion) => criterion.guidelineId === guideline.id,
        );

        return (
          <section key={guideline.id} className="mt-10">
            <h2 className="text-xl font-semibold">
              {guideline.id} {guideline.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Principle {guideline.principle}: {guideline.principleName}
            </p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {guidelineCriteria.map((criterion) => {
                const guide = guideByCriterion.get(criterion.id);
                const coverage = getCoverageForCriterion(criterion.id);
                const href = guide
                  ? `/guides/${guide.slug}`
                  : `/guides/${criterion.guideSlug}`;

                return (
                  <li key={criterion.id}>
                    <Card className="h-full min-w-0">
                      <CardHeader>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm text-primary">
                            {criterion.id}
                          </span>
                          <Badge variant="outline">Level {criterion.level}</Badge>
                          {coverage?.status === "static" ? (
                            <Badge variant="secondary">Automated</Badge>
                          ) : null}
                          {coverage?.status === "runtime" ? (
                            <Badge variant="secondary">Live preview</Badge>
                          ) : null}
                          {coverage?.status === "manual" ? (
                            <Badge variant="outline">Manual</Badge>
                          ) : null}
                        </div>
                        <CardTitle className="break-words text-xl">
                          <Link
                            href={href}
                            className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {criterion.name}
                          </Link>
                        </CardTitle>
                        <CardDescription>{criterion.description}</CardDescription>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm">
                          <Link
                            href={href}
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            Read guide
                          </Link>
                          <a
                            href={criterion.understandingUrl}
                            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            W3C Understanding
                            <ExternalLink className="h-3 w-3" aria-hidden />
                          </a>
                        </div>
                      </CardHeader>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
