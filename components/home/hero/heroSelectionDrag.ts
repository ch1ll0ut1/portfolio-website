/**
 * The intro's selection drag.
 *
 * An I-beam approaches the highlighted phrase, drags across it and releases.
 * The highlight's width is driven by `--hl` and snaps to character boundaries,
 * measured once from the real text nodes, so it reads as a hand dragging over
 * glyphs rather than a bar growing on a timer.
 */

import { clamp, hasFinePointer, lerp, subscribeTick } from '@/lib/motion';
import { characterOffset } from './editorDom';

export interface SelectionDragOptions {
    title: HTMLElement;
    /** Positioning context for the caret and the I-beam. */
    doc: HTMLElement;
    caret: HTMLElement;
    ibeam: HTMLElement;
    /** The drag currently covers this character range. */
    onSelecting: (start: number, end: number) => void;
    /** Fired once, when the drag lets go of the fully covered phrase. */
    onRelease: (mark: HTMLElement) => void;
    /** The drag is over, or could not run at all. */
    onComplete: () => void;
}

/** Beat before the drag starts, so the words have risen first. */
const DELAY_MS = 700;
const APPROACH_MS = 200;
const DRAG_MS = 600;
/** How long the caret lingers, blinking once, after the release. */
const AFTER_MS = 620;
const EXIT_MS = 320;
const BLINK_FROM_MS = 260;
const BLINK_TO_MS = 460;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface MarkGeometry {
    mark: HTMLElement;
    /** Left edge of every character boundary, relative to the mark. */
    boundaries: number[];
    width: number;
    /** Character offset of the mark's first character. */
    start: number;
}

const measureMark = (title: HTMLElement): MarkGeometry | null => {
    const mark = title.querySelector('mark');
    const text = mark?.firstChild;

    if (!mark || !(text instanceof Text) || text.length === 0) {
        return null;
    }

    const markRect = mark.getBoundingClientRect();
    const boundaries: number[] = [];
    const range = document.createRange();

    for (let index = 0; index < text.length; index += 1) {
        range.setStart(text, index);
        range.setEnd(text, index + 1);
        boundaries.push(range.getBoundingClientRect().left - markRect.left);
    }

    range.setStart(text, text.length - 1);
    range.setEnd(text, text.length);
    boundaries.push(range.getBoundingClientRect().right - markRect.left);

    return {
        mark,
        boundaries,
        width: markRect.width,
        start: characterOffset(title, text, 0),
    };
};

/** Index of the character boundary the pointer has dragged past. */
const boundaryAt = (boundaries: number[], offset: number) => {
    let boundary = 0;

    for (let index = 0; index < boundaries.length; index += 1) {
        const edge = index === 0 ? boundaries[0] : (boundaries[index - 1] + boundaries[index]) / 2;

        if (offset >= edge) {
            boundary = index;
        }
    }

    return boundary;
};

/** Starts the drag on the shared clock. Returns a stop function. */
export const runSelectionDrag = ({
    title,
    doc,
    caret,
    ibeam,
    onSelecting,
    onRelease,
    onComplete,
}: SelectionDragOptions) => {
    const startedAt = performance.now();
    const fine = hasFinePointer();

    let geometry: MarkGeometry | null = null;
    let released = false;

    const frame = (now: number) => {
        const elapsed = now - startedAt - DELAY_MS;

        if (elapsed < 0) {
            return;
        }

        geometry ??= measureMark(title);

        if (!geometry) {
            onComplete();

            return;
        }

        const fontSize = parseFloat(getComputedStyle(title).fontSize);
        const docRect = doc.getBoundingClientRect();
        const markRect = geometry.mark.getBoundingClientRect();
        const left = markRect.left - docRect.left;
        const top = markRect.top - docRect.top + 0.17 * fontSize;
        const height = markRect.height - 0.27 * fontSize;
        const middle = top + height / 2;
        const from = left - 2;
        const to = left + geometry.width + 10;

        let x = from;
        let y = middle;
        let ibeamAlpha = 1;

        if (elapsed < APPROACH_MS) {
            const progress = easeOut(elapsed / APPROACH_MS);

            x = from - 46 * (1 - progress);
            y = middle + 38 * (1 - progress);
            ibeamAlpha = progress;
        }
        else if (elapsed < APPROACH_MS + DRAG_MS) {
            const progress = easeInOut((elapsed - APPROACH_MS) / DRAG_MS);

            x = lerp(from, to, progress);
            y = middle + Math.sin(progress * Math.PI) * -3;
        }
        else {
            const progress = easeOut(clamp((elapsed - APPROACH_MS - DRAG_MS) / EXIT_MS, 0, 1));

            x = to + 26 * progress;
            y = middle + 30 * progress;
            ibeamAlpha = 1 - progress;
        }

        const last = geometry.boundaries.length - 1;
        const boundary = elapsed < APPROACH_MS ? 0 : boundaryAt(geometry.boundaries, x - left);
        const pad = 0.035 * fontSize;
        const covered = boundary >= last
            ? 1
            : boundary === 0 ? 0 : (geometry.boundaries[boundary] + pad) / (geometry.width + 2 * pad);

        geometry.mark.style.setProperty('--hl', covered.toFixed(4));

        const caretX = left + (boundary >= last ? geometry.width : geometry.boundaries[boundary]);

        caret.style.height = `${height}px`;
        caret.style.transform = `translate3d(${caretX.toFixed(1)}px, ${top.toFixed(1)}px, 0)`;
        ibeam.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        ibeam.style.opacity = fine ? ibeamAlpha.toFixed(3) : '0';

        if (elapsed >= APPROACH_MS) {
            const since = elapsed - APPROACH_MS - DRAG_MS;
            const blinking = since > BLINK_FROM_MS && since < BLINK_TO_MS;

            caret.style.opacity = since > AFTER_MS || blinking ? '0' : '1';

            if (!released) {
                onSelecting(geometry.start, geometry.start + boundary);
            }
        }

        if (!released && elapsed >= APPROACH_MS + DRAG_MS) {
            released = true;
            geometry.mark.style.setProperty('--hl', '1');
            onRelease(geometry.mark);
        }

        if (elapsed > APPROACH_MS + DRAG_MS + AFTER_MS + 40) {
            onComplete();
        }
    };

    return subscribeTick(frame);
};
