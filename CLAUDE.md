# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture Overview

This is a Next.js 15 portfolio website built with TypeScript, React 19, and Tailwind CSS. The architecture follows modular design principles with clear separation of concerns.

### Key Technical Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom variants
- **Testing**: Vitest with jsdom environment
- **Code Quality**: ESLint with TypeScript, stylistic, and import rules
- **Fonts**: Geist Sans and Geist Mono

### Project Structure

```
app/                    # Next.js app router pages
├── blog/              # Blog functionality
├── globals.css        # Global styles
├── layout.tsx         # Root layout with metadata
└── page.tsx           # Homepage

components/            # React components organized by domain
├── blog/             # Blog-specific components
├── cards/            # Card components (Project, Service)
├── layout/           # Layout components (Header, Footer)  
├── sections/         # Page sections (Hero, About, etc.)
└── ui/               # Reusable UI primitives

config/               # Configuration files with TypeScript interfaces
├── blog.ts           # Blog configuration and types
├── experience.ts     # Experience/career data
├── portfolio.ts      # Portfolio projects data
└── services.ts       # Services offered data

content/              # Markdown content
└── blog/             # Blog posts in markdown format

lib/                  # Utilities and shared logic
├── markdownProcessor.ts  # Custom markdown processing
└── utils.ts          # Utility functions (includes cn helper)
```

### Component Architecture

Components follow a consistent pattern:
- **Domain-organized**: Components grouped by feature/domain (blog, cards, sections)
- **Co-located tests**: Each component has a `.test.tsx` file alongside it
- **TypeScript interfaces**: Props interfaces named simply as `Props`
- **Arrow function components**: Using `FC<Props>` pattern
- **Radix UI integration**: UI primitives use class-variance-authority for variants

### Content Management

Blog content is managed through:
- **Markdown files** in `content/blog/` directory
- **Custom processor** (`lib/markdownProcessor.ts`) for parsing
- **Syntax highlighting** via react-syntax-highlighter
- **Type-safe configuration** in `config/blog.ts`

### Code Style Standards

The project enforces strict coding standards:
- **Single quotes** for strings
- **4-space indentation**
- **Semicolons required**
- **No default exports** (except Next.js pages which require them)
- **Strict TypeScript** with type checking
- **Import organization** with typescript resolver

### Testing Strategy

- **Vitest** as test runner with jsdom environment
- **Testing Library** for React component testing  
- **Co-located tests** alongside source files
- **Coverage reporting** with v8 provider
- **Test-specific ESLint rules** that relax strict typing for testing

### Build Configuration

- **Strict ESLint** runs before build
- **TypeScript errors ignored** during build (handled by ESLint)
- **Unoptimized images** for static deployment
- **Type checking** via ESLint with project service

### Development Philosophy

Based on the comprehensive DEVELOPMENT_GUIDE.md, this project follows:
- **YAGNI principle**: Only implement what's needed
- **Component-based architecture**: Clear separation of concerns
- **Test-driven development**: Tests co-located with components
- **Modular design**: Self-contained, focused modules
- **Performance-conscious**: Optimized builds and careful dependency management

## Important Notes

- Build process includes linting, so code must pass ESLint to build successfully
- All components should have accompanying tests
- Markdown content processing uses custom implementation, not external libraries
- Font loading is handled through Next.js with Geist font family
- The project uses pnpm as package manager, not npm or yarn