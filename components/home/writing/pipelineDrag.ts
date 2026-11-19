/**
 * Dragging the pipeline nodes (fine pointers only).
 *
 * Positions live in the `--x` / `--y` custom properties the node renders with,
 * so a drag stays off the React render path entirely: the gesture writes the
 * two properties and asks for a fresh edge layout.
 *
 * A draggable node also opts into the page cursor's selection box through
 * `data-cursor`, since the custom cursor hides the OS one and `cursor: grab`
 * alone would signal nothing.
 */

import { clamp } from '@/lib/motion';
import { type PipelineClasses } from './pipelineSpec';

/** Keeps a dragged node inside the canvas; the status line runs along the bottom. */
const PAD = 4;
const PAD_BOTTOM = 22;

export interface DragOptions {
    node: HTMLElement;
    /** The positioned container the node is clamped to. */
    canvas: HTMLElement;
    classes: PipelineClasses;
    /** Called on every move, so the edges follow the node. */
    layout: () => void;
}

/** Makes one node draggable. Returns a teardown. */
export const makeDraggable = ({ node, canvas, classes, layout }: DragOptions) => {
    const onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        node.setPointerCapture(event.pointerId);
        node.classList.add(classes.nodeDragging);

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const grabX = event.clientX - node.offsetLeft;
        const grabY = event.clientY - node.offsetTop;

        const onPointerMove = (move: PointerEvent) => {
            const x = clamp(move.clientX - grabX, PAD, width - node.offsetWidth - PAD);
            const y = clamp(move.clientY - grabY, PAD, height - node.offsetHeight - PAD_BOTTOM);

            node.style.setProperty('--x', `${((x / width) * 100).toFixed(2)}%`);
            node.style.setProperty('--y', `${((y / height) * 100).toFixed(2)}%`);
            layout();
        };

        const onPointerUp = () => {
            node.classList.remove(classes.nodeDragging);
            node.removeEventListener('pointermove', onPointerMove);
            node.removeEventListener('pointerup', onPointerUp);
            node.removeEventListener('pointercancel', onPointerUp);
        };

        node.addEventListener('pointermove', onPointerMove);
        node.addEventListener('pointerup', onPointerUp);
        node.addEventListener('pointercancel', onPointerUp);
    };

    node.addEventListener('pointerdown', onPointerDown);
    node.setAttribute('data-cursor', 'select');

    return () => {
        node.removeEventListener('pointerdown', onPointerDown);
        node.removeAttribute('data-cursor');
        node.classList.remove(classes.nodeDragging);
    };
};
