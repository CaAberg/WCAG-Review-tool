# WCAG 2.2 React / TSX Patterns

Practical do/don't examples for common success criteria in React applications.

## 1.1.1 Non-text Content

```tsx
// Do: descriptive alt text
<img src="/avatar.jpg" alt="Jane Doe, product designer" />

// Do: decorative image
<img src="/divider.svg" alt="" role="presentation" />

// Don't: missing alt
<img src="/chart.png" />
```

## 1.3.1 Info and Relationships

```tsx
// Do: logical heading hierarchy
<h1>Dashboard</h1>
<h2>Recent activity</h2>

// Don't: skip levels
<h1>Dashboard</h1>
<h3>Recent activity</h3>

// Do: label associated with input
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Do: aria-labelledby when visual label is separate
<span id="search-label">Search</span>
<input aria-labelledby="search-label" />
```

## 1.4.3 Contrast (Minimum)

```tsx
// Do: sufficient contrast via design tokens
<p className="text-foreground bg-background">Body text</p>

// Don't: low-contrast custom colors without verification
<p className="text-gray-400 bg-gray-300">Hard to read</p>
```

Minimum ratios: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt bold).

## 2.1.1 Keyboard

```tsx
// Do: use native interactive elements
<button onClick={handleClick}>Save</button>

// Don't: div with click only
<div onClick={handleClick}>Save</div>

// If custom element is required:
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") handleClick();
  }}
>
  Save
</div>
```

## 2.4.7 Focus Visible

```tsx
// Do: visible focus ring
<button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Submit
</button>

// Don't: remove focus outline without replacement
<button className="outline-none">Submit</button>
```

## 2.5.8 Target Size (Minimum) — WCAG 2.2

Interactive targets should be at least 24×24 CSS pixels, or have sufficient spacing.

```tsx
// Do: adequate touch/click target
<button className="min-h-6 min-w-6 px-3 py-2">OK</button>

// Don't: tiny icon-only button without padding
<button className="h-4 w-4"><Icon /></button>
```

## 3.2.6 Consistent Help — WCAG 2.2

Place help mechanisms (contact link, chat, FAQ) in a consistent location across pages.

```tsx
// Do: help link in same nav region on every page
<nav aria-label="Utility">
  <Link href="/help">Help</Link>
</nav>
```

## 3.3.2 Labels or Instructions

```tsx
// Do: visible label + input type hint
<label htmlFor="password">Password</label>
<input id="password" type="password" aria-describedby="password-hint" />
<p id="password-hint">At least 8 characters.</p>

// Don't: placeholder-only label
<input placeholder="Email" />
```

## 4.1.2 Name, Role, Value

```tsx
// Do: button with accessible name
<button aria-label="Close dialog">
  <X aria-hidden />
</button>

// Don't: icon button with no name
<button><X /></button>

// Do: toggle with state
<button aria-pressed={isOn} onClick={toggle}>
  {isOn ? "On" : "Off"}
</button>
```

## 4.1.3 Status Messages

```tsx
// Do: announce dynamic updates
<div role="status" aria-live="polite">
  {saved && "Changes saved."}
</div>

// Do: alert for errors
<div role="alert">Could not save. Try again.</div>
```
