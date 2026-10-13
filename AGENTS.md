# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
```bash
pnpm dev            # Start development server
pnpm build          # Build production (runs lint first)
pnpm start          # Start production server
pnpm lint           # Run ESLint
```

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
```

## Architecture Overview

This is a Next.js 15 portfolio website built with TypeScript, React 19 and CSS Modules. The architecture follows modular design principles with clear separation of concerns.

### Key Technical Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: CSS Modules driven by the design tokens in `app/globals.css`, which also holds the reset and the few global primitives. No CSS framework or PostCSS config
- **UI Components**: No component library. Global primitive classes (`.wrap`, `.btn`, `.tags`, `.sec-head`) in `app/globals.css`, composed per component in a co-located `.module.css`
- **Motion**: `lib/motion` — one shared ticker and scroll store behind hooks (`useReveal`, `useScrub`, `useIntro`), all of it inert under reduced motion
- **Testing**: Vitest with jsdom environment
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

components/            # React components organized by domain
├── analytics/        # Page view, scroll and time tracking wrappers
├── blog/             # Reading routes: index, article, 404 panel
├── chrome/           # Site-wide overlay: command palette, theme, cursor, progress
├── consent/          # Cookie banner and preferences dialog
├── home/             # One directory per homepage section
│   ├── hero/         # ... contact, experience, process, proof,
│   └── ...           #     services, work, writing
├── markdown/         # Markdown renderer, parser and element components
└── nav/              # Site nav, brand mark, nav tools

config/               # Section data and types, one file per section
├── blog.ts           # Blog post metadata (`published` and `featured` live here)
├── sections.ts       # Section ids and nav order
└── ...               # career, caseStudies, engagements, proof, processSteps, ...

content/              # Markdown content
└── blog/             # Blog posts in markdown format

lib/                  # Utilities and shared logic
├── analytics.ts      # GA4 event helpers
├── motion/           # Ticker, scroll store and the motion hooks
└── opengraphUtils.tsx  # OG image helpers and the `ogPalette` literals

scripts/              # Tooling
└── visual-check.mjs  # Playwright visual sweep
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
- **Custom processor** (`components/markdown/markdownProcessor.ts`) for parsing
- **Syntax highlighting** via react-syntax-highlighter
- **Type-safe configuration** in `config/blog.ts`

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

- **Vitest** as test runner with jsdom environment
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
- Markdown content processing uses custom implementation, not external libraries
- Font loading is handled through `next/font/google` (Bricolage Grotesque, Schibsted Grotesk, Martian Mono)
- The project uses pnpm as package manager, not npm or yarn
- Components use consolidated structure to reduce over-decomposition