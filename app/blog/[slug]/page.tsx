"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, Github, Linkedin } from "lucide-react"
import Link from "next/link"

// This would typically come from a CMS or database
const getBlogPost = (slug: string) => {
  const posts = {
    "scalable-react-applications": {
      title: "Building Scalable React Applications: Lessons from 15 Years of Development",
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["React", "Architecture", "Best Practices"],
      content: `
After leading dozens of React projects over the past 15 years, I've seen what separates maintainable applications from technical debt nightmares. The difference isn't in the frameworks or tools you choose—it's in the architectural decisions you make from day one.

## The Foundation: Component Architecture

The most critical decision in any React application is how you structure your components. I've learned that successful applications follow a clear hierarchy:

### 1. Atomic Design Principles

Start with atomic components—your buttons, inputs, and basic UI elements. These should be completely reusable and have no business logic.

\`\`\`tsx
// Good: Pure, reusable component
const Button = ({ variant, children, onClick, ...props }) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
\`\`\`

### 2. Composition Over Inheritance

React's composition model is powerful, but many developers don't leverage it fully. Instead of creating complex component hierarchies, compose smaller components together.

### 3. State Management Strategy

The biggest mistake I see is premature optimization with complex state management. Start with local state, move to context when you need it, and only reach for Redux or Zustand when you have genuine global state needs.

## Performance Patterns That Actually Matter

After profiling hundreds of React applications, these are the patterns that consistently improve performance:

### 1. Memoization Strategy
- Use React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable function references

### 2. Code Splitting
Implement route-based code splitting from the beginning. It's much harder to retrofit later.

### 3. Bundle Analysis
Set up bundle analysis in your CI/CD pipeline. Catching bundle bloat early saves months of optimization work later.

## The Testing Pyramid

Your testing strategy should follow this hierarchy:
1. **Unit tests** for business logic (70%)
2. **Integration tests** for component interactions (20%)
3. **E2E tests** for critical user flows (10%)

## Conclusion

Building scalable React applications isn't about using the latest libraries or following every trend. It's about making thoughtful architectural decisions, establishing clear patterns, and maintaining discipline as your codebase grows.

The applications that stand the test of time are those built with these principles from the start. Don't wait until you have technical debt to implement good practices—start with them.
      `,
    },
  }

  return posts[slug as keyof typeof posts] || null
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Post Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-slate-900">Stefan Knoch</div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-slate-900 transition-colors">
              Blog
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700">Book Consultation</Button>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Stefan Knoch
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            {post.content.split("\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-slate-900 mt-12 mb-6">
                    {paragraph.replace("## ", "")}
                  </h2>
                )
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                    {paragraph.replace("### ", "")}
                  </h3>
                )
              }
              if (paragraph.startsWith("```")) {
                return null // Skip code block markers for this example
              }
              if (paragraph.trim() === "") {
                return null
              }
              return (
                <p key={index} className="text-slate-600 leading-relaxed mb-6">
                  {paragraph}
                </p>
              )
            })}
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-slate-600 mb-4 md:mb-0">
              <p>&copy; 2024 Stefan Knoch. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/stefan-knoch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/stefan-knoch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
