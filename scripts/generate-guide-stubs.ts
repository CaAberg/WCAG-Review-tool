#!/usr/bin/env npx tsx
import fs from "fs";
import path from "path";
import { WCAG_CATALOG } from "../lib/a11y/wcag-catalog-data";

const CONTENT_DIR = path.join(process.cwd(), "content", "wcag");

function buildStub(criterion: (typeof WCAG_CATALOG)[number]): string {
  return `---
title: "${criterion.name.replace(/"/g, '\\"')}"
criterionId: "${criterion.id}"
level: "${criterion.level}"
description: "${criterion.description.replace(/"/g, '\\"')}"
---

## Why it matters

${criterion.description}

## React considerations

Review how your components meet **${criterion.id} ${criterion.name}** when authoring UI. Use semantic HTML, ARIA only when necessary, and test with keyboard and screen readers.

## Manual test steps

1. Identify content in your component that relates to this criterion.
2. Verify the requirement using keyboard, screen reader, or visual inspection as appropriate.
3. Fix any gaps and re-test in the analyzer where automated rules exist.

## Official guidance

- [WCAG quick reference](https://www.w3.org/WAI/WCAG22/quickref/#${criterion.id.replace(/\./g, "")})
`;
}

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const existing = new Set(
    fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx")),
  );

  let created = 0;

  for (const criterion of WCAG_CATALOG) {
    const filename = `${criterion.guideSlug}.mdx`;
    if (existing.has(filename)) continue;

    fs.writeFileSync(path.join(CONTENT_DIR, filename), buildStub(criterion), "utf8");
    created += 1;
  }

  console.log(`Guide stubs created: ${created}`);
}

main();
