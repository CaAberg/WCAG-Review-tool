import { describe, expect, it } from "vitest";
import {
  createFindingId,
  parseAxeTarget,
  toDocumentRect,
} from "@/lib/a11y/page-scan/enrich-findings";

describe("enrich-findings", () => {
  it("parses axe selector chains", () => {
    expect(parseAxeTarget(["#main", "img"])).toEqual(["#main", "img"]);
    expect(parseAxeTarget("img")).toEqual(["img"]);
  });

  it("creates finding ids", () => {
    expect(createFindingId()).toMatch(
      /^finding-|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it("converts viewport rects to document coordinates", () => {
    expect(toDocumentRect({ x: 10, y: 20, width: 100, height: 50 }, 5, 15)).toEqual({
      x: 15,
      y: 35,
      width: 100,
      height: 50,
    });
  });
});
