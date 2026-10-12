/**
 * Tests for the terminal typing engine.
 * Drives the timeline directly rather than waiting on real frames, and checks
 * states rather than exact durations.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import type { TerminalSpan } from '@/config/processSteps';
import { TerminalScreen } from './TerminalScreen';
import { createTyper } from './typer';
import styles from './Process.module.css';

const TRANSCRIPT: TerminalSpan[][] = [
    [{ text: '$', tone: 'prompt' }, { text: ' go' }],
    [{ text: 'done', tone: 'ok' }],
];

const names = { off: styles.off, caret: styles.caret, caretIdle: styles.caretIdle };

/**
 * Renders the real screen markup and wraps it in a typer.
 *
 * Fast timing is flat, so the test can name the millisecond a character lands:
 * two characters to type at 8ms each, then a 40ms gap before the output.
 */
const setup = () => {
    const { container } = render(<TerminalScreen transcript={TRANSCRIPT} />);
    const pre = container.querySelector('[data-screen]');

    if (!(pre instanceof HTMLElement)) {
        throw new Error('screen markup missing');
    }

    return {
        typer: createTyper(pre, names),
        lines: Array.from(pre.querySelectorAll<HTMLElement>('[data-line]')),
        chars: Array.from(pre.querySelectorAll<HTMLElement>('[data-char]')),
        caret: () => pre.querySelector(`.${styles.caret}`),
    };
};

describe('createTyper', () => {
    it('should split the command into one node per character', () => {
        const { chars } = setup();

        expect(chars.map(char => char.textContent).join('')).toBe('$ go');
    });

    it('should leave the whole transcript readable before anything runs', () => {
        const { lines, chars } = setup();

        expect(lines.some(line => line.classList.contains(styles.off))).toBe(false);
        expect(chars.some(char => char.classList.contains(styles.off))).toBe(false);
    });

    it('should hide everything past the prompt when cleared', () => {
        const { typer, lines, chars } = setup();

        typer.clear();

        expect(chars[0].classList.contains(styles.off)).toBe(false);
        expect(chars[1].classList.contains(styles.off)).toBe(false);
        expect(chars[2].classList.contains(styles.off)).toBe(true);
        expect(lines[0].classList.contains(styles.off)).toBe(false);
        expect(lines[1].classList.contains(styles.off)).toBe(true);
    });

    it('should type the command one character at a time', () => {
        const { typer, chars } = setup();

        typer.type(true);
        typer.step(8);

        expect(chars[2].classList.contains(styles.off)).toBe(false);
        expect(chars[3].classList.contains(styles.off)).toBe(true);

        typer.step(16);

        expect(chars[3].classList.contains(styles.off)).toBe(false);
    });

    it('should hold the output back until the command is typed', () => {
        const { typer, lines } = setup();

        typer.type(true);
        typer.step(16);

        expect(lines[1].classList.contains(styles.off)).toBe(true);

        typer.step(56);

        expect(lines[1].classList.contains(styles.off)).toBe(false);
    });

    it('should reveal the output lines in order', () => {
        const { typer, lines } = setup();

        typer.type(true);
        typer.step(56);

        // The trailing prompt is the last line and lands after the output.
        expect(lines[2].classList.contains(styles.off)).toBe(true);

        typer.step(1000);

        expect(lines[2].classList.contains(styles.off)).toBe(false);
    });

    it('should replay a revisited step faster than a first visit', () => {
        const normal = setup();
        const fast = setup();

        normal.typer.type(false);
        normal.typer.step(250);
        fast.typer.type(true);
        fast.typer.step(250);

        expect(normal.lines[1].classList.contains(styles.off)).toBe(true);
        expect(fast.lines[1].classList.contains(styles.off)).toBe(false);
    });

    it('should jump to the end state when finished mid-run', () => {
        const { typer, lines, chars, caret } = setup();

        typer.type(false);
        typer.finish();

        expect(lines.some(line => line.classList.contains(styles.off))).toBe(false);
        expect(chars.some(char => char.classList.contains(styles.off))).toBe(false);
        expect(caret()?.classList.contains(styles.caretIdle)).toBe(true);
    });

    it('should park the caret on the trailing prompt when the run completes', () => {
        const { typer, lines, caret } = setup();

        typer.type(true);
        typer.step(1000);

        expect(caret()?.parentElement).toBe(lines[2]);
        expect(caret()?.classList.contains(styles.caretIdle)).toBe(true);
    });

    it('should remove its caret when destroyed', () => {
        const { typer, caret } = setup();

        typer.destroy();

        expect(caret()).toBeNull();
    });
});
