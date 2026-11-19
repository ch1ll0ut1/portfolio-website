/**
 * The terminal typing engine.
 *
 * Frozen markup in, class toggles out. The component renders every line of the
 * transcript and every character of the command up front, so the terminal
 * reads with JavaScript off; this engine only hides them, reveals them again on
 * a schedule, and parks a block caret at the end.
 *
 * `type()` precomputes an event timeline and plays it from the shared clock, so
 * a step scrolled past mid-type can be finished in one call and no engine ever
 * owns a requestAnimationFrame loop of its own.
 */

import { subscribeTick } from '@/lib/motion';

export interface TyperClassNames {
    /** Marks a line or a character as not yet revealed. */
    off: string;
    /** The block caret this engine creates and moves. */
    caret: string;
    /** Caret parked at the end of the transcript, free to blink. */
    caretIdle: string;
}

export interface Typer {
    /** Hides everything past the prompt, ready to type. */
    clear: () => void;
    /** Plays the transcript. `fast` is the replay speed for a step seen before. */
    type: (fast: boolean) => void;
    /** Jumps to the finished state and releases the clock. */
    finish: () => void;
    /**
     * Applies every event due at `elapsed` milliseconds.
     *
     * The ticker calls this; tests call it directly to walk the timeline
     * without waiting on real frames.
     */
    step: (elapsed: number) => void;
    /** Removes the caret and releases the clock. */
    destroy: () => void;
}

interface TimelineEvent {
    at: number;
    run: () => void;
}

interface Timing {
    /** Pause before the first character. */
    lead: number;
    /** Upper bound per character. */
    perChar: number;
    /** Total budget for the command line, which shortens long commands. */
    budget: number;
    /** Pause between the command and its first output line. */
    gap: number;
    /** Pause between output lines. */
    lineStep: number;
    /** Vary the per-character delay, so it reads as hands rather than a clock. */
    jitter: boolean;
}

/** The "$ " prompt is already on screen before typing starts. */
const PROMPT_CHARS = 2;

const NORMAL: Timing = { lead: 140, perChar: 24, budget: 560, gap: 180, lineStep: 85, jitter: true };
const FAST: Timing = { lead: 0, perChar: 8, budget: 160, gap: 40, lineStep: 24, jitter: false };

export const createTyper = (pre: HTMLElement, names: TyperClassNames): Typer => {
    const lines = Array.from(pre.querySelectorAll<HTMLElement>('[data-line]'));
    const chars = Array.from(pre.querySelectorAll<HTMLElement>('[data-char]'));
    const firstLine = lines.at(0);
    const lastLine = lines.at(-1);
    const prompt = Math.min(PROMPT_CHARS, chars.length);
    const caret = document.createElement('span');

    let events: TimelineEvent[] = [];
    let cursor = 0;
    let origin: number | null = null;
    let stop: (() => void) | null = null;

    caret.className = names.caret;
    caret.setAttribute('aria-hidden', 'true');

    const release = () => {
        stop?.();
        stop = null;
        origin = null;
    };

    const park = () => {
        lastLine?.appendChild(caret);
        caret.classList.add(names.caretIdle);
    };

    const clear = () => {
        release();
        lines.forEach((line, index) => {
            line.classList.toggle(names.off, index > 0);
        });
        chars.forEach((char, index) => {
            char.classList.toggle(names.off, index >= prompt);
        });

        const anchor = prompt > 0 ? chars.at(prompt - 1) : undefined;

        if (anchor) {
            anchor.after(caret);
        }
        else {
            firstLine?.appendChild(caret);
        }

        caret.classList.remove(names.caretIdle);
    };

    const finish = () => {
        release();
        lines.forEach((line) => {
            line.classList.remove(names.off);
        });
        chars.forEach((char) => {
            char.classList.remove(names.off);
        });
        park();
    };

    const step = (elapsed: number) => {
        for (let event = events.at(cursor); event && event.at <= elapsed; event = events.at(cursor)) {
            cursor += 1;
            event.run();
        }

        if (cursor >= events.length) {
            release();
        }
    };

    const type = (fast: boolean) => {
        clear();
        events = buildTimeline({
            lines,
            chars,
            prompt,
            caret,
            park,
            off: names.off,
            timing: fast ? FAST : NORMAL,
        });
        cursor = 0;
        stop = subscribeTick((now) => {
            origin ??= now;
            step(now - origin);
        });
    };

    park();

    return {
        clear,
        type,
        finish,
        step,
        destroy: () => {
            release();
            caret.remove();
        },
    };
};

interface TimelineInput {
    lines: HTMLElement[];
    chars: HTMLElement[];
    prompt: number;
    caret: HTMLElement;
    park: () => void;
    off: string;
    timing: Timing;
}

/**
 * Lays the whole run out on a millisecond timeline up front.
 *
 * The command types character by character; the output lines then land whole,
 * one after another, with the caret hopping to the end of each.
 */
const buildTimeline = (input: TimelineInput): TimelineEvent[] => {
    const { lines, chars, prompt, caret, park, off, timing } = input;
    const typed = Math.max(1, chars.length - prompt);
    const perChar = Math.min(timing.perChar, timing.budget / typed);
    const events: TimelineEvent[] = [];

    let at = timing.lead;

    for (let index = prompt; index < chars.length; index++) {
        const char = chars[index];

        if (char === undefined) {
            continue;
        }

        at += timing.jitter ? perChar * (0.55 + Math.random() * 0.9) : perChar;
        events.push({
            at,
            run: () => {
                char.classList.remove(off);
                char.after(caret);
            },
        });
    }

    at += timing.gap;

    for (let index = 1; index < lines.length; index++) {
        const line = lines[index];

        if (line === undefined) {
            continue;
        }

        events.push({
            at,
            run: () => {
                line.classList.remove(off);
                line.appendChild(caret);
            },
        });
        at += timing.lineStep;
    }

    events.push({ at, run: park });

    return events;
};
