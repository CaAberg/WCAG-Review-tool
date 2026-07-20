---
name: mobile-a11y
description: >-
  Applies W3C mobile accessibility guidance and WCAG 2.2 success criteria
  relevant to phones, tablets, touchscreens, and responsive web apps. Use when
  building mobile UI, touch targets, responsive layouts, or when the user
  mentions mobile accessibility, WCAG2Mobile, touch, or viewport.
disable-model-invocation: true
---

# Mobile Accessibility

## Quick reference

- **Mobile overview:** https://www.w3.org/WAI/standards-guidelines/mobile/
- **WCAG2Mobile:** https://www.w3.org/TR/WCAG2Mobile/
- **WCAG 2.2:** https://www.w3.org/TR/WCAG22/ (primary standard)
- **What's New in WCAG 2.1/2.2:** Mobile-relevant SC additions

Mobile accessibility is not a separate standard — it is WCAG applied to mobile devices, touch input, small screens, and varied contexts (sunlight, motion, one-handed use).

## Scope

Applies to:
- Mobile web pages and progressive web apps
- Responsive sites viewed on phones/tablets
- Hybrid apps with web components
- Touch-first interfaces on any screen size

Also relevant to: digital TVs, wearables, in-car dashboards, IoT touch UIs.

## Key WCAG 2.2 success criteria for mobile

| SC | Requirement | Mobile relevance |
|----|-------------|------------------|
| 1.3.4 | Orientation (AA) | Content works in portrait and landscape |
| 1.4.4 | Resize Text (AA) | Text scales to 200% without loss |
| 1.4.10 | Reflow (AA) | No horizontal scroll at 320px width |
| 1.4.12 | Text Spacing (AA) | Adjustable spacing without breakage |
| 1.4.13 | Content on Hover or Focus (AA) | Tooltips/popovers dismissible on touch |
| 2.1.1 | Keyboard (A) | External keyboard / switch access on mobile |
| 2.5.1 | Pointer Gestures (A) | Single-pointer alternative to multipoint/path gestures |
| 2.5.2 | Pointer Cancellation (A) | Up-event activation; abort on cancel |
| 2.5.3 | Label in Name (A) | Visible label matches accessible name |
| 2.5.4 | Motion Actuation (A) | Alternative to device motion input |
| 2.5.7 | Dragging Movements (AA) | Single-pointer alternative to drag |
| 2.5.8 | Target Size (Minimum) (AA) | 24×24 CSS px minimum (with exceptions) |
| 2.3.3 | Animation from Interactions (AAA) | Reduced motion preference respected |

Full checklist: [wcag2mobile-checklist.md](wcag2mobile-checklist.md)

## Touch target guidelines

**WCAG 2.5.8 (AA):** Interactive targets at least 24×24 CSS pixels, unless:
- Spacing: undersized target has 24px spacing to nearest adjacent target
- Equivalent: same function available via larger target on same page
- Inline: target is a sentence or its size is essential

**Best practice (not required):** 44×44 CSS px (Apple HIG / Material) for primary touch controls.

```tsx
// Do: adequate target with Tailwind
<button className="min-h-11 min-w-11 px-4 py-2">Save</button>

// Do: expand hit area while keeping visual size small
<button className="relative p-3 -m-2">
  <Icon className="h-4 w-4" aria-hidden />
</button>
```

## Responsive patterns (React / Next.js)

```tsx
// Do: mobile-first layout
<div className="flex flex-col gap-4 md:flex-row md:gap-6">

// Do: reflow without fixed widths
<main className="mx-auto max-w-6xl px-4 sm:px-6">

// Don't: horizontal scroll at narrow viewports
<div className="w-[800px]">
```

## Viewport and zoom

- Do not disable user zoom (`user-scalable=no`, `maximum-scale=1`).
- Use responsive meta viewport: `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
- Test at 320px width (WCAG reflow requirement).

## Touch vs hover

- Never rely on hover alone for essential functionality.
- Provide tap/click equivalents for hover-revealed content.
- Ensure `:focus-visible` styles work for Bluetooth keyboard users on tablets.

## Motion and orientation

```tsx
// Do: respect prefers-reduced-motion
<div className="motion-safe:animate-bounce">

// CSS
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

- Do not lock orientation unless essential (1.3.4).

## Testing workflow

1. Test at 320px, 375px, and tablet breakpoints.
2. Verify all actions work with touch only (no hover dependency).
3. Measure target sizes in DevTools (computed box model).
4. Run axe / Lighthouse mobile audit.
5. Test with mobile screen reader (VoiceOver, TalkBack) on critical flows.
6. Test in bright light / outdoor contrast conditions manually.

## Related standards

- **WCAG 2.2:** Base success criteria — see `wcag-22` skill.
- **ATAG:** Mobile accessibility of authoring tool UI — see `atag-20` skill Part A.

## WCAG Access integration

This is the project copy for the WCAG Access repo. See [project-context.md](project-context.md) for mobile audit targets, responsive patterns, gaps, and e2e test notes.
