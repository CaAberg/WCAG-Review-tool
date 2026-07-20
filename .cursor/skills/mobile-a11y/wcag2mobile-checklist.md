# WCAG2Mobile Checklist

Practical checklist for applying WCAG 2.2 to mobile web content and apps. Based on W3C WCAG2Mobile guidance.

## Perceivable

- [ ] **1.1.1** Images/icons have text alternatives; decorative images use `alt=""`
- [ ] **1.3.4** Content usable in both portrait and landscape (unless essential)
- [ ] **1.4.3** Text contrast at least 4.5:1 (3:1 for large text) — test outdoors
- [ ] **1.4.4** Text resizes to 200% without assistive tech
- [ ] **1.4.10** Content reflows at 320px width without two-dimensional scrolling
- [ ] **1.4.11** UI component boundaries have 3:1 contrast against adjacent colors
- [ ] **1.4.12** Text spacing adjustments do not cause content loss
- [ ] **1.4.13** Hover/focus additional content is dismissible, hoverable, persistent

## Operable

- [ ] **2.1.1** All functionality available via keyboard (external keyboard on mobile)
- [ ] **2.1.2** No keyboard/t focus traps in modals or drawers
- [ ] **2.2.1** Time limits can be extended or disabled
- [ ] **2.2.2** Auto-moving content can be paused/stopped
- [ ] **2.3.1** No content flashes more than 3 times per second
- [ ] **2.4.1** Skip link or landmark navigation available
- [ ] **2.4.3** Focus order is logical when tabbing
- [ ] **2.4.7** Focus indicator visible on all interactive elements
- [ ] **2.4.11** Focused element not entirely hidden by author-created content (sticky headers/footers)
- [ ] **2.5.1** Multipoint/path gestures have single-pointer alternative
- [ ] **2.5.2** Activation on up-event; can abort before completion
- [ ] **2.5.3** Accessible name contains visible label text
- [ ] **2.5.4** Device motion input has UI alternative and can be disabled
- [ ] **2.5.7** Drag operations have single-pointer alternative
- [ ] **2.5.8** Touch targets at least 24×24 CSS px (or meet spacing/equivalent exceptions)

## Understandable

- [ ] **3.1.1** Page `lang` attribute set correctly
- [ ] **3.2.1** Focus does not trigger unexpected context changes
- [ ] **3.2.2** Input does not trigger unexpected context changes
- [ ] **3.2.3** Navigation repeated consistently across pages
- [ ] **3.2.6** Help mechanism in consistent location across pages
- [ ] **3.3.1** Errors clearly identified in text
- [ ] **3.3.2** Form fields have visible labels or instructions
- [ ] **3.3.3** Error messages suggest corrections
- [ ] **3.3.7** Previously entered information auto-populated or selectable
- [ ] **3.3.8** Authentication does not rely on cognitive function tests alone

## Robust

- [ ] **4.1.2** Custom components have name, role, value exposed to assistive tech
- [ ] **4.1.3** Status messages announced without moving focus (aria-live)

## Mobile-specific manual tests

- [ ] Pinch-to-zoom works (viewport not locked)
- [ ] No essential content requires hover
- [ ] Sticky nav/footers do not cover focused elements
- [ ] Forms usable with on-screen keyboard (fields not obscured)
- [ ] `prefers-reduced-motion` honored for animations
- [ ] VoiceOver (iOS) / TalkBack (Android) can complete primary tasks
