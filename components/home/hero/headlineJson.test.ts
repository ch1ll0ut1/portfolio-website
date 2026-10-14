/**
 * Tests for the panel's JSON rendering.
 *
 * The flash rule is the interesting part: the panel must draw attention to the
 * leaf that changed and to nothing else.
 */

import { describe, expect, it } from 'vitest';
import { createDoc, leafKey } from './editorModel';
import { headlineJsonLines } from './headlineJson';

const doc = () => createDoc([
    { text: 'I build the ' },
    { text: 'hard part', highlight: true },
    { text: '.' },
]);

const textOf = (lines: ReturnType<typeof headlineJsonLines>) => lines
    .map(line => line.indent + line.tokens.map(token => token.text).join(''))
    .join('\n');

describe('headlineJsonLines', () => {
    it('should render the document as parseable JSON', () => {
        expect(JSON.parse(textOf(headlineJsonLines(doc(), [])))).toEqual({
            type: 'heading',
            level: 1,
            children: [
                { text: 'I build the ' },
                { text: 'hard part', highlight: true },
                { text: '.' },
            ],
        });
    });

    it('should escape text so a quote typed into the headline stays valid JSON', () => {
        const lines = headlineJsonLines(createDoc([{ text: 'say "hi"' }]), []);

        expect(JSON.parse(textOf(lines)).children[0].text).toBe('say "hi"');
    });

    it('should emit one line per leaf', () => {
        const leafLines = headlineJsonLines(doc(), []).filter(line => line.id.startsWith('leaf-'));

        expect(leafLines).toHaveLength(3);
    });

    it('should flash nothing when there is no baseline', () => {
        expect(headlineJsonLines(doc(), []).some(line => line.flash)).toBe(false);
    });

    it('should flash only the leaves missing from the baseline', () => {
        const baseline = [leafKey({ text: 'I build the ' }), leafKey({ text: '.' })];
        const flashing = headlineJsonLines(doc(), baseline)
            .filter(line => line.flash)
            .map(line => line.tokens.map(token => token.text).join(''));

        expect(flashing).toHaveLength(1);
        expect(flashing[0]).toContain('hard part');
    });

    it('should flash no leaf when every one is already in the baseline', () => {
        const baseline = doc().children.map(leafKey);

        expect(headlineJsonLines(doc(), baseline).some(line => line.flash)).toBe(false);
    });

    it('should change a leaf line id when that leaf changes', () => {
        const before = headlineJsonLines(doc(), []);
        const after = headlineJsonLines(createDoc([{ text: 'I built the ' }]), []);

        expect(after[4]?.id).not.toBe(before[4]?.id);
    });

    it('should colour keys, strings, booleans and punctuation separately', () => {
        const kinds = new Set(headlineJsonLines(doc(), []).flatMap(line => line.tokens.map(token => token.kind)));

        expect(kinds).toEqual(new Set(['punct', 'key', 'str', 'bool']));
    });
});
