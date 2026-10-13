# Brand

The site is built around the **editor**: a caret, a text selection, a `git log`, a terminal. The concept is "I build the hard part". It is shown in the material itself: rich text editors, typed data layers, and logs. It never claims to be visionary.

Tokens live in `app/globals.css`. This file explains how to use them. If the two disagree, the CSS is correct and this file needs updating.

---

## 1. Positioning

- **Line:** Software architect, fractional CTO & hands-on tech lead.
- **Long form:** "Software architect, fractional CTO, and hands-on tech lead. Since 2008 I've taken products from the first commit to production, for startups, scale-ups, and the Parliament of Iceland."
- **Who it speaks to:** founders who need a product built properly, teams without a CTO, and companies hiring a senior or tech-lead engineer. Recruiters arrive from the CV, so the site uses the CV's vocabulary next to the consultancy one.
- **Source of truth:** `config/site.ts` holds the name, URL, email, positioning line, description, and start year. Year counts are derived from `sinceYear` and are never typed by hand.

## 2. Voice

**Personality:** hands-on, precise, candid, and calm. A senior engineer explaining a decision, not an agency pitching a vision.

Rules:

- **First person singular.** "I", "me", and "my". Never "we" or "our".
- **Concrete over abstract.** Name the actual thing, like "a typed, hierarchical document model on Slate.js", rather than "innovative solutions".
- **Short declarative sentences.** Prefer a period or a colon. Use em dashes sparingly in site copy.
- **Numbers only when the CV backs them**, for example 2× messaging performance, a team of six, or three editors. Never round up and never invent a metric. If no figure exists, describe the outcome instead.
- **Problem → what I did → result** for any piece of work.
- **US English with the serial comma**, for example "judgment", "organization", "color", or "research, tests, and review".
- **Sentence case** for headings and labels.
- **No hype words:** visionary, world-class, cutting-edge, passionate, 10×, rockstar.

Lines that sound right:

- "I build the hard part."
- "Four projects where the difficult part was the whole point."
- "I write the code myself and run agent pipelines for research, tests, and review."
- "Fix plan your team can run without me."

## 3. Messaging pillars

1. **The hard part.** Structured editors, end-to-end typed data, messaging under load, and departments built from zero.
2. **Hands-on leadership.** I lead teams while still writing the code. I set high technical standards and hold them, and I mentor with patience.
3. **AI with judgment.** I work in a daily Claude Code workflow with custom skills, agent pipelines, and knowledge bases. Senior judgment decides what ships.

## 4. Color

The palette is dark-first ("basalt") with a light theme ("glacier fog"). It has two accents, and both come from the editor:

- **Caret, molten orange:** where the action is, such as the caret, the HEAD ref, highlights, and the primary button.
- **Selection, editor blue:** what is selected or emphasized, such as the highlighted phrase in the hero and selected rows.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0f171d` | `#edf1f2` | Page background |
| `--bg-2` | `#131e25` | `#e3eaec` | Raised bands |
| `--surface` | `#172430` | `#f8fafa` | Panels, cards |
| `--line` | `#243540` | `#cbd7db` | Hairlines, borders |
| `--fg` | `#e4ecee` | `#0e181e` | Primary text |
| `--fg-2` | `#a9b8bf` | `#3a4a52` | Secondary text |
| `--muted` | `#7d8f98` | `#566770` | Tertiary text, metadata |
| `--select` | `#3d7bff` | `#2f62e6` | Selection, focus |
| `--select-soft` | blue at 28% | blue at 20% | Selection wash |
| `--caret` | `#ff8b3d` | `#e0561c` | Caret, accents, primary action |
| `--caret-text` | `#ff8b3d` | `#b03e0e` | Caret orange used as text |
| `--caret-fill` | `#ff8b3d` | `#b03e0e` | Caret fill behind `--on-accent` text |
| `--ice` | `#9fd3e6` | `#1d6f8c` | Code tokens |
| `--on-accent` | `#0b1218` | `#ffffff` | Text on a `--caret-fill` |
| `--on-select` | `#0b1218` | `#ffffff` | Text on a `--select` fill, including `::selection` |

Rules:

- Never hard-code a color that only works in one theme. Use the tokens.
- Accents are for small surfaces such as a caret, a ref chip, a highlight, or a button. Never use them for body text.
- Body text must meet WCAG AA contrast: 4.5:1, or 3:1 for large text. `--caret` itself is 3.35:1 on the light `--bg`, so caret-colored text uses `--caret-text`, and text set on a caret fill sits on `--caret-fill`. Both are the same orange in the dark theme and a deeper one in the light theme. `--muted` clears 4.5:1 on `--bg`, `--bg-2` and `--surface` in both themes.
- A faint film grain (`--grain-opacity`) sits over everything for texture.

## 5. Typography

All three faces load through `next/font/google` in `app/layout.tsx`. The share cards and icons cannot use `next/font` or variable axes, so they read static, Latin-subset cuts from `assets/fonts` (see `lib/og/fonts.ts`).

- **Display: Bricolage Grotesque** (`--font-display`). Use it for headlines and big numbers. Large type uses the narrow width axis (`wdth` 75–90).
- **Body: Schibsted Grotesk** (`--font-body`). Use it for running text, in roman and italic.
- **Mono: Martian Mono** (`--font-mono`). Use it for code, hashes, terminal output, dates, and metadata. Use it sparingly.

The scale is fluid (`--fs-hero` down to `--fs-micro`). Layout is one editorial column on a 12-column grid, up to `--maxw` (1320px), with generous section padding.

## 6. Motifs and motion

- **Editor motifs:** a blinking caret, a selection highlight, an editable hero headline, the career as a `git log --graph`, the process as a terminal transcript, and a command palette (⌘K).
- **Motion is hand-written**, with no animation libraries. It eases out (`--ease-out`) and uses short durations (`--dur-xs` to `--dur-l`).
- **Content first.** Every section reads as plain markup without JavaScript. Animation only reveals content that is already there.
- **Reduced motion is respected everywhere.** The `.motion` class gates every animated rule, so a reduced-motion visitor gets the static page.

## 7. Don'ts

- Don't use navy and gold, stock "creator/sage/ruler" archetypes, or tagline-speak such as "From Vision to Reality".
- Don't use metrics or client names the CV cannot back up.
- Don't use a third accent color, gradients as decoration, or glow effects on text.
- Don't switch voice between "I" and "we".
