/**
 * Tests for filling a dictionary sentence's slots with the page's nodes.
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { fillSlots } from './fillSlots';

describe('fillSlots', () => {
    it('should put each node where its slot is', () => {
        // Act
        const html = renderToStaticMarkup(<p>{fillSlots('Write to {who} via {link}.', { who: 'me', link: <a href="/x">the form</a> })}</p>);

        // Assert
        expect(html).toBe('<p>Write to me via <a href="/x">the form</a>.</p>');
    });

    it('should write the same markup as JSX with a separate space before and after a slot', () => {
        // Arrange
        const handWritten = (
            <p>
                You can
                {' '}
                <a href="/x">write</a>
                {' '}
                instead.
            </p>
        );

        // Act
        const filled = <p>{fillSlots('You can {link} instead.', { link: <a href="/x">write</a> })}</p>;

        // Assert
        expect(renderToString(filled)).toBe(renderToString(handWritten));
    });

    it('should return the text alone when there is no slot', () => {
        expect(renderToStaticMarkup(<p>{fillSlots('Plain text.', {})}</p>)).toBe('<p>Plain text.</p>');
    });

    it('should leave a slot it has no node for as written', () => {
        expect(renderToStaticMarkup(<p>{fillSlots('Hello {name}', {})}</p>)).toBe('<p>Hello {name}</p>');
    });
});
