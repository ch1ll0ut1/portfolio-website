/**
 * Tests for the custom cursor's engine: when it shows, which shape it takes
 * over what, where it is drawn, and when it hands the clock back.
 *
 * Runs on the real shared ticker with hand-cranked frames. jsdom has no
 * PointerEvent, so pointer events are mouse events carrying a `pointerType`.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installAnimationFrames } from '@/test/animationFrames';
import { stubRect } from '@/test/motionEnv';
import { type CaretCursor, type CaretCursorParts, createCaretCursor } from './caretCursorEngine';

const CLASSES = {
    hasCursor: 'has-cursor',
    visible: 'is-visible',
    native: 'is-native',
    select: 'is-select',
    ibeam: 'is-ibeam',
    idle: 'is-idle',
};

interface PointerInit {
    x?: number;
    y?: number;
    pointerType?: string;
    relatedTarget?: EventTarget | null;
}

const pointer = (type: string, target: EventTarget, { x = 0, y = 0, pointerType = 'mouse', relatedTarget = null }: PointerInit = {}) => {
    const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, relatedTarget });

    Object.defineProperty(event, 'pointerType', { value: pointerType });
    target.dispatchEvent(event);
};

/** The x and y of the first `translate3d` in an element's transform. */
const translateOf = (element: HTMLElement) => {
    const match = /translate3d\((-?[\d.]+)px, (-?[\d.]+)px/.exec(element.style.transform);

    return match ? { x: Number(match[1]), y: Number(match[2]) } : null;
};

const scaleYOf = (element: HTMLElement) => Number(/scaleY\(([\d.]+)\)/.exec(element.style.transform)?.[1]);

describe('createCaretCursor', () => {
    let frames: ReturnType<typeof installAnimationFrames>;
    let parts: CaretCursorParts;
    let cursor: CaretCursor;
    let page: HTMLElement;
    let button: HTMLButtonElement;
    let editable: HTMLElement;
    let field: HTMLInputElement;

    const part = () => {
        const element = document.createElement('div');

        document.body.append(element);

        return element;
    };

    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
        frames = installAnimationFrames();

        page = document.createElement('p');
        button = document.createElement('button');
        editable = document.createElement('span');
        field = document.createElement('input');
        editable.setAttribute('contenteditable', 'true');
        document.body.append(page, button, editable, field);
        stubRect(button, { left: 100, top: 50, width: 80, height: 30, right: 180, bottom: 80 });

        parts = {
            root: part(),
            fill: part(),
            barA: part(),
            barB: part(),
            dotA: part(),
            dotB: part(),
            serifTop: part(),
            serifBottom: part(),
        };
        cursor = createCaretCursor(parts, CLASSES);
    });

    afterEach(() => {
        cursor.destroy();
        frames.restore();
        vi.useRealTimers();
        Reflect.deleteProperty(document, 'elementFromPoint');
        document.body.replaceChildren();
    });

    it('should hide the OS cursor page-wide for as long as it exists', () => {
        expect(document.documentElement).toHaveClass(CLASSES.hasCursor);

        cursor.destroy();

        expect(document.documentElement).not.toHaveClass(CLASSES.hasCursor);
    });

    it('should appear for a mouse and stay hidden for touch and pen', () => {
        pointer('pointermove', page, { pointerType: 'touch', x: 10, y: 10 });

        expect(parts.root).not.toHaveClass(CLASSES.visible);

        pointer('pointermove', page, { x: 10, y: 10 });

        expect(parts.root).toHaveClass(CLASSES.visible);

        pointer('pointermove', page, { pointerType: 'pen', x: 10, y: 10 });

        expect(parts.root).not.toHaveClass(CLASSES.visible);
    });

    it('should draw a caret centred on the pointer from the first frame, without flying in', () => {
        pointer('pointermove', page, { x: 300, y: 200 });
        frames.step();

        // The caret is 2px wide and 20px tall, its box starting 1px left of the pointer.
        expect(translateOf(parts.barA)).toEqual({ x: 299, y: 190 });
        expect(scaleYOf(parts.barA)).toBe(1);
    });

    it('should follow the pointer with easing rather than jumping', () => {
        pointer('pointermove', page, { x: 0, y: 100 });
        frames.step(30);
        pointer('pointermove', page, { x: 200, y: 100 });
        frames.step();

        const first = translateOf(parts.barA)?.x ?? 0;

        expect(first).toBeGreaterThan(0);
        expect(first).toBeLessThan(199);

        frames.step(60);

        expect(translateOf(parts.barA)?.x).toBeCloseTo(199, 0);
    });

    it('should grow into a selection box around a button', () => {
        pointer('pointermove', button, { x: 120, y: 60 });
        frames.step(120);

        expect(parts.root).toHaveClass(CLASSES.select);
        expect(Number(parts.fill.style.opacity)).toBeCloseTo(1, 2);
        // The box wraps the button with 4px of padding on every side.
        expect(translateOf(parts.fill)).toEqual({ x: 96, y: 46 });
        expect(parts.fill.style.width).toBe('88px');
        expect(parts.fill.style.height).toBe('38px');
    });

    it('should tighten the selection box while the button is pressed', () => {
        pointer('pointermove', button, { x: 120, y: 60 });
        frames.step(120);
        pointer('pointerdown', button, { x: 120, y: 60 });
        frames.step(120);

        expect(parts.fill.style.width).toBe('82px');

        pointer('pointerup', button, { x: 120, y: 60 });
        frames.step(120);

        expect(parts.fill.style.width).toBe('88px');
    });

    it('should snap to a taller I-beam over editable text', () => {
        pointer('pointermove', editable, { x: 50, y: 50 });
        frames.step();

        expect(parts.root).toHaveClass(CLASSES.ibeam);
        expect(scaleYOf(parts.barA)).toBeCloseTo(28 / 20, 3);
        expect(translateOf(parts.barA)).toEqual({ x: 49, y: 36 });
    });

    it('should give way to the native cursor over a form field', () => {
        pointer('pointermove', field, { x: 50, y: 50 });

        expect(parts.root).toHaveClass(CLASSES.native);

        pointer('pointermove', page, { x: 50, y: 50 });

        expect(parts.root).not.toHaveClass(CLASSES.native);
    });

    it('should start blinking once the pointer rests, but not while selecting', () => {
        pointer('pointermove', page, { x: 50, y: 50 });
        vi.advanceTimersByTime(700);

        expect(parts.root).toHaveClass(CLASSES.idle);

        pointer('pointermove', page, { x: 60, y: 50 });

        expect(parts.root).not.toHaveClass(CLASSES.idle);

        pointer('pointermove', button, { x: 120, y: 60 });
        vi.advanceTimersByTime(700);

        expect(parts.root).not.toHaveClass(CLASSES.idle);
    });

    it('should hide when the pointer leaves the window', () => {
        pointer('pointermove', page, { x: 50, y: 50 });
        pointer('pointerout', page, { relatedTarget: null });

        expect(parts.root).not.toHaveClass(CLASSES.visible);

        pointer('pointermove', page, { x: 50, y: 50 });
        window.dispatchEvent(new Event('blur'));

        expect(parts.root).not.toHaveClass(CLASSES.visible);
    });

    it('should stay visible when the pointer moves between elements', () => {
        pointer('pointermove', page, { x: 50, y: 50 });
        pointer('pointerout', page, { relatedTarget: button });

        expect(parts.root).toHaveClass(CLASSES.visible);
    });

    it('should hand the clock back once it has settled', () => {
        pointer('pointermove', page, { x: 50, y: 50 });
        frames.step(40);

        expect(frames.pending()).toBe(false);
    });

    it('should re-read what is under a still pointer on refresh', () => {
        pointer('pointermove', page, { x: 120, y: 60 });
        Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => button });

        cursor.refresh();

        expect(parts.root).toHaveClass(CLASSES.select);
    });

    it('should ignore refresh while it is hidden', () => {
        const lookup = vi.fn(() => button);

        Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: lookup });
        cursor.refresh();

        expect(lookup).not.toHaveBeenCalled();
        expect(parts.root).not.toHaveClass(CLASSES.select);
    });

    it('should stop listening once destroyed', () => {
        cursor.destroy();
        pointer('pointermove', page, { x: 50, y: 50 });

        expect(parts.root).not.toHaveClass(CLASSES.visible);
    });
});
