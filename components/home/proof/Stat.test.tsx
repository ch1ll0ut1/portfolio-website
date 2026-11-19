/**
 * Tests for a stat's odometer entrance.
 *
 * The rule: the reels only ever leave the final number while the stat is off
 * screen. It is armed onto its starting digits on the way in, and rolls once it
 * enters; at rest, under reduced motion, or with an entrance that never arms,
 * it reads the real value. Assistive technology reads the real value always.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';
import type { ProofStat } from '@/config/proof';
import { type FakeObserver, installIntersectionObserver, installMatchMedia } from '../../../test/motionEnv';
import { Stat } from './Stat';
import styles from './Proof.module.css';

const stat: ProofStat = { id: 'since', label: 'Shipping software since', value: '2008', from: '1990' };

const renderStat = () => {
    const { container } = render(<dl><Stat stat={stat} index={0} /></dl>);
    const root = container.querySelector('dl > div');

    if (!(root instanceof HTMLElement)) {
        throw new Error('stat not rendered');
    }

    return root;
};

describe('Stat', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    const find = (marginFragment: string): FakeObserver | undefined => observers.instances.find(
        instance => String(instance.options?.rootMargin).includes(marginFragment),
    );

    beforeEach(() => {
        window.innerHeight = 800;
        observers = installIntersectionObserver();
        // Below the fold, so the stat takes the arm-then-fire path.
        HTMLElement.prototype.getBoundingClientRect = () => ({
            top: 2000, bottom: 2200, left: 0, right: 300, width: 300, height: 200, x: 0, y: 2000, toJSON: () => ({}),
        });
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
        Reflect.deleteProperty(HTMLElement.prototype, 'getBoundingClientRect');
    });

    it('should rest on the final number until the stat approaches', () => {
        restoreMedia = installMatchMedia([]);
        const root = renderStat();

        expect(root).not.toHaveClass(styles.isArmed);
        expect(root).not.toHaveClass(styles.isIn);
    });

    it('should drop to the starting digits before it scrolls into view, then roll once it enters', () => {
        restoreMedia = installMatchMedia([]);
        const root = renderStat();

        act(() => {
            find('45%')?.emit(true);
        });

        // Still off screen: this is the moment the reels may change.
        expect(root).toHaveClass(styles.isArmed);
        expect(root).not.toHaveClass(styles.isIn);

        act(() => {
            find('-12%')?.emit(true);
        });

        expect(root).toHaveClass(styles.isIn);
    });

    it('should never leave the final number under reduced motion', () => {
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
        const root = renderStat();

        expect(observers.instances).toHaveLength(0);
        expect(root).not.toHaveClass(styles.isArmed);
        expect(root).not.toHaveClass(styles.isIn);
    });

    it('should give assistive technology the real value whatever the reels show', () => {
        restoreMedia = installMatchMedia([]);
        renderStat();

        act(() => {
            find('45%')?.emit(true);
        });

        expect(screen.getByText('2008')).toBeInTheDocument();
        expect(screen.getByText('Shipping software since')).toBeInTheDocument();
    });
});
