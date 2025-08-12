import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlogPostContent } from './BlogPostContent';

describe('BlogPostContent Component', () => {
    it('should render plain text content', () => {
        const content = 'This is a simple paragraph of text.';
        render(<BlogPostContent content={content} />);

        expect(screen.getByText('This is a simple paragraph of text.')).toBeInTheDocument();
    });

    it('should render multiple paragraphs', () => {
        const content = 'First paragraph.\n\nSecond paragraph.';
        render(<BlogPostContent content={content} />);

        expect(screen.getByText('First paragraph.')).toBeInTheDocument();
        expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
    });

    it('should render h2 headings', () => {
        const content = '## Test Heading\n\nSome content.';
        render(<BlogPostContent content={content} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Test Heading');
    });

    it('should render h3 headings', () => {
        const content = '### Test Subheading\n\nSome content.';
        render(<BlogPostContent content={content} />);

        const heading = screen.getByRole('heading', { level: 3 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Test Subheading');
    });

    it('should render h4 headings', () => {
        const content = '#### Test Sub-subheading\n\nSome content.';
        render(<BlogPostContent content={content} />);

        const heading = screen.getByRole('heading', { level: 4 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Test Sub-subheading');
    });

    it('should render code blocks with syntax highlighting', () => {
        const content = '```javascript\nconst test = "hello";\nconsole.log(test);\n```';
        render(<BlogPostContent content={content} />);

        const codeBlock = document.querySelector('pre');
        const codeElement = document.querySelector('code');
        expect(codeBlock).toBeInTheDocument();
        expect(codeElement).toHaveClass('language-javascript');
    });

    it('should render code blocks with default language', () => {
        const content = '```\nconst test = "hello";\n```';
        render(<BlogPostContent content={content} />);

        const codeBlock = document.querySelector('pre');
        expect(codeBlock).toBeInTheDocument();
    });

    it('should render unordered lists', () => {
        const content = '- First item\n- Second item\n- Third item';
        render(<BlogPostContent content={content} />);

        expect(screen.getByText('First item')).toBeInTheDocument();
        expect(screen.getByText('Second item')).toBeInTheDocument();
        expect(screen.getByText('Third item')).toBeInTheDocument();
    });

    it('should render mixed content', () => {
        const content = '## Main Heading\n\nSome text.\n\n- List item 1\n- List item 2\n\n```javascript\nconst code = "test";\n```';
        render(<BlogPostContent content={content} />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Main Heading');
        expect(screen.getByText('Some text.')).toBeInTheDocument();
        expect(screen.getByText('List item 1')).toBeInTheDocument();
        expect(screen.getByText('List item 2')).toBeInTheDocument();
        const codeBlock = document.querySelector('pre');
        expect(codeBlock).toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
        const content = 'Test content';
        render(<BlogPostContent content={content} className="custom-class" />);

        const container = screen.getByText('Test content').closest('div');
        expect(container).toHaveClass('custom-class');
    });

    it('should handle empty content', () => {
        render(<BlogPostContent content="" />);

        const container = document.querySelector('.prose');
        expect(container).toBeInTheDocument();
    });

    it('should handle whitespace-only content', () => {
        render(<BlogPostContent content="   \n\n   " />);

        const container = document.querySelector('.prose');
        expect(container).toBeInTheDocument();
    });

    it('should have proper prose styling', () => {
        const content = 'Test content';
        render(<BlogPostContent content={content} />);

        const container = screen.getByText('Test content').closest('div');
        expect(container).toHaveClass('prose', 'prose-lg', 'max-w-none');
    });
});
