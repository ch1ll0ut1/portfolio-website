/**
 * Tests for the "is the user typing" guard.
 *
 * Every single-letter shortcut depends on this, so each kind of editable
 * target gets its own case.
 */

import { describe, expect, it } from 'vitest';
import { isEditingTarget } from './isEditingTarget';

const element = (html: string) => {
    const host = document.createElement('div');

    host.innerHTML = html;

    return host.firstElementChild;
};

describe('isEditingTarget', () => {
    it('should report a text input', () => {
        expect(isEditingTarget(element('<input type="text">'))).toBe(true);
    });

    it('should report a textarea', () => {
        expect(isEditingTarget(element('<textarea></textarea>'))).toBe(true);
    });

    it('should report a select', () => {
        expect(isEditingTarget(element('<select></select>'))).toBe(true);
    });

    it('should report a contenteditable element', () => {
        const node = document.createElement('div');

        node.contentEditable = 'true';
        // jsdom does not implement isContentEditable from the attribute.
        Object.defineProperty(node, 'isContentEditable', { value: true });

        expect(isEditingTarget(node)).toBe(true);
    });

    it('should not report a plain element', () => {
        expect(isEditingTarget(element('<div>text</div>'))).toBe(false);
    });

    it('should not report a button', () => {
        expect(isEditingTarget(element('<button type="button">go</button>'))).toBe(false);
    });

    it('should not report a missing target', () => {
        expect(isEditingTarget(null)).toBe(false);
    });
});
