/**
 * Tests for the stage subscription hook.
 *
 * What matters: an inline callback does not resubscribe on every render, the
 * signal always reaches the callback from the latest render, and unmounting
 * unsubscribes. The motion hooks share this Effect Event pattern, so this is
 * where it is pinned down.
 */

import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as stage from './stage';
import { useStageEvent } from './useStageEvent';

describe('useStageEvent', () => {
    it('subscribes once, however often an inline callback changes', () => {
        const subscribe = vi.spyOn(stage, 'onStage');
        const { rerender, unmount } = renderHook(({ value }) => {
            useStageEvent('theme', () => value);
        }, { initialProps: { value: 1 } });

        rerender({ value: 2 });
        rerender({ value: 3 });

        expect(subscribe).toHaveBeenCalledTimes(1);
        unmount();
        subscribe.mockRestore();
    });

    it('calls the callback from the latest render', () => {
        const seen = vi.fn();
        const { rerender, unmount } = renderHook(({ value }) => {
            useStageEvent('theme', () => {
                seen(value);
            });
        }, { initialProps: { value: 'a' } });

        rerender({ value: 'b' });
        stage.emitStage('theme');

        expect(seen.mock.calls).toEqual([['b']]);
        unmount();
    });

    it('stops listening on unmount', () => {
        const seen = vi.fn();
        const { unmount } = renderHook(() => {
            useStageEvent('theme', seen);
        });

        unmount();
        stage.emitStage('theme');

        expect(seen).not.toHaveBeenCalled();
    });
});
