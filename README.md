# Stefan Knoch - Portfolio Website

A modern, responsive portfolio website built with Next.js 15, React 19, and TypeScript.

## 🚀 **Live Demo**

[Portfolio Website](https://stefanknoch.com)

## ✨ **Features**

### **Core Functionality**

- **Responsive Design** - Optimized for all devices and screen sizes
- **Modern Tech Stack** - Built with Next.js 15, React 19, and TypeScript
- **Performance Optimized** - Server-side rendering and optimized assets
- **SEO Optimized** - Comprehensive SEO with structured data, Open Graph, and sitemaps
- **Accessibility** - WCAG AA compliant with proper ARIA labels

### **Content Management**

- **Blog System** - Markdown-based blog with comprehensive syntax support
- **Dynamic Content** - Centralized configuration files for easy updates
- **Rich Markdown** - Full markdown support including tables, quotes, and code highlighting
- **Tag System** - Categorized blog posts and portfolio projects

### **Brand Integration**

- **Consistent Branding** - Follows established brand guidelines from `BRAND.md`
- **Professional Design** - Clean, modern UI with strategic use of brand colors
- **Content Strategy** - Aligned with brand messaging and positioning

## 🛠 **Tech Stack**

### **Frontend Framework**

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### **Styling & UI**

- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful, customizable icons
- **Bricolage Grotesque / Schibsted Grotesk / Martian Mono** - Display, body and mono typography

### **Content & Code**

- **React Syntax Highlighter** - Code block formatting
- **Markdown Processing** - Custom markdown parser with table and formatting support
- **Dynamic OG Images** - Auto-generated social media images
- **Structured Data** - JSON-LD schema markup for search engines

### **Testing & Quality**

- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code quality and style enforcement
- **TypeScript** - Static type checking

### **Development Tools**

- **pnpm** - Fast, disk space efficient package manager
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - CSS vendor prefixing

## 📁 **Project Structure**

```bash
portfolio-website/
├── app/                          # Next.js App Router pages
│   ├── blog/                     # Blog pages
│   │   ├── [slug]/              # Individual blog post pages
│   │   └── page.tsx             # Blog index page
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Home page
├── components/                   # Reusable React components
│   ├── blog/                    # Blog-specific components
│   │   ├── BlogHero.tsx         # Blog page hero section
│   │   ├── BlogPostCard.tsx     # Blog post preview card
│   │   ├── BlogPostHeader.tsx   # Blog post header
│   │   ├── BlogPostList.tsx     # Blog post list container
│   │   └── BlogPostPage.tsx     # Individual blog post page
│   ├── markdown/                # Markdown processing components
│   │   ├── Markdown.tsx         # Main markdown renderer
│   │   ├── InlineContent.tsx    # Inline formatting component
│   │   ├── markdownProcessor.ts # Markdown parsing logic
│   │   └── elements/            # Individual markdown element components
│   │       ├── MarkdownHeading.tsx
│   │       ├── MarkdownCodeBlock.tsx
│   │       ├── MarkdownList.tsx
│   │       ├── MarkdownTable.tsx
│   │       └── ... (other elements)
│   ├── cards/                   # Card components
│   │   ├── ProjectCard.tsx      # Portfolio project card
│   │   └── ServiceCard.tsx      # Service offering card
│   ├── layout/                  # Layout components
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Header.tsx           # Site header
│   │   └── Navigation.tsx       # Navigation component
│   ├── sections/                # Page section components
│   │   ├── AboutSection.tsx     # About section
│   │   ├── CtaSection.tsx       # Call-to-action section
│   │   ├── ExperienceSection.tsx # Experience and skills section
│   │   ├── HeroSection.tsx      # Hero section
│   │   ├── PortfolioSection.tsx # Portfolio projects section
│   │   └── ServicesSection.tsx  # Services section
│   └── ui/                      # Base UI components (Shadcn/ui)
│       ├── Badge.tsx            # Badge component
│       ├── Button.tsx           # Button component
│       └── Card.tsx             # Card component
├── config/                      # Configuration and data files
│   ├── blog.ts                  # Blog post metadata
│   ├── experience.ts            # Experience and skills data
│   ├── portfolio.ts             # Portfolio projects data
│   └── services.ts              # Services data
├── content/                     # Content files
│   └── blog/                    # Markdown blog posts
│       ├── how-to-hire-your-first-developer.md
│       ├── how-to-use-ai-to-build-apps-10x-speed.md
│       └── nodejs-vs-python-framework-magic.md
├── lib/                         # Utility functions
│   ├── date.ts                  # Date formatting utilities
│   └── opengraphUtils.tsx       # Open Graph image generation utilities
├── public/                      # Static assets
├── test/                        # Test configuration
│   └── setup.ts                 # Test setup file
├── BRAND.md                     # Brand guidelines and identity
├── DEVELOPMENT_GUIDE.md         # Comprehensive development standards and testing guidelines
├── MARKDOWN.md                  # Markdown features and syntax documentation
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── vitest.config.ts             # Vitest configuration
└── eslint.config.js             # ESLint configuration
```

## 🎨 **Brand Identity**

This project follows the brand guidelines defined in `BRAND.md`:

### **Brand Personality**

- **Creator** - Innovative, imaginative, brings new ideas to life
- **Sage** - Wise, insightful, explains the "why" and "how"
- **Ruler** - Organized, authoritative, ensures stability and success

### **Color Palette**

- **Primary** - Dark Gray (#1F2937) - Authority, trust
- **Accent** - Warm Orange (#F59E0B) - Prestige, leadership
- **Action** - Electric Blue (#2563EB) - Innovation, interactivity

### **Key Messaging**

1. **Creation** - Turn visions into reality through innovative development
2. **Wisdom** - Deep understanding of business and technology
3. **Leadership** - Manage teams and complex projects effectively

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+
- pnpm (recommended) or npm

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/ch1ll0ut1/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### **Available Scripts**

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage

# Code Quality
pnpm lint             # Run ESLint
```

## 🧪 **Testing**

The project uses a comprehensive testing strategy:

### **Test Coverage**

- **Component Tests** - All React components have unit tests
- **Configuration Tests** - Data integrity tests for config files
- **Integration Tests** - End-to-end functionality testing

### **Testing Tools**

- **Vitest** - Fast, modern test runner
- **React Testing Library** - Component testing utilities
- **Jest DOM** - Custom DOM element matchers

### **Running Tests**

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### **Testing Strategy Overview**

| Test Type | Tool | Purpose | Scope |
|-----------|------|---------|-------|
| **Unit Tests** | Vitest + RTL | Component behavior, logic, accessibility | Individual components |
| **Integration** | Vitest | Component interaction, data flow | Multiple components |
| **End-to-end** | Manual/Future | User workflows, full application | Complete user journeys |

### **Component Testing Guidelines**

#### **Unit Tests Should Cover:**

- Component behavior and state changes
- Props handling and validation
- Accessibility (ARIA labels, keyboard navigation)
- Edge cases and error handling
- Integration with child components

#### **Visual Tests Should Cover:**

- Component appearance and styling
- Responsive design across breakpoints
- Design system consistency
- Visual states (hover, focus, disabled)
- Cross-browser compatibility

> 💡 **For detailed testing guidelines and examples**, see the comprehensive testing section in [`DEVELOPMENT_GUIDE.md`](./DEVELOPMENT_GUIDE.md#testing-strategy)

## 📝 **Content Management**

### **Blog Posts**

Blog posts are written in Markdown and stored in `content/blog/` with comprehensive syntax support including tables, quotes, code highlighting, and inline formatting.

> 📖 **For complete markdown syntax documentation and examples**, see [`MARKDOWN.md`](./MARKDOWN.md)

### **Configuration Files**

Content is managed through TypeScript configuration files:

- `config/blog.ts` - Blog post metadata
- `config/portfolio.ts` - Portfolio projects
- `config/services.ts` - Service offerings
- `config/experience.ts` - Experience and skills

## 🎯 **Development Standards**

This project follows the development standards outlined in `DEVELOPMENT_GUIDE.md`:

### **Core Principles**

- **YAGNI** - You Aren't Gonna Need It
- **KISS** - Keep It Simple, Stupid
- **Component-Based Architecture** - Clear separation of concerns
- **Modular Design** - Independent, testable modules

### **Code Organization**

- **Self-contained modules** - Components, tests, and utilities co-located
- **Single responsibility** - Each file has one clear purpose
- **Test-driven development** - Tests written before implementation
- **Type safety** - Full TypeScript coverage

### **File Naming**

- **PascalCase** for React components
- **camelCase** for utilities and functions
- **kebab-case** for directories and URLs

## 🔧 **Configuration**

### **TypeScript Configuration**

- Strict type checking enabled
- Path aliases configured (`@/` points to project root)
- Modern ES2022 target

### **ESLint Configuration**

- Stylistic rules for consistent code formatting
- Import rules for proper module organization
- React-specific rules for component best practices

### **Tailwind Configuration**

- Custom color palette matching brand guidelines
- Responsive design utilities
- Animation and transition classes

## 📊 **Performance & SEO**

### **Performance Optimizations**

- **Server-side rendering** for better SEO and performance
- **Image optimization** with Next.js Image component
- **Code splitting** for reduced bundle sizes
- **Static generation** where possible

### **SEO Features**

- **Dynamic Metadata**: Page-specific titles, descriptions, and keywords
- **Open Graph Images**: Auto-generated social media preview images
- **Structured Data**: JSON-LD schema markup for rich snippets
- **Sitemap Generation**: Dynamic XML sitemap with all pages and blog posts
- **Robots.txt**: Search engine crawling instructions
- **Canonical URLs**: Prevents duplicate content issues
- **Breadcrumb Navigation**: Improves user experience and SEO
- **Meta Tags**: Comprehensive meta tag optimization

### **Expected Lighthouse Scores**

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🤝 **Contributing**

This is a personal portfolio project, but contributions are welcome for:

- **Bug fixes** - Report issues and submit fixes
- **Documentation** - Improve README and code comments
- **Accessibility** - Enhance accessibility features
- **Performance** - Optimize loading times and user experience

### **Development Workflow**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

----

Built with ❤️ using Next.js, React, and TypeScript
