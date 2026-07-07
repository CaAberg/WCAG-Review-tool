import traverse, { type NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import type { File } from "@babel/types";

/** Walks all JSX elements in an AST. */
export function walkJsxElements(
  ast: File,
  visitor: (path: NodePath<t.JSXElement>) => void,
): void {
  traverse(ast, {
    JSXElement(path) {
      visitor(path);
    },
  });
}

/** Returns the lowercase tag name for a JSX opening element. */
export function getElementName(opening: t.JSXOpeningElement): string | null {
  const name = opening.name;
  if (t.isJSXIdentifier(name)) {
    return name.name.toLowerCase();
  }
  return null;
}

/** Returns true when the JSX element has an attribute with the given name. */
export function hasAttribute(
  opening: t.JSXOpeningElement,
  attrName: string,
): boolean {
  return opening.attributes.some((attr) => {
    if (!t.isJSXAttribute(attr)) return false;
    if (t.isJSXIdentifier(attr.name)) return attr.name.name === attrName;
    if (t.isJSXNamespacedName(attr.name)) {
      return attr.name.name.name === attrName;
    }
    return false;
  });
}

/** Returns the string value of a JSX attribute if statically known. */
export function getAttributeValue(
  opening: t.JSXOpeningElement,
  attrName: string,
): string | null {
  const attr = opening.attributes.find((a) => {
    if (!t.isJSXAttribute(a)) return false;
    if (t.isJSXIdentifier(a.name)) return a.name.name === attrName;
    return false;
  });

  if (!attr || !t.isJSXAttribute(attr) || !attr.value) return null;

  if (t.isStringLiteral(attr.value)) return attr.value.value;
  if (t.isJSXExpressionContainer(attr.value)) {
    const expr = attr.value.expression;
    if (t.isStringLiteral(expr)) return expr.value;
  }
  return null;
}

/** Returns class names from className attribute as a string. */
export function getClassNames(opening: t.JSXOpeningElement): string {
  const value = getAttributeValue(opening, "className");
  return value ?? "";
}

/** Returns line/column location for a JSX node. */
export function getLocation(node: t.Node): { line: number; column: number } {
  return {
    line: node.loc?.start.line ?? 0,
    column: node.loc?.start.column ?? 0,
  };
}

/** Returns true when the element has only non-text children (icons, etc.). */
export function hasOnlyNonTextChildren(element: t.JSXElement): boolean {
  const meaningful = element.children.filter((child) => {
    if (t.isJSXText(child)) return child.value.trim().length > 0;
    return t.isJSXElement(child) || t.isJSXExpressionContainer(child);
  });

  if (meaningful.length === 0) return true;

  return meaningful.every((child) => {
    if (t.isJSXText(child)) return false;
    return true;
  });
}

/** Returns visible text content from JSX children. */
export function getTextContent(element: t.JSXElement): string {
  return element.children
    .map((child) => {
      if (t.isJSXText(child)) return child.value.trim();
      if (t.isJSXElement(child)) return getTextContent(child);
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

/** Returns true when onClick is present on the opening element. */
export function hasOnClick(opening: t.JSXOpeningElement): boolean {
  return hasAttribute(opening, "onClick");
}

/** Interactive elements that should not use div onClick. */
export const NATIVE_INTERACTIVE = new Set([
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "summary",
]);
