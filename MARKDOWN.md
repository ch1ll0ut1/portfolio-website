# Markdown Features Documentation

This document describes all supported markdown features in the portfolio website's custom markdown processor.

## Overview

The markdown processor is a custom implementation located in `components/markdown/` that converts markdown text into React components for consistent styling and behavior.

## Supported Features

### Headings

Support for all 6 heading levels with automatic styling:

```markdown
# Heading 1
## Heading 2  
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

**Rendering:**
- H1: Renders as `<h4>` with large font and spacing
- H2: Renders as `<h2>` with bold styling and large margins
- H3: Renders as `<h3>` with medium styling
- H4-H6: Render as `<h4>` with standard styling

### Paragraphs

Plain text paragraphs with automatic formatting detection:

```markdown
This is a regular paragraph.

This paragraph has **bold** and *italic* text.

This paragraph contains [a link](https://example.com).
```

### Inline Formatting

#### Bold Text
```markdown
**bold text** or __bold text__
```

#### Italic Text
```markdown
*italic text* or _italic text_
```

#### Links
```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Optional title")
```

**Features:**
- Automatic `target="_blank"` and `rel="noopener noreferrer"` for external links
- Hover effects and styling
- Accessible link formatting

### Code Blocks

Syntax-highlighted code blocks with language support:

````markdown
```javascript
const example = "Hello, world!";
console.log(example);
```

```typescript
interface User {
    name: string;
    email: string;
}
```

```python
def hello_world():
    print("Hello, world!")
```
````

**Features:**
- Syntax highlighting via `react-syntax-highlighter`
- Line numbers
- Dark theme styling
- Support for 100+ languages
- Fallback to 'javascript' if no language specified

### Lists

Unordered lists with inline formatting support:

```markdown
- First item
- Second item with **bold text**
- Third item with [a link](https://example.com)
- Fourth item with *italic text*
```

**Features:**
- Supports nested formatting within list items
- Consistent spacing and styling
- Bullet point styling

### Tables

Full table support with headers and formatting:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| **Bold** | *Italic* | [Link](https://example.com) |
| Row 3    | Row 3    | Row 3    |
```

**Features:**
- Header row with distinct styling
- Bordered cells with padding
- Hover effects on rows
- Responsive design with horizontal scrolling
- Inline formatting support in cells
- Automatic column alignment

**Table Syntax Rules:**
- First row becomes the header
- Second row must be separator (pipes and dashes)
- Subsequent rows become table data
- All rows must have the same number of columns

### Blockquotes

Quote blocks with formatting support:

```markdown
> This is a simple quote.

> This quote has **bold text** and *italic text*.
> It can span multiple lines.

> Quote with [a link](https://example.com) inside.
```

**Features:**
- Left border styling
- Italic text formatting
- Support for inline formatting within quotes
- Multi-line quote support

### Images

SEO-optimized images with alt text and automatic optimization:

```markdown
![Alt text description](image-filename.jpg)
![Cover image for blog post](crypto-trading-cover.jpg)
![Chart showing results](/custom/path/chart.png)
```

**Features:**
- Next.js Image component with automatic optimization
- Lazy loading for improved performance
- Responsive sizing with srcset generation
- WebP format conversion when supported
- Alt text displayed as caption below image
- Automatic path resolution for blog images

**File Organization:**
- Store images in `public/images/blog/` directory
- Relative paths like `image.jpg` resolve to `/images/blog/image.jpg`
- Absolute paths like `/custom/path/image.png` remain unchanged
- Supports all common formats (JPG, PNG, WebP, AVIF)

**SEO Benefits:**
- Proper alt attributes for screen readers and search engines
- Optimized file sizes and formats
- Lazy loading reduces initial page load time
- Responsive images adapt to device screen sizes

### Horizontal Rules

Section separators:

```markdown
---
```

Creates a horizontal rule for separating content sections.

## Advanced Features

### Mixed Formatting

All formatting types can be combined:

```markdown
This paragraph has **bold**, *italic*, and [link](https://example.com) text.

- List item with **bold** and [link](https://example.com)
- Another item with *italic* text

| Header | **Bold Header** |
|--------|-----------------|
| Cell   | *Italic cell*   |
| Link   | [Example](https://example.com) |

> Quote with **bold** and [link](https://example.com) text.
```

### Content Structure

Markdown content can include any combination of supported elements:

```markdown
# Blog Post Title

This is the introduction paragraph with some **important** information.

![Blog post cover image](cover-image.jpg)

## Key Points

Here are the main topics:

- Point one with *emphasis*
- Point two with [additional resources](https://example.com)
- Point three

## Code Example

Here's how to implement this:

```javascript
function example() {
    return "Hello, world!";
}
```

![Code example visualization](code-example.png)

## Comparison Table

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headings | ✅ | All 6 levels |
| Tables | ✅ | Full support |
| Code | ✅ | Syntax highlighting |
| Images | ✅ | SEO optimized |

---

That concludes our overview.
```

## Technical Implementation

### Component Architecture

The markdown system is built with modular React components:

- `Markdown` - Main component that processes content and renders elements
- `InlineContent` - Handles bold, italic, and link formatting
- `MarkdownHeading` - Renders heading elements
- `MarkdownCodeBlock` - Handles syntax highlighting
- `MarkdownList` - Renders list items with formatting
- `MarkdownTable` - Renders tables with responsive design
- `MarkdownQuote` - Renders blockquotes
- `MarkdownParagraph` - Renders paragraphs
- `MarkdownSeparator` - Renders horizontal rules
- `MarkdownImage` - Renders optimized images with Next.js Image component

### Usage

```typescript
import { Markdown } from '@/components/markdown/Markdown';

function BlogPost({ content }: { content: string }) {
    return <Markdown content={content} className="custom-styling" />;
}
```

### Styling

All components use Tailwind CSS classes and follow the site's design system:
- Primary colors for headings and important text
- Muted colors for body text
- Action colors for interactive elements (links)
- Consistent spacing and typography

## Content Guidelines

### Best Practices

1. **Use semantic heading structure** - Start with H2 for main sections (H1 is handled by page titles)
2. **Keep table columns manageable** - Tables become scrollable on mobile
3. **Use descriptive link text** - Avoid "click here" or "read more"
4. **Test code blocks** - Ensure syntax highlighting works for your language
5. **Break up long content** - Use headings, lists, and tables to improve readability
6. **Write meaningful alt text** - Describe the image content, not just the filename
7. **Optimize image sizes** - Use appropriate dimensions (800px width recommended)
8. **Choose descriptive filenames** - Use `crypto-trading-basics.jpg` not `image1.jpg`

### Accessibility

The markdown processor ensures:
- Proper heading hierarchy for screen readers
- Descriptive link text and attributes
- Semantic HTML structure
- Keyboard navigation support
- Color contrast compliance
- Meaningful alt text for images and screen reader compatibility

### Performance

- Code highlighting is optimized with bundle splitting
- Tables are responsive and don't break layouts
- Images are optimized with Next.js Image component (lazy loading, responsive sizes, format conversion)
- Static generation for improved loading times