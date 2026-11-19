/**
 * Word masks for the headline's intro.
 *
 * Each run of non-space content — a word, plus any inline element glued to it —
 * is wrapped in the global `.sw` / `.swi` mask pair so it can rise into place.
 * The wrappers exist only for the length of the intro and are unwrapped before
 * the editor takes over, so the document model never sees them.
 */

/** Words whose offsetTop differs by less than this count as one line. */
const LINE_TOLERANCE_PX = 4;

/** Wraps the headline's words. Returns the inner, animatable spans. */
export const splitIntoWordMasks = (title: HTMLElement) => {
    const tokens: (Node | ' ')[] = [];

    for (const node of Array.from(title.childNodes)) {
        if (node instanceof Text) {
            for (const part of node.data.split(/(\s+)/)) {
                if (part === '') {
                    continue;
                }

                tokens.push(/^\s+$/.test(part) ? ' ' : document.createTextNode(part));
            }
        }
        else {
            tokens.push(node);
        }
    }

    title.textContent = '';

    const units: HTMLElement[] = [];
    let inner: HTMLElement | null = null;

    for (const token of tokens) {
        if (token === ' ') {
            inner = null;
            title.appendChild(document.createTextNode(' '));
            continue;
        }

        if (!inner) {
            const outer = document.createElement('span');

            inner = document.createElement('span');
            outer.className = 'sw';
            inner.className = 'swi';
            outer.appendChild(inner);
            title.appendChild(outer);
            units.push(inner);
        }

        inner.appendChild(token);
    }

    return units;
};

/** Removes the masks, leaving the headline exactly as it was before. */
export const unwrapWordMasks = (title: HTMLElement) => {
    for (const outer of Array.from(title.querySelectorAll('.sw'))) {
        const inner = outer.firstChild;

        outer.replaceWith(...(inner ? Array.from(inner.childNodes) : []));
    }

    title.normalize();
};

/** Line each unit sits on, so the rise can stagger by line as well as by word. */
export const wordLineIndices = (units: HTMLElement[]) => {
    let line = 0;
    let lastTop: number | null = null;

    return units.map((unit) => {
        const top = Math.round(unit.parentElement?.offsetTop ?? 0);

        if (lastTop !== null && Math.abs(top - lastTop) > LINE_TOLERANCE_PX) {
            line += 1;
        }

        lastTop = top;

        return line;
    });
};
