/**
 * Tests for when the custom cursor is allowed to replace the OS one.
 *
 * It must stand down for touch, reduced motion, forced colors, a request for
 * more contrast, and a visitor who switched it off.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, render } from '@testing-library/react';
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from '@/lib/motion';
import { installMatchMedia } from '../../test/motionEnv';
import { CaretCursor } from './CaretCursor';
import { setPreference } from './preferences';

const mount = (matching: string[]) => {
    restoreMedia = installMatchMedia(matching);

    return render(<CaretCursor overlayOpen={false} />);
};

let restoreMedia: (() => void) | null = null;

describe('<CaretCursor>', () => {
    beforeEach(() => {
        localStorage.clear();
        setPreference('caretCursor', true);
    });

    afterEach(() => {
        restoreMedia?.();
        restoreMedia = null;
    });

    it('should draw the cursor for a fine pointer', () => {
        const { container } = mount([FINE_POINTER_QUERY]);

        expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    });

    it('should leave the OS cursor alone on touch', () => {
        const { container } = mount([]);

        expect(container).toBeEmptyDOMElement();
    });

    it('should leave the OS cursor alone under reduced motion', () => {
        const { container } = mount([FINE_POINTER_QUERY, REDUCED_MOTION_QUERY]);

        expect(container).toBeEmptyDOMElement();
    });

    it('should leave the OS cursor alone in forced-colors mode', () => {
        const { container } = mount([FINE_POINTER_QUERY, '(forced-colors: active)']);

        expect(container).toBeEmptyDOMElement();
    });

    it('should leave the OS cursor alone when more contrast is requested', () => {
        const { container } = mount([FINE_POINTER_QUERY, '(prefers-contrast: more)']);

        expect(container).toBeEmptyDOMElement();
    });

    it('should go away, and give the page its cursor back, when switched off', () => {
        const { container } = mount([FINE_POINTER_QUERY]);

        act(() => {
            setPreference('caretCursor', false);
        });

        expect(container).toBeEmptyDOMElement();
        expect(document.documentElement.className).toBe('');
        expect(document.body.className).toBe('');
    });
});
