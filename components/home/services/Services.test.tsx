/**
 * Tests for the services section.
 */

import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { engagementNote, engagements, engagementsHeading } from '@/config/engagements';
import { itemAt } from '@/test/itemAt';
import { installIntersectionObserver, installMatchMedia, settleIntro } from '../../../test/motionEnv';
import { Services } from './Services';
import styles from './Services.module.css';

/** The motion kit waits on web fonts, which jsdom does not implement. */
const stubFonts = () => {
    Object.defineProperty(document, 'fonts', {
        value: { ready: new Promise(() => undefined) },
        configurable: true,
        writable: true,
    });
};

const noteParagraph = () => {
    const paragraph = document.querySelector('[data-note="services"]');

    if (!(paragraph instanceof HTMLElement)) {
        throw new Error('No closing paragraph rendered');
    }

    return paragraph;
};

const cardFor = (id: string) => {
    const card = document.querySelector(`[data-engagement="${id}"]`);

    if (!(card instanceof HTMLElement)) {
        throw new Error(`No card rendered for engagement "${id}"`);
    }

    return card;
};

/** Text a screen reader would read: everything not hidden from it. */
const accessibleText = (element: Element) => Array.from(element.childNodes)
    .filter(node => !(node instanceof Element) || node.getAttribute('aria-hidden') !== 'true')
    .map(node => node.textContent)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

describe('Services', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    beforeEach(() => {
        stubFonts();
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);
    });

    // The fonts above never settle, so the intro waits on its failsafe timer.
    afterAll(settleIntro);

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should render a labelled section anchored at the services id', () => {
        // Act
        const { container } = render(<Services />);

        // Assert
        expect(screen.getByRole('region', { name: new RegExp(engagementsHeading.title, 'i') })).toBeInTheDocument();
        expect(container.querySelector('#services')).toBeInTheDocument();
    });

    it('should render every engagement with its bullets and format line', () => {
        // Act
        render(<Services />);

        // Assert
        engagements.forEach((engagement) => {
            const card = cardFor(engagement.id);

            expect(within(card).getByRole('heading', { level: 3 })).toHaveTextContent(engagement.name);
            expect(within(card).getByText(engagement.who)).toBeInTheDocument();

            engagement.bullets.forEach((bullet) => {
                expect(within(card).getByText(bullet)).toBeInTheDocument();
            });

            expect(card.textContent).toContain(engagement.format);
        });
    });

    it('should render one card per engagement', () => {
        // Act
        render(<Services />);

        // Assert
        expect(screen.getAllByRole('article')).toHaveLength(engagements.length);
    });

    it('should name every card after its engagement', () => {
        // Act
        render(<Services />);

        // Assert
        engagements.forEach((engagement) => {
            expect(screen.getByRole('article', { name: new RegExp(engagement.name, 'i') })).toBeInTheDocument();
        });
    });

    it('should mark the featured engagement for assistive technology', () => {
        // Act
        render(<Services />);
        const featured = engagements.filter(engagement => engagement.featured);
        const marked = screen.getAllByText(/featured/i);

        // Assert
        expect(marked).toHaveLength(featured.length);
        expect(cardFor(itemAt(featured, 0).id)).toContainElement(itemAt(marked, 0));
    });

    it('should expose the closing paragraph as ordinary text', () => {
        // Arrange
        const expected = engagementNote.map(segment => segment.text).join(' ');

        // Act
        render(<Services />);
        const paragraph = noteParagraph();

        // Assert
        expect(accessibleText(paragraph)).toBe(expected);
    });

    it('should keep the closing paragraph readable with the typing decoration hidden', () => {
        // Act
        render(<Services />);
        const paragraph = noteParagraph();
        const decorations = paragraph.querySelectorAll('[aria-hidden="true"]');

        // Assert
        expect(decorations.length).toBeGreaterThan(0);
        decorations.forEach((decoration) => {
            expect(decoration.textContent).toBe('');
        });
    });

    it('should leave a card already on screen at load at rest, its border untraced', async () => {
        // Arrange: everything on screen, and an animate() to watch, which jsdom lacks.
        const animate = vi.fn(() => ({ finished: new Promise(() => undefined), cancel: () => undefined }));
        const rect = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
            DOMRect.fromRect({ x: 0, y: 100, width: 300, height: 200 }),
        );

        Object.defineProperty(Element.prototype, 'animate', { value: animate, configurable: true, writable: true });

        try {
            // Act
            render(<Services />);
            await settleIntro();

            // Assert
            const featured = engagements.find(engagement => engagement.featured);
            const card = cardFor(featured?.id ?? '');
            const trace = card.querySelector(`.${styles.trace}`);

            expect(trace).toBeInTheDocument();
            expect(card).not.toHaveClass(styles.isArmed);
            expect(card).not.toHaveClass(styles.isIn);
            expect(animate.mock.contexts).not.toContain(trace);
        }
        finally {
            rect.mockRestore();
            Reflect.deleteProperty(Element.prototype, 'animate');
        }
    });
});
