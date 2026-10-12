/**
 * Tests for the proof marquee.
 *
 * Behaviour and accessibility only: the loop's motion is verified in the browser,
 * not here.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { installIntersectionObserver, installMatchMedia } from '../../../test/motionEnv';
import { Marquee } from './Marquee';

/** The motion kit waits on web fonts, which jsdom does not implement. */
const stubFonts = () => {
    Object.defineProperty(document, 'fonts', {
        value: { ready: new Promise(() => undefined) },
        configurable: true,
        writable: true,
    });
};

describe('Marquee', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    const names = ['Parliament of Iceland', 'Agoda', 'Eko'];

    beforeEach(() => {
        stubFonts();
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should expose every name exactly once to assistive technology', () => {
        // Act
        render(<Marquee names={names} />);
        const items = screen.getAllByRole('listitem');

        // Assert
        expect(items.map(item => item.textContent)).toEqual(names);
    });

    it('should duplicate the row for the loop and hide the copy', () => {
        // Act
        const { container } = render(<Marquee names={names} />);
        const rendered = container.querySelectorAll('li');
        const hidden = container.querySelectorAll('li[aria-hidden="true"]');

        // Assert
        expect(rendered).toHaveLength(names.length * 2);
        expect(hidden).toHaveLength(names.length);
    });

    it('should keep the names as text so the row reads without motion', () => {
        // Act
        const { container } = render(<Marquee names={names} />);
        const track = container.querySelector('ul');

        // Assert
        names.forEach((name) => {
            expect(track).toHaveTextContent(name);
        });
    });

    it('should render nothing extra for an empty list', () => {
        // Act
        const { container } = render(<Marquee names={[]} />);

        // Assert
        expect(container.querySelectorAll('li')).toHaveLength(0);
    });
});
