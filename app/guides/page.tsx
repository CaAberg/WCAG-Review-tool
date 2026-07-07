import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllGuides } from "@/lib/content/guides";

export const metadata: Metadata = {
  title: "WCAG Guides",
  description:
    "Learn WCAG 2.1 success criteria with practical React examples and analyzer cross-links.",
};

/** Index of all WCAG guide pages. */
export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">WCAG Guides</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Practical explanations of WCAG 2.1 success criteria with React examples.
        These guides align with checks in the component analyzer.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-primary">
                      {guide.criterionId}
                    </span>
                    <Badge variant="outline">Level {guide.level}</Badge>
                  </div>
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
