import { describe, expect, it } from "vitest";
import { compileTsxForPreview } from "@/lib/a11y/preview/compile-tsx";

describe("compileTsxForPreview", () => {
  it("compiles exported components and injects data-source-line", () => {
    const result = compileTsxForPreview(`
      export function Demo() {
        return <button>Go</button>;
      }
    `);

    expect(result.error).toBeUndefined();
    expect(result.componentName).toBe("Demo");
    expect(result.code).toContain("data-source-line");
    expect(result.code).toContain("__PREVIEW_COMPONENT__");
  });

  it("returns compile errors for invalid syntax", () => {
    const result = compileTsxForPreview("export function {{{");

    expect(result.code).toBe("");
    expect(result.error).toBeDefined();
  });

  it("stubs import bindings for preview", () => {
    const result = compileTsxForPreview(`
      import { cn } from "@/lib/utils";
      export function Demo() {
        return <button className={cn("px-4")}>Go</button>;
      }
    `);

    expect(result.error).toBeUndefined();
    expect(result.code).toContain("const cn");
  });
});
