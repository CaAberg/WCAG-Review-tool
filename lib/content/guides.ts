import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { WcagLevel } from "@/lib/a11y/types";

export type GuideFrontmatter = {
  title: string;
  criterionId: string;
  level: WcagLevel;
  description: string;
};

export type GuideSummary = GuideFrontmatter & {
  slug: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "wcag");

/** Returns all guide summaries from MDX frontmatter. */
export function getAllGuides(): GuideSummary[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
      const { data } = matter(raw);

      return {
        slug,
        title: data.title as string,
        criterionId: data.criterionId as string,
        level: data.level as WcagLevel,
        description: data.description as string,
      };
    })
    .sort((a, b) => a.criterionId.localeCompare(b.criterionId));
}

/** Loads and compiles a single MDX guide by slug. */
export async function getGuideBySlug(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);

  const { content: mdxContent } = await compileMDX<GuideFrontmatter>({
    source: content,
    options: { parseFrontmatter: false },
  });

  return {
    frontmatter: data as GuideFrontmatter,
    content: mdxContent,
  };
}

/** Returns all guide slugs for static generation. */
export function getAllGuideSlugs(): string[] {
  return getAllGuides().map((g) => g.slug);
}
