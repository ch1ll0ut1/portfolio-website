/**
 * Advanced List Renderer with Block-Level Content Support
 *
 * Renders markdown lists with sophisticated nested content handling:
 * - Multiple content blocks per list item
 * - Block quotes with proper styling (border + italic)
 * - Empty line spacing preservation
 * - Proper hanging indentation for multi-line content
 *
 * Architecture:
 * - Uses flexbox layout for proper alignment
 * - Separates concerns with BlockRenderer component
 * - Handles both ordered (1. 2. 3.) and unordered (•) lists
 * - Maintains consistent spacing with Tailwind classes
 */

import React, { FC } from 'react';
import { type ListElement, type BlockSegment } from '../markdownProcessor';
import { InlineContent } from '../InlineContent';

interface Props {
    element: ListElement;
}

export const MarkdownList: FC<Props> = ({ element }) => {
    const ListTag = element.ordered ? 'ol' : 'ul';

    return (
        <ListTag className="space-y-2 my-4 text-muted-foreground">
            {element.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                    <span className="min-w-[1.5rem] mt-0.5 font-medium">
                        {element.ordered ? `${itemIndex + 1}.` : '•'}
                    </span>
                    <div className="flex-1 leading-relaxed space-y-1">
                        {item.map((block, blockIndex) => (
                            <BlockRenderer key={blockIndex} block={block} />
                        ))}
                    </div>
                </li>
            ))}
        </ListTag>
    );
};

/**
 * Renders individual content blocks within list items
 *
 * Block types:
 * - 'quote': Renders as styled blockquote with left border
 * - undefined: Regular paragraph content
 * - Empty blocks: Rendered as spacing div for visual separation
 *
 * Styling:
 * - Quotes: Left border, italic text, muted color
 * - Empty: Fixed height div for consistent spacing
 * - Regular: Standard inline content rendering
 */
const BlockRenderer: FC<{ block: BlockSegment }> = ({ block }) => {
    const isEmptyBlock = block.segments.length === 1 && block.segments[0]?.text === '';

    if (block.type === 'quote') {
        return (
            <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground">
                <InlineContent segments={block.segments} />
            </blockquote>
        );
    }

    if (isEmptyBlock) {
        return <div className="h-4" />;
    }

    return <InlineContent segments={block.segments} />;
};
