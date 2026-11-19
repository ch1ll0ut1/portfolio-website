/**
 * Edge geometry for the pipeline visual.
 *
 * Pure number work, kept apart from the DOM so the curve logic can be reasoned
 * about (and tested) on its own: given two boxes, leave from the side that
 * faces the target and enter on the side that faces the source, then bend the
 * Bézier handles out along that side.
 */

export interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface Anchor {
    x: number;
    y: number;
    /** True when the edge leaves or enters through a vertical side. */
    horizontal: boolean;
}

/** Shortest control-point reach, so touching boxes still get a curve. */
const MIN_REACH = 18;
/** Bias towards the left/right sides: a mostly sideways run uses them. */
const SIDE_BIAS = 0.55;

const centerX = (box: Box) => box.x + box.w / 2;
const centerY = (box: Box) => box.y + box.h / 2;

/** Picks the point on `box` facing a target that lies `dx`/`dy` away. */
export const anchorOn = (box: Box, dx: number, dy: number): Anchor => {
    if (Math.abs(dx) * SIDE_BIAS > Math.abs(dy)) {
        return { x: box.x + (dx > 0 ? box.w : 0), y: centerY(box), horizontal: true };
    }

    return { x: centerX(box), y: box.y + (dy > 0 ? box.h : 0), horizontal: false };
};

/** The `d` attribute of a curved edge running from one box to the next. */
export const edgePath = (from: Box, to: Box) => {
    const dx = centerX(to) - centerX(from);
    const dy = centerY(to) - centerY(from);
    const start = anchorOn(from, dx, dy);
    const end = anchorOn(to, -dx, -dy);
    const span = start.horizontal ? Math.abs(end.x - start.x) : Math.abs(end.y - start.y);
    const reach = Math.max(MIN_REACH, span * 0.5);
    const first = start.horizontal
        ? `${start.x + Math.sign(dx) * reach} ${start.y}`
        : `${start.x} ${start.y + Math.sign(dy) * reach}`;
    const second = end.horizontal
        ? `${end.x - Math.sign(dx) * reach} ${end.y}`
        : `${end.x} ${end.y - Math.sign(dy) * reach}`;

    return `M ${start.x} ${start.y} C ${first}, ${second}, ${end.x} ${end.y}`;
};
