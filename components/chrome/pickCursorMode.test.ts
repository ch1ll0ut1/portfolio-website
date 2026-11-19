/**
 * Tests for the cursor's element contract.
 *
 * This table is what leaf components rely on when they set `data-cursor`, so
 * each row of the porting guide's table gets a case — including the defaults
 * that mean a plain link needs no attribute at all.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { stubRect } from '../../test/motionEnv';
import { pickCursorMode } from './pickCursorMode';

const mount = (html: string) => {
    document.body.innerHTML = html;

    return document.body.firstElementChild;
};

describe('pickCursorMode', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should default to the caret over ordinary content', () => {
        expect(pickCursorMode(mount('<p>text</p>')).mode).toBe('caret');
    });

    it('should default to the caret with no element at all', () => {
        expect(pickCursorMode(null).mode).toBe('caret');
    });

    it('should box a link without it asking', () => {
        const link = mount('<a href="/x">x</a>');

        expect(pickCursorMode(link)).toEqual({ mode: 'select', target: link });
    });

    it('should box a button without it asking', () => {
        expect(pickCursorMode(mount('<button type="button">x</button>')).mode).toBe('select');
    });

    it('should box an element with role=button', () => {
        expect(pickCursorMode(mount('<div role="button">x</div>')).mode).toBe('select');
    });

    it('should box a label bound to a field', () => {
        expect(pickCursorMode(mount('<label for="f">x</label>')).mode).toBe('select');
    });

    it('should box the nearest selectable ancestor of the hovered node', () => {
        const link = mount('<a href="/x"><span>deep</span></a>');

        expect(pickCursorMode(link?.firstElementChild ?? null).target).toBe(link);
    });

    it('should keep the OS cursor over an input', () => {
        expect(pickCursorMode(mount('<input type="text">')).mode).toBe('native');
    });

    it('should keep the OS cursor over an iframe', () => {
        expect(pickCursorMode(mount('<iframe title="x"></iframe>')).mode).toBe('native');
    });

    it('should honour data-cursor="native"', () => {
        expect(pickCursorMode(mount('<div data-cursor="native">x</div>')).mode).toBe('native');
    });

    it('should hide itself for data-cursor="none"', () => {
        expect(pickCursorMode(mount('<div data-cursor="none">x</div>')).mode).toBe('native');
    });

    it('should morph into an I-beam for data-cursor="text"', () => {
        const node = mount('<div data-cursor="text">x</div>');

        expect(pickCursorMode(node)).toEqual({ mode: 'text', target: node });
    });

    it('should morph into an I-beam over a contenteditable element', () => {
        expect(pickCursorMode(mount('<div contenteditable="true">x</div>')).mode).toBe('text');
    });

    it('should box an element that opts in with data-cursor="select"', () => {
        expect(pickCursorMode(mount('<div data-cursor="select">x</div>')).mode).toBe('select');
    });

    it('should let data-cursor on an ancestor override the default for a link', () => {
        const wrapper = mount('<div data-cursor="caret"><a href="/x">x</a></div>');

        expect(pickCursorMode(wrapper?.firstElementChild ?? null)).toEqual({ mode: 'caret', target: null });
    });

    it('should leave the plain caret over a palette row', () => {
        expect(pickCursorMode(mount('<li role="option">x</li>')).mode).toBe('caret');
    });

    it('should recolour the caret instead of boxing an oversized card', () => {
        const card = mount('<a href="/x">card</a>');

        if (card instanceof HTMLElement) {
            stubRect(card, { width: 600, height: 400 });
        }

        expect(pickCursorMode(card).mode).toBe('block');
    });
});
