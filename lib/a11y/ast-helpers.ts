import traverse, { type NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import type { File } from "@babel/types";
import { twMerge } from "tailwind-merge";

const CLASS_MERGE_FUNCTIONS = new Set(["cn", "clsx"]);

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

/** Returns resolved class names from className, including static cn()/clsx() calls. */
export function resolveClassNames(opening: t.JSXOpeningElement): string {
  const attr = opening.attributes.find((a) => {
    if (!t.isJSXAttribute(a)) return false;
    if (t.isJSXIdentifier(a.name)) return a.name.name === "className";
    return false;
  });

  if (!attr || !t.isJSXAttribute(attr) || !attr.value) return "";

  if (t.isStringLiteral(attr.value)) {
    return attr.value.value;
  }

  if (t.isJSXExpressionContainer(attr.value)) {
    const expr = attr.value.expression;
    if (t.isStringLiteral(expr)) return expr.value;
    const resolved = resolveStaticClassExpression(expr);
    if (resolved !== null) return twMerge(resolved);
  }

  return "";
}

/** Returns class names from className attribute as a string. */
export function getClassNames(opening: t.JSXOpeningElement): string {
  return resolveClassNames(opening);
}

/** Folds static cn()/clsx()/array/object class expressions into a class string. */
export function resolveStaticClassExpression(expr: t.Node): string | null {
  if (t.isStringLiteral(expr)) return expr.value;

  if (t.isBooleanLiteral(expr)) return null;

  if (t.isCallExpression(expr)) {
    const calleeName = getCallExpressionName(expr.callee);
    if (calleeName && CLASS_MERGE_FUNCTIONS.has(calleeName)) {
      const parts = expr.arguments
        .map((arg) => resolveStaticClassExpression(arg))
        .filter((part): part is string => part !== null && part.length > 0);
      return parts.length > 0 ? parts.join(" ") : null;
    }
  }

  if (t.isArrayExpression(expr)) {
    const parts = expr.elements.flatMap((element) => {
      if (!element || t.isSpreadElement(element)) return [];
      const resolved = resolveStaticClassExpression(element);
      return resolved ? [resolved] : [];
    });
    return parts.length > 0 ? parts.join(" ") : null;
  }

  if (t.isObjectExpression(expr)) {
    const parts: string[] = [];
    for (const prop of expr.properties) {
      if (!t.isObjectProperty(prop)) continue;
      const key = getObjectPropertyKey(prop);
      if (!key) continue;
      if (isTruthyStaticExpression(prop.value)) {
        parts.push(key);
      }
    }
    return parts.length > 0 ? parts.join(" ") : null;
  }

  if (t.isLogicalExpression(expr) && expr.operator === "&&") {
    if (isTruthyStaticExpression(expr.left)) {
      return resolveStaticClassExpression(expr.right);
    }
    return null;
  }

  if (t.isConditionalExpression(expr)) {
    if (isTruthyStaticExpression(expr.test)) {
      return resolveStaticClassExpression(expr.consequent);
    }
    if (isFalsyStaticExpression(expr.test)) {
      return resolveStaticClassExpression(expr.alternate);
    }
    return null;
  }

  return null;
}

function getCallExpressionName(
  callee: t.CallExpression["callee"],
): string | null {
  if (t.isIdentifier(callee)) return callee.name;
  return null;
}

function getObjectPropertyKey(prop: t.ObjectProperty): string | null {
  if (t.isIdentifier(prop.key)) return prop.key.name;
  if (t.isStringLiteral(prop.key)) return prop.key.value;
  return null;
}

function isTruthyStaticExpression(expr: t.Node): boolean {
  if (t.isBooleanLiteral(expr)) return expr.value;
  if (t.isNumericLiteral(expr)) return expr.value !== 0;
  if (t.isStringLiteral(expr)) return expr.value.length > 0;
  if (t.isNullLiteral(expr)) return false;
  return false;
}

function isFalsyStaticExpression(expr: t.Node): boolean {
  return isTruthyStaticExpression(expr) === false && (t.isBooleanLiteral(expr) || t.isNullLiteral(expr));
}

/** Splits a className string into individual utility tokens. */
export function parseClassTokens(classNames: string): string[] {
  return classNames.split(/\s+/).filter(Boolean);
}

/** Extracts statically known inline style properties from a JSX style attribute. */
export function getInlineStyleProperties(
  opening: t.JSXOpeningElement,
): Record<string, string> {
  const attr = opening.attributes.find((a) => {
    if (!t.isJSXAttribute(a)) return false;
    if (t.isJSXIdentifier(a.name)) return a.name.name === "style";
    return false;
  });

  if (!attr || !t.isJSXAttribute(attr) || !attr.value) return {};

  if (!t.isJSXExpressionContainer(attr.value)) return {};

  const expr = attr.value.expression;
  if (t.isObjectExpression(expr)) {
    return parseObjectExpression(expr);
  }

  return {};
}

function parseObjectExpression(
  object: t.ObjectExpression,
): Record<string, string> {
  const styles: Record<string, string> = {};

  for (const prop of object.properties) {
    if (!t.isObjectProperty(prop)) continue;

    let key: string | null = null;
    if (t.isIdentifier(prop.key)) {
      key = prop.key.name;
    } else if (t.isStringLiteral(prop.key)) {
      key = prop.key.value;
    }
    if (!key) continue;

    const value = getStaticExpressionValue(prop.value);
    if (value !== null) {
      styles[key] = value;
    }
  }

  return styles;
}

function getStaticExpressionValue(value: t.Node): string | null {
  if (t.isStringLiteral(value)) return value.value;
  if (t.isNumericLiteral(value)) return String(value.value);
  return null;
}

/** Returns a single inline style property when statically known. */
export function getInlineStyleProperty(
  opening: t.JSXOpeningElement,
  property: string,
): string | null {
  const styles = getInlineStyleProperties(opening);
  return styles[property] ?? null;
}

/** Returns the value of a string JSX attribute when statically known (e.g. role). */
export function getJsxAttributeValue(
  opening: t.JSXOpeningElement,
  attrName: string,
): string | null {
  return getAttributeValue(opening, attrName);
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
