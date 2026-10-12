/**
 * Tests for the closing paragraph of the services section.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { engagementNote } from '@/config/engagements';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';
import { installIntersectionObserver, installMatchMedia } from '../../../test/motionEnv';
import { TypedParagraph } from './TypedParagraph';
import styles from './Services.module.css';

const stubFonts = () => {
    Object.defineProperty(document, 'fonts', {
        value: { ready: new Promise(() => undefined) },
        configurable: true,
        writable: true,
    });
};

const fullText = engagementNote.map(segment => segment.text).join(' ');

const noteParagraph = (container: HTMLElement) => {
    const paragraph = container.querySelector('[data-note="services"]');

    if (!(paragraph instanceof HTMLElement)) {
        throw new Error('No closing paragraph rendered');
    }

    return paragraph;
};

const readableText = (paragraph: HTMLElement) => paragraph.textContent.replace(/\s+/g, ' ').trim();

describe('TypedParagraph', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    beforeEach(() => {
        stubFonts();
        observers = installIntersectionObserver();
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should render every word of the paragraph as text', () => {
        // Arrange
        restoreMedia = installMatchMedia([]);

        // Act
        const { container } = render(<TypedParagraph />);

        // Assert
        expect(readableText(noteParagraph(container))).toBe(fullText);
    });

    it('should mark the selected phrase so it can be highlighted', () => {
        // Arrange
        restoreMedia = installMatchMedia([]);
        const selected = engagementNote.filter(segment => segment.selected);
        const expectedWords = selected.flatMap(segment => segment.text.split(' '));

        // Act
        const { container } = render(<TypedParagraph />);
        const marked = container.querySelectorAll(`.${styles.selected}`);

        // Assert
        expect(Array.from(marked).map(word => word.textContent)).toEqual(expectedWords);
    });

    it('should skip the typing and show the finished state under reduced motion', () => {
        // Arrange
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);

        // Act
        const { container } = render(<TypedParagraph />);
        const paragraph = noteParagraph(container);

        // Assert
        expect(paragraph).toHaveClass(styles.isSelected);
        expect(paragraph).not.toHaveClass(styles.isWriting);
        expect(readableText(paragraph)).toBe(fullText);
    });
});
