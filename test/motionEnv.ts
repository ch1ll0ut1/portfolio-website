/**
 * Browser APIs the motion library depends on that jsdom does not implement.
 *
 * Each installer returns a restore function so a test can opt in per case
 * without leaking globals into other suites.
 */

import { vi } from 'vitest';

export interface FakeObserver {
    element: Element | null;
    disconnected: boolean;
    /** Pushes an intersection state to this observer's callback. */
    emit: (isIntersecting: boolean) => void;
    options: IntersectionObserverInit | undefined;
}

/** Replaces IntersectionObserver and exposes every instance created. */
export const installIntersectionObserver = () => {
    const instances: FakeObserver[] = [];
    const original = globalThis.IntersectionObserver;

    class MockIntersectionObserver {
        private readonly record: FakeObserver;

        constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
            this.record = {
                element: null,
                disconnected: false,
                options,
                emit: (isIntersecting: boolean) => {
                    const entry = { isIntersecting, target: this.record.element };

                    callback([entry] as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
                },
            };
            instances.push(this.record);
        }

        observe(element: Element) {
            this.record.element = element;
        }

        disconnect() {
            this.record.disconnected = true;
        }

        unobserve() {
            this.record.element = null;
        }

        takeRecords() {
            return [];
        }
    }

    globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

    return {
        instances,
        restore: () => {
            globalThis.IntersectionObserver = original;
        },
    };
};

/** Forces matchMedia to report the given queries as matching. */
export const installMatchMedia = (matching: string[] = []) => {
    const original = window.matchMedia;

    window.matchMedia = vi.fn((query: string) => ({
        matches: matching.includes(query),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    return () => {
        window.matchMedia = original;
    };
};

/** Pins an element's measured box so layout-dependent code is deterministic. */
export const stubRect = (element: HTMLElement, rect: Partial<DOMRect>) => {
    element.getBoundingClientRect = () => ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
        ...rect,
    }) as DOMRect;
};
