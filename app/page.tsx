import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Users, Lightbulb, Shield, Zap, Settings, ExternalLink, Github, Linkedin } from "lucide-react"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-slate-900">Stefan Knoch</div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
              About
            </a>
            <a href="#services" className="text-slate-600 hover:text-slate-900 transition-colors">
              Services
            </a>
            <a href="#portfolio" className="text-slate-600 hover:text-slate-900 transition-colors">
              Portfolio
            </a>
            <a href="#experience" className="text-slate-600 hover:text-slate-900 transition-colors">
              Experience
            </a>
            <a href="/blog" className="text-slate-600 hover:text-slate-900 transition-colors">
              Blog
            </a>
            <Button className="bg-blue-600 hover:bg-blue-700">Book Consultation</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            From Idea to Impact —<br />
            <span className="text-blue-600">I Help Businesses Build, Lead, and Deliver Great Software</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            I'm Stefan Knoch — a software developer, project manager, and technology consultant. I help companies create
            world-class apps, assemble high-performing teams, and design strategies that make technology work for the
            business — not the other way around.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Book a Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent" asChild>
              <a href="https://linkedin.com/in/stefan-knoch" target="_blank" rel="noopener noreferrer">
                View My LinkedIn CV
                <Linkedin className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">About Me</h2>
          <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed">
            <p className="text-xl mb-6">
              I've spent my career working across the full spectrum of software delivery — from hands-on coding to
              leading teams and shaping the entire technology function of a company. I bridge the gap between technical
              detail and business goals, ensuring projects are delivered on time, on budget, and with measurable
              results.
            </p>
            <p className="text-lg mb-6">What sets me apart is the range I bring:</p>
            <ul className="text-lg space-y-2 mb-8">
              <li>• I can build and deploy an app myself.</li>
              <li>• I can recruit and manage an entire product team.</li>
              <li>• I can step into a leadership role to define your long-term technology roadmap.</li>
            </ul>
            <p className="text-lg">
              Whether you need a project delivered end-to-end or strategic guidance for your tech department, I bring
              both the technical depth and the leadership experience to make it happen.
            </p>
          </div>
          <div className="text-center mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Let's talk about your project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center">Services</h2>
          <p className="text-xl text-slate-600 mb-12 text-center max-w-3xl mx-auto">
            I help businesses turn ideas into working products, define their tech strategy, and keep their systems
            running smoothly. Depending on the scope, I either deliver the work myself or assemble and lead the right
            team to get it done.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Full App Development</CardTitle>
                <CardDescription>
                  I build mobile and web applications from the ground up — and I can manage the entire delivery process
                  from concept to launch.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Requirements gathering & specifications</li>
                  <li>• Architecture design & tech stack selection</li>
                  <li>• UI/UX design coordination</li>
                  <li>• Development team leadership</li>
                  <li>• Testing, deployment & support</li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Team Assembly & Leadership</CardTitle>
                <CardDescription>
                  For larger projects, I can recruit and lead an entire product team, including developers, designers,
                  and specialists.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Project managers & UX/UI designers</li>
                  <li>• Frontend & backend developers</li>
                  <li>• DevOps engineers & QA testers</li>
                  <li>• Data scientists & AI specialists</li>
                  <li>• Process setup & progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Technology Strategy</CardTitle>
                <CardDescription>
                  I work with business leaders to shape their entire technology function with CTO-level insight.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• System & workflow reviews</li>
                  <li>• Technology roadmap creation</li>
                  <li>• Tool & process recommendations</li>
                  <li>• Hiring plans & organizational design</li>
                  <li>• Digital transformation leadership</li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 4 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">AI Consulting & Coaching</CardTitle>
                <CardDescription>
                  I help businesses identify where AI can create real value and guide them through implementation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• AI opportunity identification</li>
                  <li>• Custom AI solution design</li>
                  <li>• Team training on AI tools</li>
                  <li>• Ethical use & privacy compliance</li>
                  <li>• Implementation guidance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 5 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Deployment & Maintenance</CardTitle>
                <CardDescription>
                  I keep digital products reliable, secure, and up-to-date with comprehensive technical support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Hosting setup & CI/CD pipelines</li>
                  <li>• Security hardening & compliance</li>
                  <li>• Performance optimization</li>
                  <li>• Regular updates & support</li>
                  <li>• GDPR, HIPAA compliance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 6 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle className="text-xl">System Integration & Automation</CardTitle>
                <CardDescription>
                  I connect software tools, automate repetitive work, and ensure data flows where it's needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• CRM, ERP, analytics integration</li>
                  <li>• Workflow automation</li>
                  <li>• API implementation</li>
                  <li>• Cross-platform communication</li>
                  <li>• Manual process elimination</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center">Portfolio</h2>
          <p className="text-xl text-slate-600 mb-12 text-center max-w-3xl mx-auto">
            A selection of projects that showcase my expertise in full-stack development, team leadership, and
            technology strategy.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">E-Commerce Platform</CardTitle>
                <CardDescription>
                  Led a team of 8 developers to build a scalable e-commerce platform handling 100k+ daily transactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">PostgreSQL</Badge>
                  <Badge variant="secondary">AWS</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View Case Study
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Project 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">AI-Powered Analytics Dashboard</CardTitle>
                <CardDescription>
                  Built an intelligent analytics platform that reduced manual reporting time by 80% for a Fortune 500
                  company.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">TensorFlow</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Azure</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View Case Study
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Project 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Healthcare Management System</CardTitle>
                <CardDescription>
                  Designed and implemented a HIPAA-compliant patient management system for a network of medical
                  practices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">C#/.NET</Badge>
                  <Badge variant="secondary">Angular</Badge>
                  <Badge variant="secondary">SQL Server</Badge>
                  <Badge variant="secondary">HIPAA</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View Case Study
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience & Skills */}
      <section id="experience" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Experience & Expertise</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">Technical Skills</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Languages & Frameworks</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">JavaScript/TypeScript</Badge>
                    <Badge variant="secondary">React/Next.js</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">Python</Badge>
                    <Badge variant="secondary">Java</Badge>
                    <Badge variant="secondary">C#/.NET</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Cloud & DevOps</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">AWS</Badge>
                    <Badge variant="secondary">Azure</Badge>
                    <Badge variant="secondary">Docker</Badge>
                    <Badge variant="secondary">Kubernetes</Badge>
                    <Badge variant="secondary">CI/CD</Badge>
                    <Badge variant="secondary">Terraform</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Databases</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">PostgreSQL</Badge>
                    <Badge variant="secondary">MongoDB</Badge>
                    <Badge variant="secondary">Redis</Badge>
                    <Badge variant="secondary">MySQL</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">Leadership & Management</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-slate-900">15+ Years Experience</h4>
                    <p className="text-slate-600">Full-stack development and technical leadership</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-slate-900">Team Leadership</h4>
                    <p className="text-slate-600">Led teams of 5-20 developers and designers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-slate-900">Project Management</h4>
                    <p className="text-slate-600">Agile, Scrum, and custom delivery methodologies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-slate-900">Strategic Planning</h4>
                    <p className="text-slate-600">Technology roadmaps and digital transformation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Let's Talk</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            If you need a hands-on developer, a project leader, or a strategic tech partner, I can help you plan, build,
            and deliver the right solution — on time and to the highest standard.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
            Book a Free Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

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
