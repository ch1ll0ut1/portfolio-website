/**
 * Tests for when a case illustration is built and when it runs.
 *
 * The illustration has to be there before its panel is seen, so it is built a
 * viewport ahead; but its clock must still only run while the panel is
 * actually on screen. The two are separate observers, told apart here by
 * their options: the approach one has a root margin, the on-screen one a
 * visibility threshold.
 */

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';
import { REDUCED_MOTION_QUERY, tickerCount } from '@/lib/motion';
import { whenIdle } from '@/lib/whenIdle';
import { type FakeObserver, installIntersectionObserver, installMatchMedia } from '../../../../test/motionEnv';
import { CaseVisual } from './CaseVisual';
import styles from './CaseVisual.module.css';

vi.mock('@/lib/whenIdle', () => ({ whenIdle: vi.fn(() => () => undefined) }));

const metric = { value: '4×', label: 'faster' };

describe('<CaseVisual>', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    /*
     * The build still goes through the component's dynamic import, but the
     * module is loaded here first: cold, it can take longer than `waitFor`'s
     * 1 s on a busy machine, and from the module cache it lands in a few ticks.
     */
    beforeAll(async () => {
        await import('./edithing');
    }, 30_000);

    beforeEach(() => {
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia();
        vi.mocked(whenIdle).mockClear();
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    /** The illustration's observers watch its host; the metric's reveal has its own. */
    const observer = (pick: (options: IntersectionObserverInit) => boolean): FakeObserver => {
        const found = observers.instances.find(instance => (
            instance.element?.getAttribute('aria-hidden') === 'true'
            && instance.options !== undefined
            && pick(instance.options)
        ));

        if (!found) {
            throw new Error('observer not created');
        }

        return found;
    };

    const approach = () => observer(options => options.rootMargin !== undefined);
    const onScreen = () => observer(options => options.threshold !== undefined);

    const renderVisual = () => {
        const view = render(<CaseVisual id="edithing" metric={metric} covered={false} />);
        const host = view.container.querySelector('[aria-hidden="true"]');

        if (!(host instanceof HTMLElement)) {
            throw new Error('host not rendered');
        }

        const stage = () => host.firstElementChild;

        return { ...view, stage };
    };

    /** Brings the panel within a viewport of the screen, and waits for the build. */
    const approachAndBuild = async (stage: () => Element | null) => {
        act(() => {
            approach().emit(true);
        });

        await waitFor(() => {
            expect(stage()?.childElementCount).toBeGreaterThan(0);
        });
    };

    it('should look a full viewport ahead for its panel', () => {
        renderVisual();

        expect(approach().options?.rootMargin).toBe('100% 0px');
    });

    it('should not build the illustration while its panel is far away', async () => {
        const { stage } = renderVisual();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 20));
        });

        expect(stage()?.childElementCount).toBe(0);
    });

    it('should build the illustration before any of its panel is on screen', async () => {
        const { stage } = renderVisual();

        await approachAndBuild(stage);

        expect(onScreen().element).not.toBeNull();
    });

    it('should stop watching for the approach once it has built', async () => {
        const { stage } = renderVisual();

        await approachAndBuild(stage);

        expect(approach().disconnected).toBe(true);
    });

    it('should fade the illustration in once it is built', async () => {
        const { stage } = renderVisual();

        expect(stage()).not.toHaveClass(styles.built);

        await approachAndBuild(stage);

        await waitFor(() => {
            expect(stage()).toHaveClass(styles.built);
        });
    });

    it('should keep a built illustration paused until its panel is on screen', async () => {
        const before = tickerCount();
        const { stage, unmount } = renderVisual();

        await approachAndBuild(stage);
        expect(tickerCount()).toBe(before);

        act(() => {
            onScreen().emit(true);
        });
        expect(tickerCount()).toBe(before + 1);

        act(() => {
            onScreen().emit(false);
        });
        expect(tickerCount()).toBe(before);
        unmount();
    });

    it('should never start the clock under reduced motion', async () => {
        restoreMedia();
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);

        const before = tickerCount();
        const { stage } = renderVisual();

        await approachAndBuild(stage);
        act(() => {
            onScreen().emit(true);
        });

        expect(tickerCount()).toBe(before);
    });

    it('should only fetch the code when the page goes idle, without building it', async () => {
        const { stage } = renderVisual();
        const task = vi.mocked(whenIdle).mock.calls[0]?.[0];

        expect(task).toBeTypeOf('function');

        await act(async () => {
            task?.();
            await new Promise(resolve => setTimeout(resolve, 20));
        });

        expect(stage()?.childElementCount).toBe(0);
    });
});
