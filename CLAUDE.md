# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
```bash
pnpm dev            # Start development server
pnpm build          # Build production (runs lint first)
pnpm start          # Start production server
pnpm lint           # Run ESLint
pnpm exec tsc --noEmit  # Type-check app and tests (one tsconfig covers both)
pnpm css-types      # Regenerate the *.module.css.d.ts class-name declarations
pnpm knip           # Report unused files, exports and dependencies
```

After adding, renaming or removing a class in a CSS Module, run `pnpm css-types`
and commit the regenerated `.d.ts`; CI fails on drift (`pnpm css-types --check`).
Under `noUncheckedIndexedAccess` these declarations are what make `styles.foo` a
plain `string` — and a misspelt class a type error.

### Testing
```bash
pnpm test           # Run all tests once
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Run tests with coverage report
```

### Visual Check
```bash
pnpm visual-check   # Sweep every route type in both themes, 1440px and 390px,
                    # and with reduced motion, against a running dev server
pnpm a11y-check     # axe-core scan (WCAG 2.2 AA) of every route type in both
                    # themes, against a running dev server
```

Both take `--base http://localhost:<port>` and sample articles from the running
server's `/sitemap.xml`, which lists only published posts. The visual check's
modules live in `scripts/visual-check/`.

## Architecture Overview

This is a Next.js 16 portfolio website built with TypeScript, React 19.3 and CSS Modules. The architecture follows modular design principles with clear separation of concerns.

### Key Technical Stack
- **Framework**: Next.js 16 with App Router, built with Turbopack (the default for `next dev` and `next build`)
- **Language**: TypeScript with strict configuration
- **Styling**: CSS Modules driven by the design tokens in `app/globals.css`, which also holds the reset and the few global primitives. No CSS framework or PostCSS config
- **UI Components**: No component library. Global primitive classes (`.wrap`, `.btn`, `.tags`, `.sec-head`) in `app/globals.css`, composed per component in a co-located `.module.css`
- **Motion**: `lib/motion` — one shared ticker and scroll store behind hooks (`useReveal`, `useScrub`, `useIntro`), all of it inert under reduced motion. Subscription callbacks go through React's `useEffectEvent`
- **Testing**: Vitest — Node environment by default, jsdom for `.tsx` tests and the DOM-touching `.ts` tests listed in `vitest.config.ts`
- **Code Quality**: ESLint with TypeScript, stylistic, and import rules
- **Fonts**: Bricolage Grotesque, Schibsted Grotesk and Martian Mono via `next/font/google`
- **Deployment**: Vercel with automatic optimization

### Project Structure

```
app/                    # Next.js app router pages
├── blog/              # Blog functionality
├── globals.css        # Global styles
├── layout.tsx         # Root layout with metadata
└── page.tsx           # Homepage

assets/fonts/          # Static font cuts (with their OFL licences) for share cards and icons

components/            # React components organized by domain
├── analytics/        # Page view, scroll and time tracking wrappers
├── blog/             # Reading routes: index, article, 404 panel
├── chrome/           # Site-wide overlay: command palette, theme, cursor, progress
├── consent/          # Cookie banner and preferences dialog
├── contact/          # /contact page body and the form (client)
├── home/             # One directory per homepage section
│   ├── hero/         # ... contact, experience, process, proof,
│   └── ...           #     services, work, writing
├── markdown/         # Markdown renderer, parser and element components
└── nav/              # Site nav, brand mark, nav tools

config/               # Section data and types, one file per section
├── blog.ts           # Blog post metadata (`published` and `featured` live here)
├── contact.ts        # Contact form fields, topics, limits and action states
├── sections.ts       # Section ids and nav order
└── ...               # career, caseStudies, engagements, proof, processSteps, ...

content/              # Markdown content
└── blog/             # Blog posts in markdown format

lib/                  # Utilities and shared logic
├── analytics.ts      # GA4 event helpers
├── contact/          # Server-only contact form: validation, spam checks, Resend call
├── content/          # Server-only file reads: post markdown, image sizes
├── motion/           # Ticker, scroll store and the motion hooks
└── og/               # Share cards and icons: layout, fonts, `ogPalette` literals

scripts/              # Tooling
├── a11y-check.mjs    # axe-core accessibility scan
├── visual-check.mjs  # Playwright visual sweep (entry)
└── visual-check/     # Its modules: options, routes, sitemap sample, page probes
```

### Component Architecture

Components follow a consistent pattern:
- **Domain-organized**: Components grouped by feature/domain (blog, chrome, consent, home, nav)
- **Co-located tests**: Each component has a `.test.tsx` file alongside it
- **TypeScript interfaces**: Props interfaces named simply as `Props`
- **Arrow function components**: Using `FC<Props>` pattern

### Content Management

Blog content is managed through:
- **Markdown files** in `content/blog/` directory
- **Custom parser** in `components/markdown/parser/` — pure: block, inline, list and table parsers over the types in `types.ts`, with `parseMarkdown` in `blockParser.ts` as the entry
- **File reads** in `lib/content/` (server-only): the post markdown and its `cache()`-wrapped lookup, and the image measuring the parser is handed
- **Syntax highlighting** via react-syntax-highlighter
- **Type-safe configuration** in `config/blog.ts`

