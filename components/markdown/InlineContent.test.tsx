/**
 * Tests for InlineContent component.
 * Tests rendering of parsed inline segments into JSX.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InlineContent } from './InlineContent';
import { type InlineSegment } from './parser/types';

describe('InlineContent Component', () => {
    it('should render plain text segments', () => {
        const segments: InlineSegment[] = [
            { text: 'Plain text without formatting' },
        ];

        render(<InlineContent segments={segments} />);

        expect(screen.getByText('Plain text without formatting')).toBeInTheDocument();
    });

    it('should render inline code as a code element', () => {
        const segments: InlineSegment[] = [
            { text: 'Keep a ' },
            { text: 'CLAUDE.md', isCode: true },
            { text: ' file nearby' },
        ];

        render(<InlineContent segments={segments} />);

        const code = screen.getByText('CLAUDE.md');
        expect(code.tagName).toBe('CODE');
    });

    it('should render bold text with proper styling', () => {
        const segments: InlineSegment[] = [
            { text: 'This is ' },
            { text: 'bold', isBold: true },
            { text: ' text' },
        ];

        render(<InlineContent segments={segments} />);

        const boldElement = screen.getByText('bold');
        expect(boldElement).toBeInTheDocument();
        expect(boldElement.tagName).toBe('STRONG');
    });

    it('should render italic text with proper styling', () => {
        const segments: InlineSegment[] = [
            { text: 'This is ' },
            { text: 'italic', isItalic: true },
            { text: ' text' },
        ];

        render(<InlineContent segments={segments} />);

        const italicElement = screen.getByText('italic');
        expect(italicElement).toBeInTheDocument();
        expect(italicElement.tagName).toBe('I');
    });

    it('should render links with proper attributes', () => {
        const segments: InlineSegment[] = [
            { text: 'Check ' },
            { text: 'this link', isLink: true, href: 'https://example.com' },
            { text: ' out' },
        ];

        render(<InlineContent segments={segments} />);

        const linkElement = screen.getByText('this link');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.tagName).toBe('A');
        expect(linkElement).toHaveAttribute('href', 'https://example.com');
        expect(linkElement).toHaveAttribute('target', '_blank');
        expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render mixed formatting correctly', () => {
        const segments: InlineSegment[] = [
            { text: 'Bold', isBold: true },
            { text: ' and ' },
            { text: 'italic', isItalic: true },
            { text: ' plus ' },
            { text: 'link', isLink: true, href: 'https://example.com' },
        ];

        const { container } = render(<InlineContent segments={segments} />);

        expect(screen.getByText('Bold').tagName).toBe('STRONG');
        expect(screen.getByText('italic').tagName).toBe('I');
        expect(screen.getByText('link')).toHaveAttribute('href', 'https://example.com');

        // Check that the full content is rendered
        expect(container.textContent).toContain('Bold and italic plus link');
    });

    it('should handle consecutive formatting', () => {
        const segments: InlineSegment[] = [
            { text: 'Bold', isBold: true },
            { text: 'italic', isItalic: true },
        ];

        render(<InlineContent segments={segments} />);

        expect(screen.getByText('Bold').tagName).toBe('STRONG');
        expect(screen.getByText('italic').tagName).toBe('I');
    });

    it('should handle multiple links', () => {
        const segments: InlineSegment[] = [
            { text: 'Visit ' },
            { text: 'Google', isLink: true, href: 'https://google.com' },
            { text: ' or ' },
            { text: 'GitHub', isLink: true, href: 'https://github.com' },
        ];

        render(<InlineContent segments={segments} />);

        const googleLink = screen.getByText('Google');
        const githubLink = screen.getByText('GitHub');

        expect(googleLink).toHaveAttribute('href', 'https://google.com');
        expect(githubLink).toHaveAttribute('href', 'https://github.com');
    });

    it('should handle plain text content', () => {
        const segments: InlineSegment[] = [
            { text: 'Test content' },
        ];

        const { container } = render(<InlineContent segments={segments} />);

        expect(container.textContent).toBe('Test content');
    });

    it('should render fragment without wrapper span', () => {
        const segments: InlineSegment[] = [
            { text: 'Test content' },
        ];

        const { container } = render(<InlineContent segments={segments} />);

        // Should not have any span wrapper
        const spanElement = container.querySelector('span');
        expect(spanElement).toBeNull();
        expect(container.textContent).toBe('Test content');
    });

    it('should handle empty segments array', () => {
        const segments: InlineSegment[] = [];

        const { container } = render(<InlineContent segments={segments} />);

        expect(container.textContent).toBe('');
    });

    it('should handle links without href gracefully', () => {
        const segments: InlineSegment[] = [
            { text: 'invalid link', isLink: true },
        ];

        render(<InlineContent segments={segments} />);

        // Should render as plain text when href is missing
        expect(screen.getByText('invalid link')).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should handle special characters in segments', () => {
        const segments: InlineSegment[] = [
            { text: 'Text with & special < characters >' },
        ];

        render(<InlineContent segments={segments} />);

        expect(screen.getByText('Text with & special < characters >')).toBeInTheDocument();
    });

    describe('link targets', () => {
        it('should open an off-site link in a new tab and say so', () => {
            render(<InlineContent segments={[{ text: 'Vitest', isLink: true, href: 'https://vitest.dev' }]} />);

            // Chromium names this "Vitest (opens in a new tab)". jsdom 30 gives
            // the hint its real `display: inline`, so dom-accessibility-api
            // trims the hint's own name and joins it without the space.
            const link = screen.getByRole('link', { name: /^Vitest ?\(opens in a new tab\)$/ });

            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });

        it('should keep a link to another page of this site in the same tab', () => {
            render(<InlineContent segments={[{ text: 'the blog', isLink: true, href: '/blog' }]} />);

            const link = screen.getByRole('link', { name: 'the blog' });

            expect(link).not.toHaveAttribute('target');
            expect(link).not.toHaveAttribute('rel');
        });

        it('should treat an absolute link to this site as internal', () => {
            render(<InlineContent segments={[{ text: 'privacy', isLink: true, href: 'https://www.stefanknoch.com/privacy' }]} />);

            expect(screen.getByRole('link', { name: 'privacy' })).not.toHaveAttribute('target');
        });

        it('should keep mail and in-page links in the same tab', () => {
            render(
                <InlineContent
                    segments={[
                        { text: 'mail', isLink: true, href: 'mailto:hello@example.com' },
                        { text: 'section', isLink: true, href: '#setup' },
                    ]}
                />,
            );

            expect(screen.getByRole('link', { name: 'mail' })).not.toHaveAttribute('target');
            expect(screen.getByRole('link', { name: 'section' })).not.toHaveAttribute('target');
        });
    });
});
