import React from 'react';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Make React available globally for JSX in tests
global.React = React;

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

/*
 * Browser APIs the motion kit depends on that jsdom does not implement. Without
 * these, any component using the kit throws on mount and every suite has to
 * stub them again.
 *
 * These are inert defaults — no query matches, nothing ever intersects — so a
 * test that cares about the behaviour installs its own (see test/motionEnv.ts)
 * and overrides them. Each is only defined if missing, so a stub installed by
 * an outer scope wins.
 */
const defineIfMissing = (target: object, property: string, value: unknown) => {
    if (!(property in target)) {
        Object.defineProperty(target, property, { value, writable: true, configurable: true });
    }
};

class InertObserver {
    observe() {
        // Nothing ever intersects or resizes by default.
    }

    unobserve() {
        // Intentionally empty.
    }

    disconnect() {
        // Intentionally empty.
    }

    takeRecords() {
        return [];
    }
}

defineIfMissing(window, 'matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
}));

defineIfMissing(globalThis, 'IntersectionObserver', InertObserver);
defineIfMissing(globalThis, 'ResizeObserver', InertObserver);

// The page lifecycle waits on fonts before releasing the intro.
defineIfMissing(document, 'fonts', {
    ready: Promise.resolve(),
    add: () => undefined,
    load: () => Promise.resolve([]),
    [Symbol.iterator]: function* () {
        // No loaded faces in jsdom.
    },
});

// runs a cleanup after each test case
afterEach(() => {
    cleanup();
});
