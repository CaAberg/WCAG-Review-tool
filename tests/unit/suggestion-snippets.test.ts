import { describe, expect, it } from "vitest";
import * as t from "@babel/types";
import {
  appendClassTokens,
  buttonNameFixSnippet,
  clickHandlerFixSnippet,
  formLabelFixSnippet,
  headingFixSnippet,
  imgFixSnippet,
  inferAccessibleNameFromChild,
  inlineContrastFixSnippet,
  mergeClassNameSnippet,
  replaceClassTokens,
  replaceClassTokensSnippet,
} from "@/lib/a11y/suggestion-snippets";

describe("suggestion-snippets", () => {
  it("builds heading fix snippet with text content", () => {
    expect(headingFixSnippet("h2", "Recent activity")).toBe(
      "<h2>Recent activity</h2>",
    );
  });

  it("uses placeholder heading text when empty", () => {
    expect(headingFixSnippet("h2", "   ")).toBe("<h2>Heading text</h2>");
  });

  it("builds img fix snippet from static attributes", () => {
    const opening = t.jsxOpeningElement(
      t.jsxIdentifier("img"),
      [
        t.jsxAttribute(t.jsxIdentifier("src"), t.stringLiteral("/logo.png")),
      ],
      true,
    );

    expect(
      imgFixSnippet(opening, { alt: "Description of the image" }),
    ).toBe('<img src="/logo.png" alt="Description of the image" />');
  });

  it("builds decorative img fix snippet", () => {
    const opening = t.jsxOpeningElement(
      t.jsxIdentifier("img"),
      [t.jsxAttribute(t.jsxIdentifier("src"), t.stringLiteral("/logo.png"))],
      true,
    );

    expect(
      imgFixSnippet(opening, { alt: "", role: "presentation" }),
    ).toBe('<img src="/logo.png" alt="" role="presentation" />');
  });

  it("builds form label fix snippet with id and type", () => {
    expect(
      formLabelFixSnippet("input", { id: "email", type: "email" }),
    ).toBe(
      '<label htmlFor="email">Email</label>\n<input id="email" type="email" />',
    );
  });

  it("appends class tokens without duplicates", () => {
    expect(
      appendClassTokens(["outline-none", "text-sm"], [
        "focus-visible:ring-2",
        "text-sm",
      ]),
    ).toEqual(["outline-none", "text-sm", "focus-visible:ring-2"]);
  });

  it("replaces class tokens", () => {
    expect(
      replaceClassTokens(["text-gray-300", "bg-white"], {
        "text-gray-300": "text-foreground",
      }),
    ).toEqual(["text-foreground", "bg-white"]);
  });

  it("builds merged className snippet", () => {
    expect(
      mergeClassNameSnippet("button", ["outline-none"], [
        "focus-visible:ring-2",
      ], "Save"),
    ).toBe(
      '<button className="outline-none focus-visible:ring-2">Save</button>',
    );
  });

  it("builds replaced class token snippet", () => {
    expect(
      replaceClassTokensSnippet(
        "p",
        ["text-gray-300", "bg-white"],
        { "text-gray-300": "text-gray-900" },
        "Muted",
      ),
    ).toBe('<p className="text-gray-900 bg-white">Muted</p>');
  });

  it("infers accessible name from child icon component", () => {
    expect(inferAccessibleNameFromChild("CloseIcon")).toBe("Close");
  });

  it("builds icon-only button fix snippet", () => {
    expect(buttonNameFixSnippet(true, "CloseIcon")).toBe(
      '<button aria-label="Close"><CloseIcon /></button>',
    );
  });

  it("builds click handler fix snippet", () => {
    expect(clickHandlerFixSnippet()).toBe(
      '<button type="button" onClick={handleClick}>Action</button>',
    );
  });

  it("builds inline contrast fix snippet", () => {
    expect(inlineContrastFixSnippet("p", "Muted")).toBe(
      "<p style={{ color: '#1a1a1a', backgroundColor: '#ffffff' }}>Muted</p>",
    );
  });
});
