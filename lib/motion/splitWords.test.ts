/**
 * Tests for word splitting.
 *
 * Splitting must not change the readable text or drop inline markup, and the
 * line indices drive the stagger so they have to reflect actual wrapping.
 */

import { describe, expect, it, vi } from 'vitest';
import { indexWords, splitWords } from './splitWords';

/** jsdom reports offsetTop as 0, so wrapping is simulated per word. */
const stubLines = (words: HTMLElement[], tops: number[]) => {
    words.forEach((word, index) => {
        Object.defineProperty(word, 'offsetTop', {
            configurable: true,
            get: () => tops[index] ?? 0,
        });
    });
};

const makeElement = (html: string) => {
    const element = document.createElement('h1');

    element.innerHTML = html;
    document.body.appendChild(element);

    return element;
};

describe('splitWords', () => {
    it('should wrap each word in a mask and keep the text readable', () => {
        const element = makeElement('I build the hard part.');
        const words = splitWords(element);

        expect(words).toHaveLength(5);
        expect(element.textContent).toBe('I build the hard part.');
        expect(element.querySelectorAll('.sw')).toHaveLength(5);
        expect(element.querySelectorAll('.swi')).toHaveLength(5);
    });

    it('should preserve inline markup around split words', () => {
        const element = makeElement('I build the <mark class="hl">hard part</mark>.');
        const words = splitWords(element);
        const mark = element.querySelector('mark');

        expect(mark).not.toBeNull();
        expect(mark?.textContent).toBe('hard part');
        // The marked phrase is still split, but inside the mark.
        expect(mark?.querySelectorAll('.sw')).toHaveLength(2);
        expect(words.length).toBeGreaterThan(2);
        expect(element.textContent).toBe('I build the hard part.');
    });

    it('should not split elements marked no-split', () => {
        const element = makeElement('keep <span class="no-split">this together</span>');
        const kept = element.querySelector('.no-split');

        splitWords(element);

        expect(kept?.querySelectorAll('.sw')).toHaveLength(0);
        expect(kept?.textContent).toBe('this together');
    });

    it('should return the same words on a second call rather than splitting again', () => {
        const element = makeElement('one two three');
        const first = splitWords(element);
        const second = splitWords(element);

        expect(second).toBe(first);
        expect(element.querySelectorAll('.sw')).toHaveLength(3);
    });

    it('should assign a line index per visual line and a running word index', () => {
        const element = makeElement('one two three four');
        const words = splitWords(element);

        // First two words on one line, next two wrapped onto the second.
        stubLines(words, [0, 0, 40, 40]);
        indexWords(words);

        expect(words.map(word => word.style.getPropertyValue('--li'))).toEqual(['0', '0', '1', '1']);
        expect(words.map(word => word.style.getPropertyValue('--wi'))).toEqual(['0', '1', '2', '3']);
    });

    it('should treat near-identical offsets as the same line', () => {
        const element = makeElement('a b c');
        const words = splitWords(element);

        // Sub-pixel jitter must not read as a new line.
        stubLines(words, [0, 2, 3]);
        indexWords(words);

        expect(words.map(word => word.style.getPropertyValue('--li'))).toEqual(['0', '0', '0']);
    });

    it('should re-index after wrapping changes', () => {
        const element = makeElement('one two three');
        const words = splitWords(element);

        stubLines(words, [0, 0, 0]);
        indexWords(words);

        expect(words[2]?.style.getPropertyValue('--li')).toBe('0');

        // A narrower container pushes the last word down.
        stubLines(words, [0, 0, 40]);
        indexWords(words);

        expect(words[2]?.style.getPropertyValue('--li')).toBe('1');
    });

    it('should read every offset before writing any index', () => {
        const element = makeElement('one two three');
        const words = splitWords(element);
        const calls: string[] = [];

        words.forEach((word) => {
            Object.defineProperty(word, 'offsetTop', {
                configurable: true,
                get: () => {
                    calls.push('read');

                    return 0;
                },
            });
            vi.spyOn(word.style, 'setProperty').mockImplementation(() => {
                calls.push('write');
            });
        });

        indexWords(words);

        // Interleaving would force a synchronous layout per word.
        expect(calls.indexOf('write')).toBe(words.length);
        expect(calls.lastIndexOf('read')).toBe(words.length - 1);
    });

    it('should ignore whitespace-only text nodes', () => {
        const element = makeElement('   ');
        const words = splitWords(element);

        expect(words).toHaveLength(0);
    });
});

describe('splitWords line tracking', () => {
    it('should expose a cleanup that stops re-indexing', async () => {
        const { trackWordIndices } = await import('./splitWords');
        const element = makeElement('one two');
        const words = splitWords(element);
        const stop = trackWordIndices(words);

        expect(typeof stop).toBe('function');
        expect(() => {
            stop();
        }).not.toThrow();
        expect(vi.isMockFunction(stop)).toBe(false);
    });
});
