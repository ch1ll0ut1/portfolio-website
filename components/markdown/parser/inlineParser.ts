/**
 * Inline formatting: splits one line of text into segments for bold, italic,
 * links and inline code.
 *
 * Bold and italic hand their contents to a second pass that only resolves
 * links, so a link inside emphasis keeps both. Inline code is never formatted
 * further.
 */

import { type InlineSegment } from './types';

interface LinkSpan {
    start: number;
    end: number;
    text: string;
    href: string;
}

/**
 * Processes inline formatting (bold, italic, links, code) in text content.
 * Returns an array of text segments with formatting information.
 */
export function parseInline(content: string): InlineSegment[] {
    const segments: InlineSegment[] = [];
    let currentIndex = 0;
    const links = findLinks(content);
    let match;

    // Process all formatting including links.
    // Code comes last so the existing capture groups keep their numbers.
    const formatRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;

    while ((match = formatRegex.exec(content)) !== null) {
        // Add text before the match as plain text
        if (match.index > currentIndex) {
            const plainText = content.substring(currentIndex, match.index);
            if (plainText) {
                segments.push({ text: plainText });
            }
        }

        // Check if this is a link
        if (match[2] && match[3]) {
            // Link [text](url)
            segments.push({
                text: match[2],
                isLink: true,
                href: match[3],
            });
        }
        else if (match[4]) {
            // Bold text (**text**), which may contain links
            const innerSegments = parseLinksWithin(match[4], links, match.index + 2);
            segments.push(...innerSegments.map(seg => ({ ...seg, isBold: true })));
        }
        else if (match[5]) {
            // Italic text (*text*), which may contain links
            const innerSegments = parseLinksWithin(match[5], links, match.index + 1);
            segments.push(...innerSegments.map(seg => ({ ...seg, isItalic: true })));
        }
        else if (match[6]) {
            // Inline code (`text`) — never formatted further
            segments.push({ text: match[6], isCode: true });
        }

        currentIndex = match.index + match[0].length;
    }

    // Add remaining text as plain text
    if (currentIndex < content.length) {
        const remainingText = content.substring(currentIndex);
        if (remainingText) {
            segments.push({ text: remainingText });
        }
    }

    // If no formatting found, return the whole content as plain text
    if (segments.length === 0) {
        segments.push({ text: content });
    }

    return segments;
}

/** Every `[text](href)` in the line, with its position. */
function findLinks(content: string): LinkSpan[] {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links: LinkSpan[] = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
        const text = match[1];
        const href = match[2];
        if (text === undefined || href === undefined) {
            continue;
        }
        links.push({
            start: match.index,
            end: match.index + match[0].length,
            text,
            href,
        });
    }

    return links;
}

/**
 * Process formatting inside bold or italic text, checking for nested links
 */
function parseLinksWithin(content: string, links: LinkSpan[], contentOffset: number): InlineSegment[] {
    const segments: InlineSegment[] = [];
    let currentIndex = 0;

    // Find links that fall within this content
    const innerLinks = links.filter(link =>
        link.start >= contentOffset
        && link.end <= contentOffset + content.length,
    );

    if (innerLinks.length === 0) {
        // No links inside, return plain text
        return [{ text: content }];
    }

    // Process content with links
    for (const link of innerLinks) {
        const linkStartInContent = link.start - contentOffset;
        const linkEndInContent = link.end - contentOffset;

        // Add text before link
        if (linkStartInContent > currentIndex) {
            const plainText = content.substring(currentIndex, linkStartInContent);
            if (plainText) {
                segments.push({ text: plainText });
            }
        }

        // Add link
        segments.push({
            text: link.text,
            isLink: true,
            href: link.href,
        });

        currentIndex = linkEndInContent;
    }

    // Add remaining text
    if (currentIndex < content.length) {
        const remainingText = content.substring(currentIndex);
        if (remainingText) {
            segments.push({ text: remainingText });
        }
    }

    return segments;
}
