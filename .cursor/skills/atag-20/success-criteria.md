# ATAG 2.0 Success Criteria Summary

Part A success criteria are prefixed A; Part B are prefixed B. Levels: (A), (AA), (AAA).

## Part A — Make the authoring tool user interface accessible

### Principle A.1: Authoring tool user interface is perceivable

**Guideline A.1.1 (Text Alternatives)**
- A.1.1.1 Non-text Content (A) — Tool UI non-text has text alternatives.

**Guideline A.1.2 (Time-based Media)**
- A.1.2.1 Audio-only and Video-only (A)
- A.1.2.2 Captions (A)

**Guideline A.1.3 (Adaptable)**
- A.1.3.1 Info and Relationships (A)
- A.1.3.2 Meaningful Sequence (A)

**Guideline A.1.4 (Distinguishable)**
- A.1.4.1 Use of Color (A)
- A.1.4.2 Audio Control (A)
- A.1.4.3 Contrast (Minimum) (AA)
- A.1.4.4 Resize Text (AA)

### Principle A.2: Authoring tool user interface is operable

**Guideline A.2.1 (Keyboard Accessible)**
- A.2.1.1 Keyboard (A)
- A.2.1.2 No Keyboard Trap (A)

**Guideline A.2.2 (Timing)**
- A.2.2.1 Timing Adjustable (A)
- A.2.2.2 Pause, Stop, Hide (A)

**Guideline A.2.3 (Seizures)**
- A.2.3.1 Three Flashes (A)

**Guideline A.2.4 (Navigable)**
- A.2.4.1 Bypass Blocks (A)
- A.2.4.2 Page Titled (A)
- A.2.4.3 Focus Order (A)
- A.2.4.4 Link Purpose (A)
- A.2.4.5 Multiple Ways (AA)
- A.2.4.6 Headings and Labels (AA)
- A.2.4.7 Focus Visible (AA)

**Guideline A.2.5 (Input Modalities)**
- A.2.5.1 Pointer Gestures (A)
- A.2.5.2 Pointer Cancellation (A)

### Principle A.3: Authoring tool user interface is understandable

**Guideline A.3.1 (Readable)**
- A.3.1.1 Language of Page (A)

**Guideline A.3.2 (Predictable)**
- A.3.2.1 On Focus (A)
- A.3.2.2 On Input (A)
- A.3.2.3 Consistent Navigation (AA)
- A.3.2.4 Consistent Identification (AA)

**Guideline A.3.3 (Input Assistance)**
- A.3.3.1 Error Identification (A)
- A.3.3.2 Labels or Instructions (A)
- A.3.3.3 Error Suggestion (AA)
- A.3.3.4 Error Prevention (AA)

### Principle A.4: Authoring tool user interface is robust

**Guideline A.4.1 (Compatible)**
- A.4.1.1 Parsing (A)
- A.4.1.2 Name, Role, Value (A)
- A.4.1.3 Status Messages (AA)

## Part B — Support authors in producing accessible content

### Principle B.1: Fully automatic processes produce accessible content

**Guideline B.1.1 (Content Generation)**
- B.1.1.1 Non-text Content (A) — Auto-generated content has text alternatives.
- B.1.1.2 Info and Relationships (A)
- B.1.1.3 Preserve Accessibility Info (A) — Saving/exporting retains accessibility markup.

**Guideline B.1.2 (Preservation)**
- B.1.2.1 Restructuring and Recoding (A) — Transformations preserve accessibility info.

### Principle B.2: Authors are supported in producing accessible content

**Guideline B.2.1 (Authoring Actions)**
- B.2.1.1 Object Information (A) — Authors can view accessibility properties of elements.

**Guideline B.2.2 (Production)**
- B.2.2.1 Accessible Templates (A)
- B.2.2.2 Accessible Pre-Authored Content (A)

**Guideline B.2.3 (Copy/Paste)**
- B.2.3.1 Accessible Copy/Paste (A)

**Guideline B.2.4 (Checking and Guidance)**
- B.2.4.1 Accessibility Guidelines (AA) — Tool provides WCAG-oriented guidance.
- B.2.4.2 Accessibility Check (AA) — Tool performs automated accessibility checks.
- B.2.4.3 Assist Authors (AA) — Tool helps correct problems.
- B.2.4.4 Assist with Promoting (AA) — Tool promotes accessible authoring practices.
- B.2.4.5 On-by-Default (AA) — Accessibility features enabled by default.

**Guideline B.2.5 (Repair)**
- B.2.5.1 Manual Repair (AAA)
- B.2.5.2 Automatic Repair (AAA)

### Principle B.3: Authors are supported in improving accessibility

**Guideline B.3.1 (Documentation)**
- B.3.1.1 Accessibility Documentation (AA)
- B.3.1.2 Accessibility in Help (AA)

**Guideline B.3.2 (Training)**
- B.3.2.1 Accessibility Training (AAA)

## Quick Part B checklist for analyzers/editors

- [ ] Automated checks cover relevant WCAG criteria (B.2.4.2)
- [ ] Results explain problems and link to guidance (B.2.4.1, B.2.4.3)
- [ ] Fix suggestions are actionable (B.2.4.3)
- [ ] Accessibility is not disabled by default (B.2.4.5)
- [ ] Export/save preserves alt, labels, ARIA (B.1.1.3)
- [ ] Help/docs cover accessibility for authors (B.3.1.1)
