# COGA Design Patterns

Objectives and patterns from W3C supplemental cognitive accessibility guidance and Making Content Usable (COGA). These go beyond minimum WCAG conformance.

## Help users find what they need

| Pattern | What to do | Example |
|---------|------------|---------|
| Clear navigation | Repeat main nav on every page in same order | Header nav: Home, Analyzer, Guides, Account |
| Search | Provide search for content-heavy tools | Guide search by criterion name |
| Breadcrumbs | Show location in hierarchy | Guides > 1.1.1 Non-text Content |
| Consistent help | Help link in same place on every page | Footer or nav: "Help" → `/guides` |

## Help users understand content

| Pattern | What to do | Example |
|---------|------------|---------|
| Plain language | Short sentences, common words | "Add alt text to describe the image" |
| Define terms | Explain jargon on first use | "WCAG (Web Content Accessibility Guidelines)" |
| Visual support | Pair icons with text labels | `<Save icon> Save audit` |
| Summaries first | Lead with key point, then detail | "Missing alt text. Screen readers can't describe this image. Fix: ..." |
| Chunk content | Break long text into sections with headings | MDX guides with H2 sections |

## Help users avoid mistakes

| Pattern | What to do | Example |
|---------|------------|---------|
| Clear labels | Every input has visible label | `<label htmlFor="email">Email</label>` |
| Instructions upfront | Tell users what's expected before input | "Paste valid TSX code (max 50,000 characters)" |
| Confirm destructive actions | Dialog before delete | "Delete this audit? This cannot be undone." |
| Forgiving input | Accept common formats; suggest corrections | Parse error with line number and fix hint |
| No redundant entry | Remember previous input | Pre-fill email on return visit (3.3.7) |

## Help users focus

| Pattern | What to do | Example |
|---------|------------|---------|
| Minimize distractions | No auto-playing media | No autoplay on landing page |
| One task at a time | Wizard steps for complex flows | Save audit: title → confirm |
| Clear headings | Descriptive H1/H2 for each section | "Analysis Results" not "Output" |
| Reduce time pressure | No unnecessary timeouts | Session timeout with warning and extend option |

## Help users with memory

| Pattern | What to do | Example |
|---------|------------|---------|
| Visible context | Show current state clearly | "Analyzing component..." → "3 issues found" |
| Persistent labels | Don't rely on placeholder memory | Labels stay visible while typing |
| Accessible auth | No memorization-only auth | Email magic link, password manager support (3.3.8) |
| Save progress | Let users return later | Saved audits feature |

## Severity labels for tool output

Use plain-language severity that maps to technical levels:

| Internal severity | User-facing label | Meaning |
|-------------------|-------------------|---------|
| blocking | Must fix | Prevents access or fails Level A criterion |
| enhancement | Should fix | Best practice; improves experience |

Avoid color-only severity indicators — always pair with text label.

## Analyzer finding examples

**Good:**
> **Must fix — Missing alt text (WCAG 1.1.1)**
> Line 14: `<img>` has no `alt` attribute. Screen readers skip images without alt text.
> Fix: `<img src="/logo.png" alt="Company logo" />`

**Avoid:**
> Error: image-alt violation at 1.1.1 Level A

## Guide writing tone (MDX)

- Open with "Why it matters" in one paragraph.
- Show Do/Don't code examples side by side.
- End with "How our analyzer checks this" when a rule exists.
- Link to official Understanding WCAG doc for depth.
