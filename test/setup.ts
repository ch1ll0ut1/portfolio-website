import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
// Registers the jest-dom matchers on Vitest's `expect` and types them. Imported
// here rather than listed under `types` in tsconfig.json, so the config the app
// is built with declares no test globals: tests import `describe`, `it` and
// `expect` from 'vitest' explicitly.
import '@testing-library/jest-dom/vitest';

/*
 * Browser APIs the motion kit depends on that jsdom does not implement. Without
 * these, any component using the kit throws on mount and every suite has to
 * stub them again.
 *
 * These are inert defaults — no query matches, nothing ever intersects — so a
 * test that cares about the behaviour installs its own (see test/motionEnv.ts)
 * and overrides them. Each is only defined if nothing usable is there already,
 * so a stub installed by an outer scope wins.
 *
 * The presence test reads the property rather than asking `in`. Vitest's jsdom
 * environment mirrors the jsdom window onto `globalThis` with accessors, which
 * makes `'matchMedia' in window` true while the getter still resolves to
 * undefined — `in` would skip the default and leave components calling a
 * non-function. Reading also covers inherited properties for free.
 */
const defineDefault = (target: object, property: string, value: unknown) => {
    const existing: unknown = Reflect.get(target, property);

    if (existing === undefined || existing === null) {
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

defineDefault(window, 'matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
}));

defineDefault(globalThis, 'IntersectionObserver', InertObserver);
defineDefault(globalThis, 'ResizeObserver', InertObserver);

// The page lifecycle waits on fonts before releasing the intro.
defineDefault(document, 'fonts', {
    ready: Promise.resolve(),
    add: () => undefined,
    load: () => Promise.resolve([]),
    [Symbol.iterator]: function* () {
        // No loaded faces in jsdom.
    },
});

/*
 * jsdom has `<dialog>` but not its modal API. This is the smallest stand-in
 * that keeps the contract the overlays rely on: `showModal()` and `close()`
 * toggle `open` and focus nothing on their own, `close()` queues a `close`
 * event, and Escape inside an open dialog fires a cancelable `cancel` that
 * closes it unless prevented. Inertness of the page behind is the browser's
 * job and is checked in the browser, not here.
 */
if (typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
        this.open = true;
    };

    HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
        if (!this.open) {
            return;
        }

        this.open = false;
        window.setTimeout(() => {
            this.dispatchEvent(new Event('close'));
        }, 0);
    };

    document.addEventListener('keydown', (event) => {
        const dialog = event.target instanceof Element ? event.target.closest('dialog') : null;

        if (event.key !== 'Escape' || !dialog?.open) {
            return;
        }

        if (dialog.dispatchEvent(new Event('cancel', { cancelable: true }))) {
            dialog.close();
        }
    });
}

// runs a cleanup after each test case
afterEach(() => {
    cleanup();
});
