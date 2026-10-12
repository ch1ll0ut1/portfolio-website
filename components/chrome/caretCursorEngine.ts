/**
 * The custom cursor's geometry engine.
 *
 * The cursor is one box {x, y, w, h, radius} eased toward a goal every frame.
 * Over nothing in particular the goal is a 2px caret at the pointer; over
 * something selectable it is that element's own box, so the caret appears to
 * grow into a text selection around it. Nothing here knows about any specific
 * component: elements opt in through `data-cursor`.
 *
 * Framework-agnostic on purpose — the React component owns the markup and
 * passes the nodes and the hashed class names in.
 */

import { lerp, subscribeScroll, subscribeTick } from '@/lib/motion';
import { type CursorMode, pickCursorMode } from './pickCursorMode';

const CARET_HEIGHT = 20;
const IBEAM_HEIGHT = 28;
/** Pointer-still delay before the caret starts blinking. */
const IDLE_MS = 650;

/** Near-still frames before the loop lets go of the clock. */
const SETTLE_FRAMES = 20;
const SETTLE_FRAMES_SELECTED = 90;
const STILL_EPSILON = 0.05;

/** Per-frame easing, expressed as the fraction closed in one 60fps frame. */
const EASE_CARET = 0.4;
const EASE_SELECT = 0.3;
const EASE_FILL = 0.78;
const FRAME_MS = 16.7;

export interface CaretCursorParts {
    root: HTMLElement;
    fill: HTMLElement;
    barA: HTMLElement;
    barB: HTMLElement;
    dotA: HTMLElement;
    dotB: HTMLElement;
    serifTop: HTMLElement;
    serifBottom: HTMLElement;
}

export interface CaretCursorClasses {
    /** Put on <html> so every element hides the OS cursor. */
    hasCursor: string;
    visible: string;
    native: string;
    select: string;
    ibeam: string;
    idle: string;
}

export interface CaretCursor {
    /** Re-reads what is under the pointer. Call when an overlay opens or closes. */
    refresh: () => void;
    destroy: () => void;
}

