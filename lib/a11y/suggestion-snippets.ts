import type * as t from "@babel/types";
import { getAttributeValue } from "./ast-helpers";

/** Appends class tokens without duplicates, preserving existing order. */
export function appendClassTokens(
  existing: string[],
  additions: string[],
): string[] {
  const seen = new Set(existing);
  const merged = [...existing];

  for (const token of additions) {
    if (!seen.has(token)) {
      seen.add(token);
      merged.push(token);
    }
  }

  return merged;
}

/** Replaces matching class tokens with new values. */
export function replaceClassTokens(
  classTokens: string[],
  replacements: Record<string, string>,
): string[] {
  return classTokens.map((token) => replacements[token] ?? token);
}

/** Builds a heading element snippet with the suggested tag and text. */
export function headingFixSnippet(suggestedTag: string, text: string): string {
  const content = text.trim() || "Heading text";
  return `<${suggestedTag}>${content}</${suggestedTag}>`;
}

type ImgFixOverrides = {
  alt?: string;
  role?: string;
};

/** Builds an img snippet from static attributes on the opening element. */
export function imgFixSnippet(
  opening: t.JSXOpeningElement,
  overrides: ImgFixOverrides = {},
): string {
  const src = getAttributeValue(opening, "src") ?? "...";
  const alt = overrides.alt ?? getAttributeValue(opening, "alt") ?? "Description of the image";
  const role = overrides.role ?? getAttributeValue(opening, "role");

  const attrs = [`src="${src}"`, `alt="${alt}"`];
  if (role) attrs.push(`role="${role}"`);

  return `<img ${attrs.join(" ")} />`;
}

type FormLabelOptions = {
  id?: string | null;
  type?: string | null;
};

/** Derives a human-readable label from a field id. */
function labelTextFromId(id: string): string {
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Builds a label + input pair snippet for unlabeled form controls. */
export function formLabelFixSnippet(
  tag: string,
  options: FormLabelOptions = {},
): string {
  const id = options.id?.trim() || "field-id";
  const labelText = labelTextFromId(id);
  const typeAttr =
    tag === "input" && options.type ? ` type="${options.type}"` : "";

  return `<label htmlFor="${id}">${labelText}</label>\n<${tag} id="${id}"${typeAttr} />`;
}

/** Builds an element snippet with merged className tokens. */
export function mergeClassNameSnippet(
  tag: string,
  existingClassTokens: string[],
  appendTokens: string[],
  text?: string,
): string {
  const merged = appendClassTokens(existingClassTokens, appendTokens).join(" ");
  const content = text?.trim();

  if (content) {
    return `<${tag} className="${merged}">${content}</${tag}>`;
  }

  return `<${tag} className="${merged}" />`;
}

/** Builds an element snippet with replaced class tokens. */
export function replaceClassTokensSnippet(
  tag: string,
  classTokens: string[],
  replacements: Record<string, string>,
  text?: string,
): string {
  const merged = replaceClassTokens(classTokens, replacements).join(" ");
  const content = text?.trim() || "Readable text";

  return `<${tag} className="${merged}">${content}</${tag}>`;
}

/** Infers an accessible name from a child JSX identifier (e.g. CloseIcon → Close). */
export function inferAccessibleNameFromChild(childHint: string | null): string {
  if (!childHint) return "Action";

  const withoutSuffix = childHint.replace(/Icon$|Svg$|Symbol$/i, "");
  if (!withoutSuffix) return "Action";

  return withoutSuffix
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

/** Builds a button snippet with an accessible name. */
export function buttonNameFixSnippet(
  iconOnly: boolean,
  childHint?: string | null,
): string {
  if (iconOnly) {
    const label = inferAccessibleNameFromChild(childHint ?? null);
    const child = childHint ? `<${childHint} />` : "<Icon />";
    return `<button aria-label="${label}">${child}</button>`;
  }

  return "<button>Submit</button>";
}

/** Builds a preferred button replacement for div/span click handlers. */
export function clickHandlerFixSnippet(): string {
  return '<button type="button" onClick={handleClick}>Action</button>';
}

/** Builds a scroll-margin className snippet for focus-not-obscured fixes. */
export function focusNotObscuredFixSnippet(): string {
  return 'className="scroll-mt-16 focus-visible:ring-2"';
}

/** Builds an inline style snippet with high-contrast colors. */
export function inlineContrastFixSnippet(
  tag: string,
  text?: string,
): string {
  const content = text?.trim() || "Readable text";
  return `<${tag} style={{ color: '#1a1a1a', backgroundColor: '#ffffff' }}>${content}</${tag}>`;
}
