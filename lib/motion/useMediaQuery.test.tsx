/**
 * Tests for the shared media-query hook.
 *
 * What matters: it reports the live answer, follows changes, renders the
 * server value into server markup, and lets go of its listener on unmount.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { type FC } from 'react';
import { useMediaQuery } from './useMediaQuery';

const QUERY = '(max-width: 479px)';

const Probe: FC<{ serverValue?: boolean }> = ({ serverValue }) => {
    const matches = useMediaQuery(QUERY, serverValue);

    return <p>{matches ? 'matches' : 'does not match'}</p>;
};

/** A controllable MediaQueryList: flip `matches` and fire its listeners. */
const installQuery = (initial: boolean) => {
    const listeners = new Set<() => void>();
    const original = window.matchMedia.bind(window);
    const state = { matches: initial };

    window.matchMedia = vi.fn((media: string) => ({
        get matches() {
            return media === QUERY && state.matches;
        },
        media,
        onchange: null,
        addEventListener: (_type: string, listener: () => void) => {
            listeners.add(listener);
        },
        removeEventListener: (_type: string, listener: () => void) => {
            listeners.delete(listener);
        },
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    return {
        listeners,
        set: (matches: boolean) => {
            state.matches = matches;
            listeners.forEach((listener) => {
                listener();
            });
        },
        restore: () => {
            window.matchMedia = original;
        },
    };
};

describe('useMediaQuery', () => {
    let query: ReturnType<typeof installQuery>;

    beforeEach(() => {
        query = installQuery(true);
    });

    afterEach(() => {
        query.restore();
    });

    it('should report whether the query matches', () => {
        render(<Probe />);

        expect(screen.getByText('matches')).toBeInTheDocument();
    });

    it('should follow the query as it changes', () => {
        render(<Probe />);

        act(() => {
            query.set(false);
        });

        expect(screen.getByText('does not match')).toBeInTheDocument();
    });

    it('should render the server value into server markup', () => {
        expect(renderToString(<Probe />)).toContain('does not match');
        expect(renderToString(<Probe serverValue />)).toContain('matches');
    });

    it('should stop listening once unmounted', () => {
        const view = render(<Probe />);

        expect(query.listeners.size).toBe(1);

        view.unmount();

        expect(query.listeners.size).toBe(0);
    });
});
