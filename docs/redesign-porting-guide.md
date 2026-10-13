# Porting the redesign prototype into the app

The design is a finished vanilla HTML/CSS/JS prototype at
`/Users/stefan/Downloads/stefan-knoch-redesign-source`. This is the contract for turning a prototype section
into a React section without the design drifting.

Read first: the prototype's `BRIEF.md`, plus your own section's three files
(`src/sections/<name>/<name>.{html,css,js}`).

## Non-negotiables from the brief

- **Content is visible at rest.** Never leave content at `opacity: 0` waiting for an observer. All real text
  lives in the markup, so the page reads with JS disabled or still loading.
- **Only animate** `transform`, `opacity`, `clip-path`, and custom properties that drive those.
- **Reduced motion**: everything still works and reads. No scrubs, pins or loops; at most quick fades.
- **Touch and mobile** (390px): no cursor-only effects, no horizontal overflow, stacked layouts. Pinned scroll
  sequences fall back to normal flow under 900px.
- **Never hard-code a colour** that only works in one theme. Use the tokens.
- Decorative visuals get `aria-hidden="true"`; hover effects are mirrored on `:focus-visible`.
- Keep the copy factual. Tighten wording if needed, but do not invent clients, numbers or testimonials.

## Where things live

| Concern | Location |
|---|---|
| Design tokens, resets, `.wrap` / `.btn` / `.tags` / `.ulink`, motion primitives (`.sw` `.swi` `.mr` `.rv`), `.toast` | `app/globals.css` — already done, global on purpose |
| Motion hooks and singletons | `lib/motion` (see below) |
| Section anchor ids, nav labels, chord keys | `config/sections.ts` |
| Section copy and data | a typed file per section in `config/` |
| Section styles | a co-located CSS Module, e.g. `components/home/work/Work.module.css` |

## The motion kit

Import from `@/lib/motion`. It replaces the prototype's `SK` global and preserves its semantics.

Hooks: `useReveal`, `useMaskReveal`, `useInView`, `useScrub`, `useScrollState`, `useRaf`,
`useIntro`, `useStageEvent`, `useMagnet`, `useReducedMotion`, `useFinePointer`.

Plain functions for imperative engines: `subscribeTick`, `registerScrub`, `observeInView`, `onStage`,
`emitStage`, `tween`, `EASE`, `scrambleInto`, `scrambleHash`, `copyText`, `showToast`,
`clamp`, `lerp`, `mapRange`, `smoothstep`, `prefersReducedMotion`, `hasFinePointer`.

Mapping from the prototype:

| Prototype | Here |
|---|---|
| `SK.raf(fn)` | `useRaf` / `subscribeTick` |
| `SK.scrub(el, fn, o)` | `useScrub(ref, fn, o)` |
| `SK.inview(el, o)` | `useInView(ref, o)` / `observeInView` |
| `SK.reveal(els, o)` | `useReveal(ref, { selector, delay, stagger })` |
| `SK.maskReveal(el, o)` | `useMaskReveal(ref, o)` |
| `SK.magnetic(el, s)` | `useMagnet(ref, { strength: s })` |
| `SK.on('intro' \| 'layout' \| …)` | `useIntro()` / `useStageEvent(event, fn)` |
| `SK.reduced` / `SK.fine` | `useReducedMotion()` / `useFinePointer()` — or the plain functions inside effects |
| `SK.copy` / `SK.toast` | `copyText` / `showToast` |

Rules:

- **Use the shared clock.** Never call `requestAnimationFrame` in a loop of your own; subscribe to the ticker.
  Pause off-screen and on `visibilitychange`: pass `enabled` to `useRaf`, or unsubscribe from the ticker.
- **Effects must be idempotent and fully tear down.** React Strict Mode double-invokes them; a leaked listener,
  observer, animation or ticker subscription is a bug.
- Cap canvas DPR at 2. Paint static layers once to an offscreen canvas; repaint only on resize, theme or layout.
- Re-measure on `useStageEvent('layout', …)` rather than caching a rect forever.

## Component shape

- One component per file, filename matches the component, arrow function `FC<Props>`, props interface named
  `Props`, no default exports, files under 300 lines.
- Keep large imperative work in framework-agnostic modules (`*.ts`, no JSX) called from a thin React wrapper.
  Canvas simulations, typing schedulers, SVG builders and geometry belong there, not in JSX.
- **Imperative code must not hard-code CSS Module class names.** Pass the `styles` object (or the specific
  names) in from the component, since the real names are hashed.
- **Animation names are hashed too.** css-loader scopes `animation` / `animation-name` idents inside a CSS
  Module, so a module cannot reach a global `@keyframes` by name — the reference silently resolves to nothing
  and the animation simply never runs. Declare the keyframes locally in your module instead. (`:global(...)`
  is a *selector* construct and is not valid inside an `animation` shorthand value.) The global class names
  above are plain classes, not keyframes, and are safe to use by literal name.
- Single quotes, 4-space indent, semicolons. No `any`, `as`, or `!` in production code.

## The custom cursor contract

A page-global cursor inspects elements via `data-cursor`. Leaf components declare how they want to be treated;
the cursor knows nothing about specific components.

| Value | Effect |
|---|---|
| *(none)* | Default blinking caret |
| `data-cursor="text"` | Morphs into an I-beam |
| `data-cursor="select"` | Grows a selection box around the element |
| `data-cursor="native"` | Shows the OS cursor (inputs, iframes) |
| `data-cursor="none"` | Hides the custom cursor |

Links, buttons and `[role="button"]` already get the selection treatment; only add the attribute when the
default is wrong.

## Verifying a section

1. `pnpm lint && pnpm exec tsc --noEmit && pnpm test` must be clean.
2. Load the running dev server and screenshot your section at desktop dark, desktop light, mobile (390px) dark,
   and once with reduced motion forced.
3. Zero console errors. No horizontal overflow at 390px.
