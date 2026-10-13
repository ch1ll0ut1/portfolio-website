/**
 * Tests for the `useEffectEvent` stand-in.
 *
 * What matters: the returned function keeps its identity across renders, so
 * effects that depend on it do not resubscribe, and it always calls the
 * callback from the latest committed render.
 */

import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEffect } from 'react';
import { useEventCallback } from './useEventCallback';

describe('useEventCallback', () => {
    it('keeps the same function across renders', () => {
        const { result, rerender } = renderHook(({ value }) => useEventCallback(() => value), {
            initialProps: { value: 1 },
        });
        const first = result.current;

        rerender({ value: 2 });

        expect(result.current).toBe(first);
    });

    it('calls the callback from the latest render', () => {
        const { result, rerender } = renderHook(({ value }) => useEventCallback((add: number) => value + add), {
            initialProps: { value: 1 },
        });

        rerender({ value: 10 });

        expect(result.current(5)).toBe(15);
    });

    it('is current by the time an effect of the same render runs', () => {
        const seen = vi.fn();
        const { rerender } = renderHook(({ value }) => {
            const read = useEventCallback(() => value);

            useEffect(() => {
                seen(read());
            }, [value, read]);
        }, { initialProps: { value: 'a' } });

        rerender({ value: 'b' });

        expect(seen.mock.calls).toEqual([['a'], ['b']]);
    });
});
