/**
 * One shared toast element.
 *
 * Kept outside React: a palette confirmation should not depend on a provider
 * being mounted, and only one toast is ever visible.
 */

const VISIBLE_MS = 2200;

let element: HTMLDivElement | null = null;
let timer = 0;

/**
 * Mounts the live region, empty.
 *
 * Deliberately does not write the message: a region populated in the same tick
 * it is appended is never announced, because the text has to change after the
 * region is already in the accessibility tree.
 */
const ensureElement = () => {
    element ??= document.createElement('div');
    element.className = 'toast';
    element.setAttribute('role', 'status');

    if (!element.isConnected) {
        document.body.appendChild(element);
    }

    return element;
};

export const showToast = (message: string) => {
    if (typeof document === 'undefined') {
        return;
    }

    const node = ensureElement();

    // A frame later, so the first toast is announced and not just drawn.
    requestAnimationFrame(() => {
        node.textContent = message;
        node.classList.add('is-on');
    });
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
        node.classList.remove('is-on');
    }, VISIBLE_MS);
};
