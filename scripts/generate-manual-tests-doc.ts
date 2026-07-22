import fs from "fs";
import path from "path";
import {
  CRITERION_COVERAGE,
  getManualCriteriaIds,
} from "../lib/a11y/coverage-map";
import { getCriteriaByGuideline, WCAG_GUIDELINES } from "../lib/a11y/wcag-map";

const OUTPUT_PATH = path.join(process.cwd(), ".manualtests.md");

function main() {
  const manualIds = getManualCriteriaIds();
  const grouped = getCriteriaByGuideline();
  const lines: string[] = [
    "# Manual WCAG checks",
    "",
    "These success criteria cannot be fully verified by static TSX analysis, live preview runtime checks, or axe page scans alone. Use this list when planning future automation and when reviewing components or pages manually.",
    "",
    `**Total manual criteria:** ${manualIds.length}`,
    "",
  ];

  for (const guideline of WCAG_GUIDELINES) {
    const criteria = grouped.get(guideline.id) ?? [];
    const manualCriteria = criteria.filter(
      (criterion) => CRITERION_COVERAGE[criterion.id]?.status === "manual",
    );

    if (manualCriteria.length === 0) continue;

    lines.push(`## ${guideline.id} ${guideline.name}`);
    lines.push("");

    for (const criterion of manualCriteria) {
      const coverage = CRITERION_COVERAGE[criterion.id];
      const tags = coverage?.componentTags?.length
        ? ` · tags: ${coverage.componentTags.join(", ")}`
        : "";

      lines.push(
        `### ${criterion.id} ${criterion.name} (Level ${criterion.level})`,
      );
      lines.push("");
      lines.push(criterion.description);
      lines.push("");
      lines.push(
        `- Guide: [/guides/${criterion.guideSlug}](/guides/${criterion.guideSlug})${tags}`,
      );
      lines.push("");
    }
  }

  fs.writeFileSync(OUTPUT_PATH, lines.join("\n"), "utf8");
  console.log(`Wrote ${OUTPUT_PATH} (${manualIds.length} manual criteria)`);
}

main();
