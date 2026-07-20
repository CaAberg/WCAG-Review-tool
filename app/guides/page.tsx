import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCriteriaWithRules } from "@/lib/a11y/rules";
import { getAllGuides } from "@/lib/content/guides";

export const metadata: Metadata = {
  title: "WCAG Guides",
  description:
    "Learn WCAG 2.2 success criteria with practical React examples and analyzer cross-links.",
};

/** Index of all WCAG guide pages. */
export default function GuidesPage() {
  const guides = getAllGuides();
  const criteriaWithRules = getCriteriaWithRules();

  const analyzerGuides = guides.filter((g) =>
    criteriaWithRules.has(g.criterionId),
  );
  const referenceGuides = guides.filter(
    (g) => !criteriaWithRules.has(g.criterionId),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">WCAG Guides</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Practical explanations of WCAG 2.2 success criteria with React examples.
        Guides marked with an analyzer badge are checked automatically in the
        component analyzer.
      </p>

      <GuideSection
        title="Checked by analyzer"
        description="These criteria have automated checks when you paste TSX into the analyzer."
        guides={analyzerGuides}
        criteriaWithRules={criteriaWithRules}
      />

      {referenceGuides.length > 0 && (
        <GuideSection
          title="Reference guides"
          description="Learn these criteria and verify them with manual or runtime testing."
          guides={referenceGuides}
          criteriaWithRules={criteriaWithRules}
        />
      )}
    </div>
  );
}

type GuideSectionProps = {
  title: string;
  description: string;
  guides: ReturnType<typeof getAllGuides>;
  criteriaWithRules: Set<string>;
};

function GuideSection({
  title,
  description,
  guides,
  criteriaWithRules,
}: GuideSectionProps) {
  if (guides.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => {
          const hasAnalyzerRule = criteriaWithRules.has(guide.criterionId);
          return (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm text-primary">
                        {guide.criterionId}
                      </span>
                      <Badge variant="outline">Level {guide.level}</Badge>
                      {hasAnalyzerRule ? (
                        <Badge variant="secondary">Analyzer</Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-xl">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
