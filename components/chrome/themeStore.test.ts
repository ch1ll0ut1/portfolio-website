/**
 * Tests for the theme singleton.
 *
 * The interesting case is precedence: the tokens let the OS preference decide
 * only while the user has made no choice, and this store has to agree with
 * that rule — otherwise the toggle would appear to do nothing for a user whose
 * OS already prefers the theme they just picked.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onStage } from '@/lib/motion';
import { installMatchMedia } from '../../test/motionEnv';
import { readTheme, setTheme, toggleTheme } from './themeStore';

const LIGHT_QUERY = '(prefers-color-scheme: light)';

describe('themeStore', () => {
    let restoreMedia: () => void;

    beforeEach(() => {
        delete document.documentElement.dataset.theme;
        localStorage.clear();
        restoreMedia = installMatchMedia();
    });

    afterEach(() => {
        restoreMedia();
    });

    describe('readTheme', () => {
        it('should fall back to dark when nothing is stored and the OS prefers dark', () => {
            expect(readTheme()).toBe('dark');
        });

        it('should fall back to light when nothing is stored and the OS prefers light', () => {
            restoreMedia();
            restoreMedia = installMatchMedia([LIGHT_QUERY]);

            expect(readTheme()).toBe('light');
        });

        it('should prefer an explicit choice over the OS preference', () => {
            restoreMedia();
            restoreMedia = installMatchMedia([LIGHT_QUERY]);
            document.documentElement.dataset.theme = 'dark';

            expect(readTheme()).toBe('dark');
        });

        it('should ignore an unrecognised attribute value', () => {
            document.documentElement.dataset.theme = 'sepia';

            expect(readTheme()).toBe('dark');
        });
    });

    describe('setTheme', () => {
        it('should apply the theme to the document', () => {
            setTheme('light');

            expect(document.documentElement.dataset.theme).toBe('light');
        });

        it('should persist the theme under the key the boot script reads', () => {
            setTheme('light');

            expect(localStorage.getItem('sk-theme')).toBe('light');
        });

        // The one broadcast: anything caching a theme-dependent value repaints off this.
        it('should announce the change on the theme stage event', () => {
            const listener = vi.fn();
            const stop = onStage('theme', listener);

            setTheme('light');
            stop();

            expect(listener).toHaveBeenCalledTimes(1);
        });
    });

    describe('toggleTheme', () => {
        it('should flip an explicit dark choice to light', () => {
            document.documentElement.dataset.theme = 'dark';
            toggleTheme();

            expect(document.documentElement.dataset.theme).toBe('light');
        });

        it('should flip back to dark on a second press', () => {
            toggleTheme();
            toggleTheme();

            expect(document.documentElement.dataset.theme).toBe('dark');
        });

        it('should turn an unexpressed light OS preference into an explicit dark choice', () => {
            restoreMedia();
            restoreMedia = installMatchMedia([LIGHT_QUERY]);

            toggleTheme();

            expect(document.documentElement.dataset.theme).toBe('dark');
            expect(localStorage.getItem('sk-theme')).toBe('dark');
        });
    });
});
