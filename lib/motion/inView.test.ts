/**
 * Tests for arm-then-fire visibility.
 *
 * These cover the rule the whole design depends on: content that is already on
 * screen is never hidden and re-revealed, and an entrance fires at most once.
 *
 * Observers are looked up by their rootMargin rather than creation order, since
 * which one is built first is an implementation detail.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type FakeObserver, installIntersectionObserver, installMatchMedia, stubRect } from '../../test/motionEnv';
import { REDUCED_MOTION_QUERY } from './env';
import { observeInView } from './inView';
import { emitStage } from './stage';

describe('observeInView', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;
    let element: HTMLElement;

    const find = (marginFragment: string): FakeObserver | undefined => observers.instances.find(
        instance => String(instance.options?.rootMargin).includes(marginFragment),
    );
    /** The observer that puts an approaching element into its hidden pre-state. */
    const armObserver = () => find('45%');
    /** The observer that releases the entrance once the element truly enters. */
    const fireObserver = () => find('-12%');

    const offScreen = () => {
        stubRect(element, { top: 2000, bottom: 2200, height: 200 });
    };
    const onScreen = () => {
        stubRect(element, { top: 100, bottom: 300, height: 200 });
    };

    beforeEach(() => {
        window.innerHeight = 800;
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
        element.remove();
    });

    it('should arm before entry and fire on entry for an element below the fold', () => {
        const onArm = vi.fn();
        const onEnter = vi.fn();

        offScreen();
        observeInView(element, { onArm, onEnter });

        // Approaching: still off screen, so it is safe to hide.
        armObserver()?.emit(true);

        expect(onArm).toHaveBeenCalledTimes(1);
        expect(onEnter).not.toHaveBeenCalled();

        fireObserver()?.emit(true);

        expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('should never arm an element that is already on screen when the observer reacts', () => {
        const onArm = vi.fn();
        const onEnter = vi.fn();

        // Off screen at setup, so it takes the arm path...
        offScreen();
        observeInView(element, { onArm, onEnter });

        // ...but by the time the observer reacts it is already visible. Hiding it
        // now would make visible content disappear.
        onScreen();
        armObserver()?.emit(true);

        expect(onArm).not.toHaveBeenCalled();
        expect(onEnter).not.toHaveBeenCalled();
        expect(armObserver()?.disconnected).toBe(true);
    });

    it('should report an element that reached the screen before it could be armed', () => {
        const onSkip = vi.fn();

        offScreen();
        observeInView(element, { onSkip });

        expect(onSkip).not.toHaveBeenCalled();

        onScreen();
        armObserver()?.emit(true);

        expect(onSkip).toHaveBeenCalledTimes(1);
    });

    it('should not report an armed element as skipped', () => {
        const onSkip = vi.fn();

        offScreen();
        observeInView(element, { onSkip });
        armObserver()?.emit(true);
        onScreen();
        fireObserver()?.emit(true);

        expect(onSkip).not.toHaveBeenCalled();
    });

    it('should fire only once even if entry is reported repeatedly', () => {
        const onEnter = vi.fn();

        offScreen();
        observeInView(element, { onEnter });
        armObserver()?.emit(true);
        fireObserver()?.emit(true);
        fireObserver()?.emit(true);

        expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('should take the intro path for an element visible at setup', () => {
        const onArm = vi.fn();
        const onEnter = vi.fn();
        const onIntro = vi.fn();

        onScreen();
        observeInView(element, { onArm, onEnter, onIntro });

        // Nothing is observed at all: this element belongs to the page intro.
        expect(observers.instances).toHaveLength(0);
        expect(onIntro).not.toHaveBeenCalled();

        emitStage('intro');

        expect(onIntro).toHaveBeenCalledTimes(1);
        expect(onArm).not.toHaveBeenCalled();
        expect(onEnter).not.toHaveBeenCalled();
    });

    it('should enter straight away for an element visible at setup with no intro path', () => {
        const onArm = vi.fn();
        const onEnter = vi.fn();

        onScreen();
        observeInView(element, { onArm, onEnter });

        // Arming would be pointless and `onEnter` must not be skipped, so the
        // entrance runs at once and nothing is observed.
        expect(onEnter).toHaveBeenCalledTimes(1);
        expect(onArm).not.toHaveBeenCalled();
        expect(observers.instances).toHaveLength(0);
    });

    it('should fire immediately under reduced motion without observing', () => {
        const onArm = vi.fn();
        const onEnter = vi.fn();

        restoreMedia();
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
        offScreen();
        observeInView(element, { onArm, onEnter });

        expect(onEnter).toHaveBeenCalledTimes(1);
        expect(onArm).not.toHaveBeenCalled();
        expect(observers.instances).toHaveLength(0);
    });

    it('should prefer an explicit reduced-motion handler', () => {
        const onEnter = vi.fn();
        const onReduced = vi.fn();

        restoreMedia();
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
        offScreen();
        observeInView(element, { onEnter, onReduced });

        expect(onReduced).toHaveBeenCalledTimes(1);
        expect(onEnter).not.toHaveBeenCalled();
    });

    it('should stop observing both phases when cleaned up', () => {
        offScreen();

        const stop = observeInView(element, { onEnter: vi.fn() });

        stop();

        expect(armObserver()?.disconnected).toBe(true);
        expect(fireObserver()?.disconnected).toBe(true);
    });
});
