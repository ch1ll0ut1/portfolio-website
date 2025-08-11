import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, Github, Linkedin } from "lucide-react"
import Link from "next/link"

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Building Scalable React Applications: Lessons from 15 Years of Development",
      excerpt:
        "After leading dozens of React projects, I've learned what separates maintainable applications from technical debt nightmares. Here are the architectural patterns that actually work in production.",
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["React", "Architecture", "Best Practices"],
      slug: "scalable-react-applications",
    },
    {
      id: 2,
      title: "The CTO's Guide to AI Implementation: Beyond the Hype",
      excerpt:
        "Most AI initiatives fail not because of technology limitations, but due to poor strategic planning. Here's how to identify real AI opportunities and execute them successfully.",
      date: "2024-01-08",
      readTime: "12 min read",
      tags: ["AI", "Strategy", "Leadership"],
      slug: "cto-guide-ai-implementation",
    },
    {
      id: 3,
      title: "From Developer to Tech Lead: The Skills They Don't Teach You",
      excerpt:
        "Technical expertise got you promoted, but leadership requires a completely different skill set. Here's what I wish I knew when I made the transition.",
      date: "2024-01-01",
      readTime: "6 min read",
      tags: ["Leadership", "Career", "Management"],
      slug: "developer-to-tech-lead",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-primary">Stefan Knoch</div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <a href="/#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="/#portfolio" className="text-muted-foreground hover:text-primary transition-colors">
              Portfolio
            </a>
            <span className="text-action font-medium">Blog</span>
            <Button className="bg-action text-action-foreground hover:bg-action/90">Book Consultation</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Insights on Software Development & Tech Leadership
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Practical advice from 15+ years of building software, leading teams, and helping businesses navigate their
            technology challenges.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
                  <CardTitle className="text-2xl hover:text-action transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/blog/${post.slug}`}>Read Full Article</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-muted-foreground mb-4 md:mb-0">
              <p>&copy; 2024 Stefan Knoch. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/stefan-knoch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/stefan-knoch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
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