export const createCaretCursor = (parts: CaretCursorParts, classes: CaretCursorClasses): CaretCursor => {
    const { root, fill, barA, barB, dotA, dotB, serifTop, serifBottom } = parts;
    const box = { x: -100, y: -100, w: 2, h: CARET_HEIGHT, r: 1 };

    let pointerX = -100;
    let pointerY = -100;
    let visible = false;
    let pressed = false;
    let mode: CursorMode = 'caret';
    let target: Element | null = null;
    let selectAmount = 0;
    let idleTimer = 0;
    let stop: (() => void) | null = null;
    let still = 0;

    document.documentElement.classList.add(classes.hasCursor);

    const goal = () => {
        if (mode === 'select' && target?.isConnected) {
            const rect = target.getBoundingClientRect();
            const style = getComputedStyle(target);
            const inline = style.display === 'inline';
            const pad = (pressed ? 1 : 4) + (inline ? 1 : 0);
            const corner = Math.min(
                parseFloat(style.borderTopLeftRadius) || (inline ? 3 : 4),
                (rect.height + pad * 2) / 2,
            );

            return {
                x: rect.left - pad,
                y: rect.top - pad,
                w: rect.width + pad * 2,
                h: rect.height + pad * 2,
                r: corner + pad * (corner > 6 ? 1 : 0),
            };
        }

        const height = mode === 'text' ? IBEAM_HEIGHT : CARET_HEIGHT;

        return { x: pointerX - 1, y: pointerY - height / 2, w: 2, h: height, r: 1 };
    };

    const paint = (delta: number) => {
        const next = goal();
        // The I-beam snaps: easing it would make the caret feel like it lags
        // behind the text it is pointing at.
        const k = mode === 'text'
            ? 1
            : 1 - Math.pow(1 - (mode === 'select' ? EASE_SELECT : EASE_CARET), delta / FRAME_MS);

        let moved = 0;

        for (const key of ['x', 'y', 'w', 'h', 'r'] as const) {
            const value = lerp(box[key], next[key], k);

            moved += Math.abs(value - box[key]);
            box[key] = value;
        }

        const fillGoal = lerp(selectAmount, mode === 'select' ? 1 : 0, 1 - Math.pow(EASE_FILL, delta / FRAME_MS));

        moved += Math.abs(fillGoal - selectAmount);
        selectAmount = fillGoal;

        const { x, y, w, h, r } = box;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scaleY = (h / CARET_HEIGHT).toFixed(3);
        const amount = selectAmount.toFixed(3);

        fill.style.opacity = amount;
        fill.style.clipPath = `inset(${y.toFixed(1)}px ${(width - x - w).toFixed(1)}px ${(height - y - h).toFixed(1)}px ${x.toFixed(1)}px round ${r.toFixed(1)}px)`;
        barA.style.transform = `translate3d(${(x - 1 + (1 - selectAmount)).toFixed(1)}px, ${y.toFixed(1)}px, 0) scaleY(${scaleY})`;
        barB.style.transform = `translate3d(${(x + w - 1).toFixed(1)}px, ${y.toFixed(1)}px, 0) scaleY(${scaleY})`;
        barB.style.opacity = amount;
        dotA.style.transform = `translate3d(${(x - 4).toFixed(1)}px, ${(y - 7).toFixed(1)}px, 0) scale(${amount})`;
        dotB.style.transform = `translate3d(${(x + w - 4).toFixed(1)}px, ${(y + h - 1).toFixed(1)}px, 0) scale(${amount})`;
        serifTop.style.transform = `translate3d(${(x - 3).toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        serifBottom.style.transform = `translate3d(${(x - 3).toFixed(1)}px, ${(y + h - 2).toFixed(1)}px, 0)`;

        // Settled: hand the clock back rather than burning frames on a cursor
        // that is already where it wants to be.
        still = moved < STILL_EPSILON ? still + 1 : 0;

        if (still > (mode === 'select' ? SETTLE_FRAMES_SELECTED : SETTLE_FRAMES)) {
            stop?.();
            stop = null;
        }
    };

    const kick = () => {
        still = 0;
        stop ??= subscribeTick((_now, delta) => {
            paint(delta);
        });
    };

    const setMode = (next: CursorMode, nextTarget: Element | null) => {
        if (next === mode && nextTarget === target) {
            return;
        }

        mode = next;
        target = nextTarget;
        root.classList.toggle(classes.native, next === 'native');
        root.classList.toggle(classes.select, next === 'select' || next === 'block');
        root.classList.toggle(classes.ibeam, next === 'text');
        root.classList.remove(classes.idle);
        kick();
    };

    const show = (next: boolean) => {
        visible = next;
        root.classList.toggle(classes.visible, next);
    };

    const markIdle = () => {
        window.clearTimeout(idleTimer);
        root.classList.remove(classes.idle);
        idleTimer = window.setTimeout(() => {
            if (mode !== 'select') {
                root.classList.add(classes.idle);
            }
        }, IDLE_MS);
    };

    const update = (element: Element | null) => {
        const picked = pickCursorMode(element);

        setMode(picked.mode, picked.target);
    };

    const fromEvent = (event: Event) => {
        update(event.target instanceof Element ? event.target : null);
    };

    const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') {
            show(false);

            return;
        }

        if (!visible) {
            // First sighting: start the box at the pointer so it does not fly in.
            box.x = event.clientX - 1;
            box.y = event.clientY - CARET_HEIGHT / 2;
            show(true);
        }

        pointerX = event.clientX;
        pointerY = event.clientY;
        fromEvent(event);
        markIdle();
        kick();
    };

    const onPointerOver = (event: PointerEvent) => {
        if (event.pointerType === 'mouse') {
            fromEvent(event);
        }
    };

    const onPointerOut = (event: PointerEvent) => {
        if (!event.relatedTarget) {
            show(false);
        }
    };

    const onLeave = () => {
        show(false);
    };

    const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType === 'mouse') {
            pressed = true;
            kick();
        }
    };

    const onPointerUp = () => {
        pressed = false;
        kick();
    };

    const refresh = () => {
        if (!visible) {
            return;
        }

        update(document.elementFromPoint(pointerX, pointerY));
        kick();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('blur', onLeave);
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    // Scrolling moves the page under a stationary pointer, so what is hovered
    // can change without any pointer event at all.
    const unsubscribeScroll = subscribeScroll(refresh);

    return {
        refresh,
        destroy: () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('blur', onLeave);
            document.removeEventListener('pointerover', onPointerOver);
            document.removeEventListener('pointerout', onPointerOut);
            document.removeEventListener('mouseleave', onLeave);
            unsubscribeScroll();
            window.clearTimeout(idleTimer);
            stop?.();
            stop = null;
            document.documentElement.classList.remove(classes.hasCursor);
        },
    };
};
