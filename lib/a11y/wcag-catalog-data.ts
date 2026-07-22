import type { WcagCriterion, WcagGuideline } from "./types";
import { criterionToGuideSlug, criterionUnderstandingUrl } from "./wcag-slug";

type CriterionSeed = {
  id: string;
  name: string;
  level: "A" | "AA" | "AAA";
  description: string;
  guidelineId: string;
  guidelineName: string;
  principle: "1" | "2" | "3" | "4";
  principleName: string;
};

function seedToCriterion(entry: CriterionSeed): WcagCriterion {
  return {
    id: entry.id,
    name: entry.name,
    level: entry.level,
    description: entry.description,
    guideSlug: criterionToGuideSlug(entry.id, entry.name),
    guidelineId: entry.guidelineId,
    guidelineName: entry.guidelineName,
    understandingUrl: criterionUnderstandingUrl(entry.id),
  };
}

const P1 = { principle: "1" as const, principleName: "Perceivable" };
const P2 = { principle: "2" as const, principleName: "Operable" };
const P3 = { principle: "3" as const, principleName: "Understandable" };
const P4 = { principle: "4" as const, principleName: "Robust" };

/** Raw seed data for all active WCAG 2.1/2.2 success criteria (4.1.1 excluded). */
const CRITERION_SEEDS: CriterionSeed[] = [
  { id: "1.1.1", name: "Non-text Content", level: "A", guidelineId: "1.1", guidelineName: "Text Alternatives", description: "All non-text content has a text alternative serving the equivalent purpose.", ...P1 },
  { id: "1.2.1", name: "Audio-only and Video-only (Prerecorded)", level: "A", guidelineId: "1.2", guidelineName: "Time-based Media", description: "Alternatives are provided for prerecorded audio-only and video-only media.", ...P1 },
  { id: "1.2.2", name: "Captions (Prerecorded)", level: "A", guidelineId: "1.2", guidelineName: "Time-based Media", description: "Captions are provided for all prerecorded audio content in synchronized media.", ...P1 },
  { id: "1.2.3", name: "Audio Description or Media Alternative (Prerecorded)", level: "A", guidelineId: "1.2", guidelineName: "Time-based Media", description: "An alternative or audio description is provided for prerecorded video.", ...P1 },
  { id: "1.2.4", name: "Captions (Live)", level: "AA", guidelineId: "1.2", guidelineName: "Time-based Media", description: "Captions are provided for all live audio content in synchronized media.", ...P1 },
  { id: "1.2.5", name: "Audio Description (Prerecorded)", level: "AA", guidelineId: "1.2", guidelineName: "Time-based Media", description: "Audio description is provided for all prerecorded video content.", ...P1 },
  { id: "1.2.6", name: "Sign Language (Prerecorded)", level: "AAA", guidelineId: "1.2", guidelineName: "Time-based Media", description: "Sign language interpretation is provided for all prerecorded audio content.", ...P1 },
  { id: "1.2.7", name: "Extended Audio Description (Prerecorded)", level: "AAA", guidelineId: "1.2", guidelineName: "Time-based Media", description: "Extended audio description is provided where pauses are insufficient.", ...P1 },
  { id: "1.2.8", name: "Media Alternative (Prerecorded)", level: "AAA", guidelineId: "1.2", guidelineName: "Time-based Media", description: "A media alternative is provided for all prerecorded synchronized media.", ...P1 },
  { id: "1.2.9", name: "Audio-only (Live)", level: "AAA", guidelineId: "1.2", guidelineName: "Time-based Media", description: "An alternative is provided for live audio-only content.", ...P1 },
  { id: "1.3.1", name: "Info and Relationships", level: "A", guidelineId: "1.3", guidelineName: "Adaptable", description: "Information, structure, and relationships can be programmatically determined.", ...P1 },
  { id: "1.3.2", name: "Meaningful Sequence", level: "A", guidelineId: "1.3", guidelineName: "Adaptable", description: "Correct reading sequence can be programmatically determined.", ...P1 },
  { id: "1.3.3", name: "Sensory Characteristics", level: "A", guidelineId: "1.3", guidelineName: "Adaptable", description: "Instructions do not rely solely on sensory characteristics.", ...P1 },
  { id: "1.3.4", name: "Orientation", level: "AA", guidelineId: "1.3", guidelineName: "Adaptable", description: "Content does not restrict view to a single orientation unless essential.", ...P1 },
  { id: "1.3.5", name: "Identify Input Purpose", level: "AA", guidelineId: "1.3", guidelineName: "Adaptable", description: "Input purpose can be programmatically determined for common fields.", ...P1 },
  { id: "1.3.6", name: "Identify Purpose", level: "AAA", guidelineId: "1.3", guidelineName: "Adaptable", description: "Purpose of UI components and regions can be programmatically determined.", ...P1 },
  { id: "1.4.1", name: "Use of Color", level: "A", guidelineId: "1.4", guidelineName: "Distinguishable", description: "Color is not the only visual means of conveying information.", ...P1 },
  { id: "1.4.2", name: "Audio Control", level: "A", guidelineId: "1.4", guidelineName: "Distinguishable", description: "Mechanism is available to pause or control auto-playing audio.", ...P1 },
  { id: "1.4.3", name: "Contrast (Minimum)", level: "AA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "Text has a contrast ratio of at least 4.5:1 (3:1 for large text).", ...P1 },
  { id: "1.4.4", name: "Resize Text", level: "AA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "Text can be resized up to 200% without loss of content or function.", ...P1 },
  { id: "1.4.5", name: "Images of Text", level: "AA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "Real text is used rather than images of text where possible.", ...P1 },
  { id: "1.4.6", name: "Contrast (Enhanced)", level: "AAA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "Text has a contrast ratio of at least 7:1 (4.5:1 for large text).", ...P1 },
  { id: "1.4.7", name: "Low or No Background Audio", level: "AAA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "Background audio in speech is low or can be turned off.", ...P1 },
  { id: "1.4.8", name: "Visual Presentation", level: "AAA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "User can customize foreground, background, width, and spacing.", ...P1 },
  { id: "1.4.9", name: "Images of Text (No Exception)", level: "AAA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "Images of text are only used for decoration or essential.", ...P1 },
  { id: "1.4.10", name: "Reflow", level: "AA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "Content reflows without horizontal scrolling at 320 CSS pixels width.", ...P1 },
  { id: "1.4.11", name: "Non-text Contrast", level: "AA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "UI components and graphical objects have 3:1 contrast.", ...P1 },
  { id: "1.4.12", name: "Text Spacing", level: "AA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "No loss of content when text spacing is adjusted to minimums.", ...P1 },
  { id: "1.4.13", name: "Content on Hover or Focus", level: "AA", guidelineId: "1.4", guidelineName: "Distinguishable", description: "Additional content on hover/focus is dismissible, hoverable, and persistent.", ...P1 },
  { id: "2.1.1", name: "Keyboard", level: "A", guidelineId: "2.1", guidelineName: "Keyboard Accessible", description: "All functionality is operable through a keyboard interface.", ...P2 },
  { id: "2.1.2", name: "No Keyboard Trap", level: "A", guidelineId: "2.1", guidelineName: "Keyboard Accessible", description: "Keyboard focus can be moved away from any component using standard keys.", ...P2 },
  { id: "2.1.4", name: "Character Key Shortcuts", level: "A", guidelineId: "2.1", guidelineName: "Keyboard Accessible", description: "Single-character shortcuts can be turned off or remapped.", ...P2 },
  { id: "2.2.1", name: "Timing Adjustable", level: "A", guidelineId: "2.2", guidelineName: "Enough Time", description: "Users can turn off, adjust, or extend time limits.", ...P2 },
  { id: "2.2.2", name: "Pause, Stop, Hide", level: "A", guidelineId: "2.2", guidelineName: "Enough Time", description: "Moving, blinking, or auto-updating content can be paused or hidden.", ...P2 },
  { id: "2.2.3", name: "No Timing", level: "AAA", guidelineId: "2.2", guidelineName: "Enough Time", description: "Timing is not an essential part of the event or activity.", ...P2 },
  { id: "2.2.4", name: "Interruptions", level: "AAA", guidelineId: "2.2", guidelineName: "Enough Time", description: "Interruptions can be postponed or suppressed by the user.", ...P2 },
  { id: "2.2.5", name: "Re-authenticating", level: "AAA", guidelineId: "2.2", guidelineName: "Enough Time", description: "Data is preserved when re-authentication is required.", ...P2 },
  { id: "2.2.6", name: "Timeouts", level: "AAA", guidelineId: "2.2", guidelineName: "Enough Time", description: "Users are warned about inactivity timeouts that cause data loss.", ...P2 },
  { id: "2.3.1", name: "Three Flashes or Below Threshold", level: "A", guidelineId: "2.3", guidelineName: "Seizures and Physical Reactions", description: "Content does not flash more than three times per second.", ...P2 },
  { id: "2.3.2", name: "Three Flashes", level: "AAA", guidelineId: "2.3", guidelineName: "Seizures and Physical Reactions", description: "Content does not flash more than three times in any one-second period.", ...P2 },
  { id: "2.3.3", name: "Animation from Interactions", level: "AAA", guidelineId: "2.3", guidelineName: "Seizures and Physical Reactions", description: "Motion animation from interactions can be disabled.", ...P2 },
  { id: "2.4.1", name: "Bypass Blocks", level: "A", guidelineId: "2.4", guidelineName: "Navigable", description: "Mechanism to bypass repeated blocks of content is available.", ...P2 },
  { id: "2.4.2", name: "Page Titled", level: "A", guidelineId: "2.4", guidelineName: "Navigable", description: "Pages have titles that describe topic or purpose.", ...P2 },
  { id: "2.4.3", name: "Focus Order", level: "A", guidelineId: "2.4", guidelineName: "Navigable", description: "Focusable components receive focus in an order that preserves meaning.", ...P2 },
  { id: "2.4.4", name: "Link Purpose (In Context)", level: "A", guidelineId: "2.4", guidelineName: "Navigable", description: "Purpose of each link can be determined from link text or context.", ...P2 },
  { id: "2.4.5", name: "Multiple Ways", level: "AA", guidelineId: "2.4", guidelineName: "Navigable", description: "More than one way is available to locate pages within a set.", ...P2 },
  { id: "2.4.6", name: "Headings and Labels", level: "AA", guidelineId: "2.4", guidelineName: "Navigable", description: "Headings and labels describe topic or purpose.", ...P2 },
  { id: "2.4.7", name: "Focus Visible", level: "AA", guidelineId: "2.4", guidelineName: "Navigable", description: "Keyboard focus indicator is visible.", ...P2 },
  { id: "2.4.8", name: "Location", level: "AAA", guidelineId: "2.4", guidelineName: "Navigable", description: "User's location within a set of pages is available.", ...P2 },
  { id: "2.4.9", name: "Link Purpose (Link Only)", level: "AAA", guidelineId: "2.4", guidelineName: "Navigable", description: "Purpose of each link can be determined from link text alone.", ...P2 },
  { id: "2.4.10", name: "Section Headings", level: "AAA", guidelineId: "2.4", guidelineName: "Navigable", description: "Section headings organize content.", ...P2 },
  { id: "2.4.11", name: "Focus Not Obscured (Minimum)", level: "AA", guidelineId: "2.4", guidelineName: "Navigable", description: "Focused component is not entirely hidden by author-created content.", ...P2 },
  { id: "2.4.12", name: "Focus Not Obscured (Enhanced)", level: "AAA", guidelineId: "2.4", guidelineName: "Navigable", description: "No part of the focused component is hidden by author-created content.", ...P2 },
  { id: "2.4.13", name: "Focus Appearance", level: "AAA", guidelineId: "2.4", guidelineName: "Navigable", description: "Focus indicator meets minimum area and contrast.", ...P2 },
  { id: "2.5.1", name: "Pointer Gestures", level: "A", guidelineId: "2.5", guidelineName: "Input Modalities", description: "Multipoint or path-based gestures have a single-pointer alternative.", ...P2 },
  { id: "2.5.2", name: "Pointer Cancellation", level: "A", guidelineId: "2.5", guidelineName: "Input Modalities", description: "Pointer down-events do not execute functions on up-event alone.", ...P2 },
  { id: "2.5.3", name: "Label in Name", level: "A", guidelineId: "2.5", guidelineName: "Input Modalities", description: "Accessible name contains visible label text.", ...P2 },
  { id: "2.5.4", name: "Motion Actuation", level: "A", guidelineId: "2.5", guidelineName: "Input Modalities", description: "Motion-based operation can be disabled and has an alternative.", ...P2 },
  { id: "2.5.5", name: "Target Size (Enhanced)", level: "AAA", guidelineId: "2.5", guidelineName: "Input Modalities", description: "Target size is at least 44 by 44 CSS pixels.", ...P2 },
  { id: "2.5.6", name: "Concurrent Input Mechanisms", level: "AAA", guidelineId: "2.5", guidelineName: "Input Modalities", description: "Content does not restrict use of available input modalities.", ...P2 },
  { id: "2.5.7", name: "Dragging Movements", level: "AA", guidelineId: "2.5", guidelineName: "Input Modalities", description: "Dragging has a single-pointer alternative without dragging.", ...P2 },
  { id: "2.5.8", name: "Target Size (Minimum)", level: "AA", guidelineId: "2.5", guidelineName: "Input Modalities", description: "Target size is at least 24 by 24 CSS pixels.", ...P2 },
  { id: "3.1.1", name: "Language of Page", level: "A", guidelineId: "3.1", guidelineName: "Readable", description: "Default human language of each page can be programmatically determined.", ...P3 },
  { id: "3.1.2", name: "Language of Parts", level: "AA", guidelineId: "3.1", guidelineName: "Readable", description: "Language of each passage can be programmatically determined.", ...P3 },
  { id: "3.1.3", name: "Unusual Words", level: "AAA", guidelineId: "3.1", guidelineName: "Readable", description: "Mechanism is available for identifying specific definitions of words.", ...P3 },
  { id: "3.1.4", name: "Abbreviations", level: "AAA", guidelineId: "3.1", guidelineName: "Readable", description: "Mechanism for identifying expanded form of abbreviations is available.", ...P3 },
  { id: "3.1.5", name: "Reading Level", level: "AAA", guidelineId: "3.1", guidelineName: "Readable", description: "Supplementary content or simplified version is available when text requires advanced reading ability.", ...P3 },
  { id: "3.1.6", name: "Pronunciation", level: "AAA", guidelineId: "3.1", guidelineName: "Readable", description: "Mechanism is available for identifying specific pronunciation.", ...P3 },
  { id: "3.2.1", name: "On Focus", level: "A", guidelineId: "3.2", guidelineName: "Predictable", description: "Receiving focus does not initiate a change of context.", ...P3 },
  { id: "3.2.2", name: "On Input", level: "A", guidelineId: "3.2", guidelineName: "Predictable", description: "Changing setting of a UI component does not automatically cause change of context.", ...P3 },
  { id: "3.2.3", name: "Consistent Navigation", level: "AA", guidelineId: "3.2", guidelineName: "Predictable", description: "Navigation mechanisms repeat in the same relative order.", ...P3 },
  { id: "3.2.4", name: "Consistent Identification", level: "AA", guidelineId: "3.2", guidelineName: "Predictable", description: "Components with same functionality are identified consistently.", ...P3 },
  { id: "3.2.5", name: "Change on Request", level: "AAA", guidelineId: "3.2", guidelineName: "Predictable", description: "Changes of context are initiated only by user request.", ...P3 },
  { id: "3.2.6", name: "Consistent Help", level: "A", guidelineId: "3.2", guidelineName: "Predictable", description: "Help mechanisms appear in the same relative order on each page.", ...P3 },
  { id: "3.3.1", name: "Error Identification", level: "A", guidelineId: "3.3", guidelineName: "Input Assistance", description: "Input errors are identified and described to the user in text.", ...P3 },
  { id: "3.3.2", name: "Labels or Instructions", level: "A", guidelineId: "3.3", guidelineName: "Input Assistance", description: "Labels or instructions are provided when content requires user input.", ...P3 },
  { id: "3.3.3", name: "Error Suggestion", level: "AA", guidelineId: "3.3", guidelineName: "Input Assistance", description: "Suggestions are provided when input errors are detected.", ...P3 },
  { id: "3.3.4", name: "Error Prevention (Legal, Financial, Data)", level: "AA", guidelineId: "3.3", guidelineName: "Input Assistance", description: "Submissions are reversible, checked, or confirmed for legal/financial/data.", ...P3 },
  { id: "3.3.5", name: "Help", level: "AAA", guidelineId: "3.3", guidelineName: "Input Assistance", description: "Context-sensitive help is available.", ...P3 },
  { id: "3.3.6", name: "Error Prevention (All)", level: "AAA", guidelineId: "3.3", guidelineName: "Input Assistance", description: "Submissions are reversible, checked, or confirmed.", ...P3 },
  { id: "3.3.7", name: "Redundant Entry", level: "A", guidelineId: "3.3", guidelineName: "Input Assistance", description: "Information previously entered is auto-populated or selectable.", ...P3 },
  { id: "3.3.8", name: "Accessible Authentication (Minimum)", level: "AA", guidelineId: "3.3", guidelineName: "Input Assistance", description: "Cognitive function tests are not required for authentication unless alternatives exist.", ...P3 },
  { id: "3.3.9", name: "Accessible Authentication (Enhanced)", level: "AAA", guidelineId: "3.3", guidelineName: "Input Assistance", description: "Cognitive function tests are not required for authentication.", ...P3 },
  { id: "4.1.2", name: "Name, Role, Value", level: "A", guidelineId: "4.1", guidelineName: "Compatible", description: "Name, role, and value can be programmatically determined for UI components.", ...P4 },
  { id: "4.1.3", name: "Status Messages", level: "AA", guidelineId: "4.1", guidelineName: "Compatible", description: "Status messages can be programmatically determined through role or properties.", ...P4 },
];

/** All active WCAG 2.1/2.2 success criteria. */
export const WCAG_CATALOG: WcagCriterion[] = CRITERION_SEEDS.map(seedToCriterion);

/** Unique WCAG guidelines derived from the catalog. */
export const WCAG_GUIDELINES: WcagGuideline[] = Array.from(
  new Map(
    CRITERION_SEEDS.map((seed) => [
      seed.guidelineId,
      {
        id: seed.guidelineId,
        name: seed.guidelineName,
        principle: seed.principle,
        principleName: seed.principleName,
      },
    ]),
  ).values(),
).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

/** Total number of catalogued success criteria. */
export const WCAG_CATALOG_COUNT = WCAG_CATALOG.length;
