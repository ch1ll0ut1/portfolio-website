/**
 * Wraps each word of an element in a mask so lines can rise into place.
 *
 * Every word becomes `<span class="sw"><span class="swi">word</span></span>`.
 * The outer span clips; the inner one translates. Each word carries its line
 * index (`--li`) and word index (`--wi`) so the global motion primitives can
 * stagger by line without JS running per frame.
 *
 * Inline markup (mark, em, strong, a) is preserved — only text nodes are split.
 */

import { onStage } from './stage';

/** Words whose offsetTop differs by less than this are treated as one line. */
const LINE_TOLERANCE_PX = 4;
const SKIP_SELECTOR = 'br, svg, .no-split';

const cache = new WeakMap<HTMLElement, HTMLElement[]>();

const splitTextNode = (node: Text, words: HTMLElement[]) => {
    const parts = node.textContent.split(/(\s+)/);

    if (parts.length === 1 && parts[0]?.trim() === '') {
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const part of parts) {
        if (part === '') {
            continue;
        }

        if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(' '));
            continue;
        }

        const mask = document.createElement('span');
        const inner = document.createElement('span');

        mask.className = 'sw';
        inner.className = 'swi';
        inner.textContent = part;
        mask.appendChild(inner);
        fragment.appendChild(mask);
        words.push(mask);
    }

    node.replaceWith(fragment);
};

const walk = (node: Node, words: HTMLElement[]) => {
    for (const child of Array.from(node.childNodes)) {
        if (child instanceof Text) {
            splitTextNode(child, words);
        }
        else if (child instanceof HTMLElement && !child.matches(SKIP_SELECTOR)) {
            walk(child, words);
        }
    }
};

/**
 * Recomputes line and word indices. Must run again whenever wrapping can
 * change — font load, resize, container resize.
 */
export const indexWords = (words: HTMLElement[]) => {
    let line = -1;
    let lastTop: number | null = null;

    words.forEach((word, index) => {
        const top = Math.round(word.offsetTop);

        if (lastTop === null || Math.abs(top - lastTop) > LINE_TOLERANCE_PX) {
            line += 1;
            lastTop = top;
        }

        word.style.setProperty('--li', String(line));
        word.style.setProperty('--wi', String(index));
    });
};

/** Splits once per element and caches the result. */
export const splitWords = (element: HTMLElement) => {
    const cached = cache.get(element);

    if (cached) {
        return cached;
    }

    const words: HTMLElement[] = [];

    walk(element, words);
    cache.set(element, words);
    indexWords(words);

    return words;
};

/** Keeps an element's word indices correct across layout changes. */
export const trackWordIndices = (words: HTMLElement[]) => onStage('layout', () => {
    indexWords(words);
});
