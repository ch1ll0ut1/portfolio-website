/**
 * Sizing for the footer wordmark.
 *
 * The giant "Stefan Knoch" has to span its container exactly, so it is measured
 * at a known probe size and scaled from the result. Each letter's measured width
 * is then frozen inline: the proximity effect thickens letters as the cursor
 * passes, and without the freeze every weight change would reflow the line.
 *
 * Framework-agnostic on purpose — the component owns the elements, this owns the
 * measuring. It never reads a class name, so the hashed CSS Module names stay
 * entirely in the component.
 */

/** Size the word is measured at before being scaled. */
const PROBE_PX = 100;
/** Shaves a hair off the fit so sub-pixel rounding can never overflow. */
const SAFETY = 0.995;
/** Container width changes smaller than this are not worth a re-fit. */
const WIDTH_EPSILON = 0.5;

export interface WordmarkFitTargets {
    /** The clipping container whose width the word must match. */
    container: HTMLElement;
    /** The inline-block word. Its font size is what gets set. */
    word: HTMLElement;
    /** The letter spans, whose widths get frozen. */
    letters: HTMLElement[];
}

export interface WordmarkFit {
    /** Re-fits the word. Pass `true` to ignore the width-change threshold. */
    run: (force?: boolean) => void;
    /** Drops the inline font size and frozen widths. */
    clear: () => void;
}

/**
 * Font size, in px, at which a word measured as `measuredWidth` at
 * `probeWidth`'s size spans `containerWidth`.
 */
export const fitFontSize = (containerWidth: number, measuredWidth: number, probeSize = PROBE_PX) => {
    if (measuredWidth <= 0) {
        return 0;
    }

    return (probeSize * containerWidth) / measuredWidth * SAFETY;
};

/** Whether a container width change is large enough to be worth re-fitting. */
export const shouldRefit = (width: number, lastWidth: number, force = false) => {
    if (width <= 0) {
        return false;
    }

    return force || Math.abs(width - lastWidth) >= WIDTH_EPSILON;
};

export const createWordmarkFit = ({ container, word, letters }: WordmarkFitTargets): WordmarkFit => {
    let lastWidth = 0;

    const clear = () => {
        lastWidth = 0;
        word.style.fontSize = '';

        for (const letter of letters) {
            letter.style.width = '';
        }
    };

    const run = (force = false) => {
        const width = container.clientWidth;

        if (!shouldRefit(width, lastWidth, force)) {
            return;
        }

        lastWidth = width;

        // Measure unconstrained: frozen widths from the previous fit would
        // otherwise be measured instead of the glyphs.
        for (const letter of letters) {
            letter.style.width = '';
        }

        word.style.fontSize = `${PROBE_PX}px`;

        const measured = word.getBoundingClientRect().width;
        const size = fitFontSize(width, measured);

        if (size <= 0) {
            return;
        }

        word.style.fontSize = `${size.toFixed(3)}px`;

        const widths = letters.map(letter => letter.getBoundingClientRect().width);

        letters.forEach((letter, index) => {
            letter.style.width = `${widths[index].toFixed(2)}px`;
        });
    };

    return { run, clear };
};
