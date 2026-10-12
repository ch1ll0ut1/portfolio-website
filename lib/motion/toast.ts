/**
 * One shared toast element and clipboard helper.
 *
 * Kept outside React: a copy confirmation should not depend on a provider
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

export interface CopyOptions {
    /** Message for the global toast. */
    label?: string;
    /**
     * Leave the global toast alone. For callers that confirm the copy in their
     * own UI, which would otherwise confirm it twice. The caller then owns the
     * failure message too.
     */
    silent?: boolean;
}

/** Copies text, falling back to a hidden textarea where the async API is blocked. */
export const copyText = async (text: string, options: CopyOptions = {}) => {
    const { label = 'Copied', silent = false } = options;

    const confirm = (message: string) => {
        if (!silent) {
            showToast(message);
        }
    };

    const fallback = () => {
        const area = document.createElement('textarea');

        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();

        let copied = false;

        try {
            // Deliberate fallback: the async clipboard API is unavailable in some
            // contexts (insecure origins, denied permission) and this still works.
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            copied = document.execCommand('copy');
        }
        catch {
            copied = false;
        }

        area.remove();
        confirm(copied ? label : `Select and copy: ${text}`);

        return copied;
    };

    try {
        await navigator.clipboard.writeText(text);
        confirm(label);

        return true;
    }
    catch {
        return fallback();
    }
};
