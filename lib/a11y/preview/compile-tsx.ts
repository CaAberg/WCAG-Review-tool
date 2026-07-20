import * as Babel from "@babel/standalone";
import type { PluginObj } from "@babel/core";
import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export type CompileTsxResult = {
  code: string;
  componentName: string | null;
  error?: string;
};

const HTML_TAGS = new Set([
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "audio",
  "b",
  "button",
  "div",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "img",
  "input",
  "label",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "section",
  "select",
  "span",
  "summary",
  "table",
  "tbody",
  "td",
  "textarea",
  "th",
  "thead",
  "tr",
  "ul",
]);

/** Injects data-source-line on JSX opening elements for runtime finding mapping. */
const sourceLinePlugin: PluginObj = {
  visitor: {
    JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
      const line = path.node.loc?.start.line;
      if (!line) return;

      const hasSourceLine = path.node.attributes.some(
        (attr) =>
          t.isJSXAttribute(attr) &&
          t.isJSXIdentifier(attr.name) &&
          attr.name.name === "data-source-line",
      );
      if (hasSourceLine) return;

      path.node.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("data-source-line"),
          t.stringLiteral(String(line)),
        ),
      );
    },
  },
};

/** Removes imports and emits simple stubs for unknown bindings. */
function createImportStripPlugin(stubLines: string[]): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
        for (const specifier of path.node.specifiers) {
          if (t.isImportDefaultSpecifier(specifier)) {
            stubLines.push(createComponentStubLine(specifier.local.name));
            continue;
          }
          if (t.isImportSpecifier(specifier)) {
            const localName = t.isIdentifier(specifier.local)
              ? specifier.local.name
              : null;
            if (!localName) continue;
            if (localName === "cn" || localName === "clsx") {
              stubLines.push(createCnStubLine(localName));
            } else {
              stubLines.push(createComponentStubLine(localName));
            }
          }
          if (t.isImportNamespaceSpecifier(specifier)) {
            stubLines.push(`const ${specifier.local.name} = {};`);
          }
        }
        path.remove();
      },
    },
  };
}

function createCnStubLine(name: string): string {
  return `const ${name} = (...args) => args.filter(Boolean).join(" ");`;
}

function createComponentStubLine(name: string): string {
  return `const ${name} = () => React.createElement("span", { "data-stub": "${name}" });`;
}

/** Transforms pasted TSX into preview-ready JavaScript with source line metadata. */
export function compileTsxForPreview(source: string): CompileTsxResult {
  const importStubLines: string[] = [];
  let componentName: string | null = null;

  const exportPlugin: PluginObj = {
    visitor: {
      ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
        const decl = path.node.declaration;
        if (t.isFunctionDeclaration(decl) && decl.id) {
          componentName = decl.id.name;
          path.replaceWith(decl);
          return;
        }
        if (t.isIdentifier(decl)) {
          componentName = decl.name;
          path.replaceWith(
            t.variableDeclaration("const", [
              t.variableDeclarator(
                t.identifier("__PreviewDefault"),
                decl,
              ),
            ]),
          );
          componentName = "__PreviewDefault";
        }
      },
      ExportNamedDeclaration(path: NodePath<t.ExportNamedDeclaration>) {
        const decl = path.node.declaration;
        if (t.isFunctionDeclaration(decl) && decl.id) {
          if (!componentName) componentName = decl.id.name;
          path.replaceWith(decl);
        }
      },
    },
  };

  try {
    const transformed = Babel.transform(source, {
      presets: ["react", "typescript"],
      plugins: [
        createImportStripPlugin(importStubLines),
        sourceLinePlugin,
        exportPlugin,
      ],
      filename: "preview.tsx",
    });

    const stubCode = importStubLines.join("\n");

    const body = transformed.code ?? "";
    const assignGlobal = componentName
      ? `\n;window.__PREVIEW_COMPONENT__ = typeof ${componentName} !== "undefined" ? ${componentName} : null;`
      : `\n;window.__PREVIEW_COMPONENT__ = null;`;

    return {
      code: `${stubCode}\n${body}${assignGlobal}`,
      componentName,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Preview compile failed.";
    return { code: "", componentName: null, error: message };
  }
}

/** Returns true when a tag name is a native HTML element (lowercase). */
export function isNativeHtmlTag(tagName: string): boolean {
  return HTML_TAGS.has(tagName.toLowerCase());
}
