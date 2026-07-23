import type { Page } from "playwright-core";
import type { A11yFinding, ElementRect } from "../types";

/** Parses an axe target value into a selector chain. */
export function parseAxeTarget(target: unknown): string[] {
  if (Array.isArray(target)) {
    return target.flatMap((entry) => {
      if (Array.isArray(entry)) {
        return entry.map((part) => String(part));
      }

      return [String(entry)];
    });
  }

  if (typeof target === "string" && target.length > 0) {
    return [target];
  }

  return [];
}

/** Creates a stable finding identifier. */
export function createFindingId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `finding-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Converts viewport rect and scroll offsets to document-space coordinates. */
export function toDocumentRect(
  rect: { x: number; y: number; width: number; height: number },
  scrollX: number,
  scrollY: number,
): ElementRect {
  return {
    x: rect.x + scrollX,
    y: rect.y + scrollY,
    width: rect.width,
    height: rect.height,
  };
}

/** Resolves an element bounding box in Playwright page coordinates. */
export async function resolveBoundingBoxOnPage(
  page: Page,
  selectors: string[],
): Promise<ElementRect | undefined> {
  if (selectors.length === 0) return undefined;

  try {
    const result = await page.evaluate((selectorChain) => {
      let context: Document | Element = document;

      for (let index = 0; index < selectorChain.length - 1; index += 1) {
        const frameSelector = selectorChain[index];
        if (!frameSelector) return null;

        const frameElement = context.querySelector(frameSelector);
        if (!(frameElement instanceof HTMLIFrameElement)) return null;

        const frameDocument = frameElement.contentDocument;
        if (!frameDocument) return null;
        context = frameDocument;
      }

      const finalSelector = selectorChain[selectorChain.length - 1];
      if (!finalSelector) return null;

      const element = context.querySelector(finalSelector);
      if (!(element instanceof Element)) return null;

      const rect = element.getBoundingClientRect();
      return {
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }, selectors);

    if (!result || result.width <= 0 || result.height <= 0) {
      return undefined;
    }

    return result;
  } catch {
    return undefined;
  }
}

/** Adds bounding boxes to findings using a Playwright page. */
export async function enrichFindingsOnPage(
  page: Page,
  findings: A11yFinding[],
  pageUrl: string,
): Promise<A11yFinding[]> {
  return Promise.all(
    findings.map(async (finding) => {
      const selectors = finding.selectors ?? [];
      const boundingBox =
        selectors.length > 0
          ? await resolveBoundingBoxOnPage(page, selectors)
          : undefined;

      return {
        ...finding,
        pageUrl,
        boundingBox: boundingBox ?? finding.boundingBox,
      };
    }),
  );
}

/** Resolves bounding boxes in a live browser document (extension/content script). */
export function enrichFindingsInDocument(
  doc: Document,
  findings: A11yFinding[],
  pageUrl: string,
): A11yFinding[] {
  return findings.map((finding) => {
    const selectors = finding.selectors ?? [];
    let boundingBox = finding.boundingBox;

    if (selectors.length > 0) {
      try {
        let context: Document | Element = doc;

        for (let index = 0; index < selectors.length - 1; index += 1) {
          const frameSelector = selectors[index];
          if (!frameSelector) break;

          const frameElement = context.querySelector(frameSelector);
          if (!(frameElement instanceof HTMLIFrameElement)) break;

          const frameDocument = frameElement.contentDocument;
          if (!frameDocument) break;
          context = frameDocument;
        }

        const finalSelector = selectors[selectors.length - 1];
        if (finalSelector) {
          const element = context.querySelector(finalSelector);
          if (element instanceof Element) {
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              boundingBox = toDocumentRect(rect, window.scrollX, window.scrollY);
            }
          }
        }
      } catch {
        // Keep finding without a bounding box.
      }
    }

    return {
      ...finding,
      pageUrl,
      boundingBox,
    };
  });
}
