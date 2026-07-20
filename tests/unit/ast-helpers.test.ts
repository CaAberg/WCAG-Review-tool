import { parse } from "@babel/parser";
import * as t from "@babel/types";
import { describe, expect, it } from "vitest";
import {
  getClassNames,
  resolveClassNames,
  resolveStaticClassExpression,
} from "@/lib/a11y/ast-helpers";

function parseOpeningElement(code: string): t.JSXOpeningElement {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
  const body = ast.program.body[0];
  if (!t.isExpressionStatement(body)) {
    throw new Error("Expected expression statement");
  }
  const expr = body.expression;
  if (!t.isJSXElement(expr)) {
    throw new Error("Expected JSX element");
  }
  return expr.openingElement;
}

describe("resolveStaticClassExpression", () => {
  it("resolves cn() with string literals", () => {
    const ast = parse('cn("a", "b")', {
      sourceType: "module",
      plugins: ["typescript"],
    });
    const expr = (ast.program.body[0] as t.ExpressionStatement).expression;
    expect(resolveStaticClassExpression(expr)).toBe("a b");
  });

  it("resolves clsx object syntax with truthy keys", () => {
    const ast = parse('clsx({ "text-sm": true, hidden: false })', {
      sourceType: "module",
      plugins: ["typescript"],
    });
    const expr = (ast.program.body[0] as t.ExpressionStatement).expression;
    expect(resolveStaticClassExpression(expr)).toBe("text-sm");
  });

  it("resolves conditional cn with literal boolean", () => {
    const ast = parse('cn(true && "visible", false && "hidden")', {
      sourceType: "module",
      plugins: ["typescript"],
    });
    const expr = (ast.program.body[0] as t.ExpressionStatement).expression;
    expect(resolveStaticClassExpression(expr)).toBe("visible");
  });
});

describe("resolveClassNames", () => {
  it("returns string literal className unchanged", () => {
    const opening = parseOpeningElement('<button className="px-4 py-2">Go</button>');
    expect(resolveClassNames(opening)).toBe("px-4 py-2");
  });

  it("resolves cn() with multiple literals", () => {
    const opening = parseOpeningElement(
      '<button className={cn("px-4", "py-2")}>Go</button>',
    );
    expect(resolveClassNames(opening)).toBe("px-4 py-2");
  });

  it("merges conflicting utilities via twMerge", () => {
    const opening = parseOpeningElement(
      '<button className={cn("outline-none", "focus-visible:ring-2")}>Go</button>',
    );
    expect(getClassNames(opening)).toBe("outline-none focus-visible:ring-2");
  });

  it("returns empty string for dynamic expressions", () => {
    const opening = parseOpeningElement(
      "<button className={cn(isActive && 'active')}>Go</button>",
    );
    expect(resolveClassNames(opening)).toBe("");
  });
});
