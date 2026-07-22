import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllGuideSlugs, getGuideBySlug } from "@/lib/content/guides";

export type GuidePageProps = {
  params: Promise<{ criterion: string }>;
};

export async function generateStaticParams() {
  return getAllGuideSlugs().map((criterion) => ({ criterion }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { criterion } = await params;
  const guide = await getGuideBySlug(criterion);

  if (!guide) return { title: "Guide not found" };

  return {
    title: `${guide.frontmatter.criterionId} ${guide.frontmatter.title}`,
    description: guide.frontmatter.description,
  };
}

/** Individual WCAG criterion guide page. */
export default async function GuidePage({ params }: GuidePageProps) {
  const { criterion } = await params;
  const guide = await getGuideBySlug(criterion);

  if (!guide) notFound();

  const { frontmatter, content: MdxContent } = guide;

  return (
    <article className="mx-auto min-w-0 max-w-3xl break-words px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm text-primary">
          {frontmatter.criterionId}
        </span>
        <Badge variant="outline">Level {frontmatter.level}</Badge>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{frontmatter.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {frontmatter.description}
      </p>

      <div className="prose prose-slate dark:prose-invert mt-10 max-w-none">
        {MdxContent}
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/guides">All guides</Link>
        </Button>
        <Button asChild>
          <Link href="/component-analyzer">Try the component analyzer</Link>
        </Button>
      </div>
    </article>
  );
}
