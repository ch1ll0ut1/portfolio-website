/**
 * One shared toast element and clipboard helper.
 *
 * Kept outside React: a copy confirmation should not depend on a provider
 * being mounted, and only one toast is ever visible.
 */

const VISIBLE_MS = 2200;

let element: HTMLDivElement | null = null;
let timer = 0;

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

    node.textContent = message;
    requestAnimationFrame(() => {
        node.classList.add('is-on');
    });
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
        node.classList.remove('is-on');
    }, VISIBLE_MS);
};

/** Copies text, falling back to a hidden textarea where the async API is blocked. */
export const copyText = async (text: string, label = 'Copied') => {
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
        showToast(copied ? label : `Select and copy: ${text}`);

        return copied;
    };

    try {
        await navigator.clipboard.writeText(text);
        showToast(label);

        return true;
    }
    catch {
        return fallback();
    }
};
