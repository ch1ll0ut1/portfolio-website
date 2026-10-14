/**
 * Tests for the shared toast.
 *
 * The live region is the only confirmation the command palette gives for its
 * preference toggles, so the ordering matters more than the visuals: a
 * region that is appended and populated in the same tick is drawn but never
 * announced, which is silent failure for a screen reader user.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { showToast } from './toast';

const nextFrame = () => new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
        resolve();
    });
});

const region = () => document.querySelector('[role="status"]');

describe('showToast', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should mount the live region before it has anything to say', () => {
        showToast('Custom cursor on');

        expect(region()).toBeInTheDocument();
        expect(region()?.textContent).toBe('');
    });

    it('should write the message only after the region is in the document', async () => {
        showToast('Custom cursor on');
        await nextFrame();

        expect(region()?.textContent).toBe('Custom cursor on');
    });

    it('should reveal the toast once it has text', async () => {
        showToast('Custom cursor on');
        await nextFrame();

        expect(region()?.classList.contains('is-on')).toBe(true);
    });

    it('should reuse the one region across messages', async () => {
        showToast('Custom cursor on');
        await nextFrame();
        showToast('Custom cursor off');
        await nextFrame();

        expect(document.querySelectorAll('[role="status"]')).toHaveLength(1);
        expect(region()?.textContent).toBe('Custom cursor off');
    });
});