### Contact Form

- **`/contact`** renders per request (the only dynamic page): the form carries a
  signed render time minted per view, and `?topic=privacy` preselects the topic
  without JavaScript. The CSP stays one static header.
- **Server Action** in `app/contact/actions.ts`, used through `useActionState`
  in `components/contact/ContactForm.tsx`; works without JavaScript. The logic
  is `lib/contact/handleContactSubmission.ts`: honeypot, field validation,
  config, signed minimum fill time, BotID, then the email.
- **Resend** through a plain `fetch` (`lib/contact/sendWithResend.ts`), not the
  SDK. Sender in `config/site.ts`; the recipient only ever from the env.
- **Vercel BotID**: `withBotId` in `next.config.ts` (same-origin proxy, so the
  CSP needs nothing new), `initBotId` in `instrumentation-client.ts` protecting
  `POST /contact`, `checkBotId()` in `lib/contact/botCheck.ts`. Only consulted
  on Vercel and for JavaScript submissions: native form posts cannot carry its
  headers.
- **Spam is dropped silently**: the visitor sees "sent", nothing is sent.
- **Env vars** (Vercel only): `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
  `CONTACT_FORM_SECRET`. Missing any, the build still passes and the form
  answers "not set up" with a server warning.

### Code Style Standards

The project enforces strict coding standards:
- **Single quotes** for strings
- **4-space indentation**
- **Semicolons required**
- **No default exports** (except Next.js pages which require them)
- **One React component per file** with matching filename
- **Strict TypeScript** with type checking
- **Import organization** with typescript resolver

### Testing Strategy

- **Vitest** as test runner: `.ts` tests run in Node, `.tsx` tests (and the `.ts` tests listed in `DOM_TS_TESTS` in `vitest.config.ts`) in jsdom. A new `.ts` test that touches `document`/`window` goes on that list
- **No test globals**: tests import `describe`/`it`/`expect`/`vi` from `vitest`; jest-dom matchers come from `test/setup.ts`. `test/itemAt.ts` indexes into a list in a test without a `!`
- **Testing Library** for React component testing  
- **Co-located tests** alongside source files
- **Behavior-focused testing**: Tests focus on component behavior vs implementation details
- **Coverage reporting** with v8 provider
- **Test-specific ESLint rules** that relax strict typing for testing
- **Visual checking** via `pnpm visual-check` (`scripts/visual-check.mjs`), the only visual-regression axis the project has — there is no Storybook and no Chromatic

### Build Configuration

- **Strict ESLint** runs before build
- **TypeScript checking** enforced during build
- **Next.js optimizations**: Compression, React strict mode, no powered-by header
- **Vercel deployment** with automatic image optimization and static generation

### Development Philosophy

Based on the comprehensive DEVELOPMENT_GUIDE.md, this project follows:
- **YAGNI principle**: Only implement what's needed
- **Component-based architecture**: Clear separation of concerns
- **Test-driven development**: Tests co-located with components
- **Modular design**: Self-contained, focused modules
- **Performance-conscious**: Optimized builds and careful dependency management

## Development Guidelines

This project follows the comprehensive development standards outlined in DEVELOPMENT_GUIDE.md. Key guidelines include:

### Component Standards
- **One React component per file** with matching filename (e.g., `UserCard.tsx` contains `UserCard` component)
- **Arrow function components**: Use `FC<Props>` pattern with arrow functions
- **Simple Props interface**: Name component props interface as `Props`
- **Co-located tests**: Each component should have a `.test.tsx` file alongside it
- **Domain organization**: Group components by feature/domain rather than by technical type

### File Organization
- **Keep files under 300 lines** for maintainability
- **Tests co-located** with source code using `.test.tsx` extension
- **Private methods at the end** of each file
- **Export at definition**: Use `export const ComponentName` instead of separate export statements

### TypeScript Standards
- **Let TypeScript infer types** when obvious (e.g., return types)
- **Explicitly type** complex objects and function parameters
- **No default exports** except for Next.js pages that require them
- **Avoid `any`, `as`, `!`** assertions in production code
- **Use interfaces for data models**, classes for behavior

For complete development standards, testing strategies, and architectural patterns, refer to DEVELOPMENT_GUIDE.md.

## Important Notes

- Build process includes linting, so code must pass ESLint to build successfully
- All components should have accompanying tests focused on behavior
- Navigation lives in `components/nav/SiteNav.tsx`, with the global tools it hosts in `components/chrome`
- Markdown content processing uses custom implementation, not external libraries. The parser stays pure; anything that reads a file goes in `lib/content/`, which is marked server-only
- Font loading is handled through `next/font/google` (Bricolage Grotesque, Schibsted Grotesk, Martian Mono)
- The project uses pnpm as package manager, not npm or yarn
- Components use consolidated structure to reduce over-decomposition