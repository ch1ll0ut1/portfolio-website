/**
 * Geometry for the career graph.
 *
 * Framework-agnostic on purpose: the component measures the rows, hands the
 * numbers in here, and gets back SVG path strings plus a y → x lookup. No DOM
 * is touched except by `measureRows`, and nothing here knows about React or
 * about CSS Module class names.
 *
 * The graph is two lanes. `indie` runs straight down from the newest commit to
 * the fork, then bends into the `main` lane with a cubic Bézier. `main` runs
 * straight down from its branch tip to the root commit.
 */

import type { CareerBranch } from '@/config/career';

/** Rows carry their branch in a plain attribute, so no hashed class name is needed. */
const BRANCH_ATTRIBUTE = 'data-branch';
/** The row element whose vertical centre a commit node lines up with. */
export const ANCHOR_SELECTOR = '[data-graph-anchor]';

/** Radius of a commit node, in graph units. */
export const NODE_RADIUS = 5.5;
/** Distance from the left edge to the centre of the `main` lane. */
const LANE_INSET = 9;
/** Lane width fallback, matching `--log-lane` in `Experience.module.css`. */
export const DEFAULT_LANE = 26;
/** Bézier handle length as a fraction of the fork's vertical drop. */
const CURVE_TENSION = 0.62;
/** Samples taken along the fork curve to build the y → x lookup. */
const LOOKUP_SAMPLES = 80;

/** Horizontal centre of each lane, in graph units. */
export interface Lanes {
    main: number;
    indie: number;
}

export interface RowMeasurement {
    branch: CareerBranch;
    /** Vertical centre of the row's anchor, relative to the log's top edge. */
    center: number;
}

export interface GraphNode {
    x: number;
    y: number;
    branch: CareerBranch;
}

/** y → x samples along the ink route, ascending in y. */
export type LaneLookup = { y: number; x: number }[];

export interface GraphGeometry {
    nodes: GraphNode[];
    /** viewBox width, which has to match the rendered pixel width 1:1. */
    width: number;
    /** viewBox height, which has to match the log's pixel height 1:1. */
    height: number;
    /** `d` of the indie lane. Empty when nothing is on that branch. */
    indiePath: string;
    /** `d` of the main lane. Empty when nothing is on that branch. */
    mainPath: string;
    lookup: LaneLookup;
    /** Index of the last commit on `indie`, or -1 when the log does not fork. */
    forkIndex: number;
    /** Index of the newest commit on `main`, or -1 when there is none. */
    tipIndex: number;
}

export interface GeometryOptions {
    /** Horizontal distance between the two lanes, in px. */
    lane: number;
    /** Rendered width of the graph, in px. */
    width: number;
    /** Rendered height of the log, in px. */
    height: number;
}

export const laneCenters = (lane: number): Lanes => ({
    main: LANE_INSET,
    indie: LANE_INSET + lane,
});

/**
 * The fork point: the last `indie` commit before the log drops onto `main`.
 *
 * Found by looking for the boundary rather than by trusting a flag in the data,
 * so the geometry stays correct if the history is reordered.
 */
export const findForkIndex = (rows: RowMeasurement[]) => rows.findIndex((row, index) => {
    const next = rows[index + 1]?.branch ?? null;

    return row.branch === 'indie' && next === 'main';
});

/** The main branch's tip: its newest commit, which is the fork's parent. */
export const findTipIndex = (rows: RowMeasurement[]) => rows.findIndex(row => row.branch === 'main');

/** Reads the vertical centre of every row's anchor, relative to the container. */
export const measureRows = (rows: (HTMLElement | null)[], container: HTMLElement): RowMeasurement[] => {
    const base = container.getBoundingClientRect().top;
    const measurements: RowMeasurement[] = [];

    for (const row of rows) {
        if (!row) {
            continue;
        }

        const anchor = row.querySelector(ANCHOR_SELECTOR) ?? row;
        const rect = anchor.getBoundingClientRect();

        measurements.push({
            branch: row.getAttribute(BRANCH_ATTRIBUTE) === 'indie' ? 'indie' : 'main',
            center: rect.top - base + rect.height / 2,
        });
    }

    return measurements;
};

/** Builds the paths, nodes and lookup for one set of row measurements. */
export const buildGeometry = (rows: RowMeasurement[], options: GeometryOptions): GraphGeometry | null => {
    const lanes = laneCenters(options.lane);
    const nodes: GraphNode[] = rows.map(row => ({
        x: lanes[row.branch],
        y: row.center,
        branch: row.branch,
    }));
    const top = nodes[0];
    const root = nodes.at(-1);

    if (top === undefined || root === undefined) {
        return null;
    }

    const forkIndex = findForkIndex(rows);
    const tipIndex = findTipIndex(rows);
    const width = options.width > 0 ? options.width : lanes.indie + NODE_RADIUS * 2;
    const height = options.height > 0 ? options.height : 1;

    const fork = nodes[forkIndex];
    const tip = nodes[tipIndex];

    // No fork: the whole history is one straight lane.
    if (fork === undefined || tip === undefined) {
        const straight = `M ${round(top.x)} ${round(top.y)} V ${round(root.y)}`;

        return {
            nodes,
            width,
            height,
            indiePath: top.branch === 'indie' ? straight : '',
            mainPath: top.branch === 'main' ? straight : '',
            lookup: [{ y: top.y, x: top.x }, { y: root.y, x: top.x }],
            forkIndex,
            tipIndex,
        };
    }

    const bend = (tip.y - fork.y) * CURVE_TENSION;
    const handles = {
        from: { x: lanes.indie, y: fork.y + bend },
        to: { x: lanes.main, y: tip.y - bend },
    };

    return {
        nodes,
        width,
        height,
        indiePath: [
            `M ${round(lanes.indie)} ${round(top.y)}`,
            `V ${round(fork.y)}`,
            `C ${round(handles.from.x)} ${round(handles.from.y)},`,
            `${round(handles.to.x)} ${round(handles.to.y)},`,
            `${round(lanes.main)} ${round(tip.y)}`,
        ].join(' '),
        mainPath: `M ${round(lanes.main)} ${round(tip.y)} V ${round(root.y)}`,
        lookup: buildLookup({ top, fork, tip, root, lanes, handles }),
        forkIndex,
        tipIndex,
    };
};

/**
 * Horizontal position of the ink route at a given y.
 *
 * Linear interpolation between samples is enough: the curve is sampled finely
 * and the write head only has to look like it is riding the line.
 */
export const xAt = (lookup: LaneLookup, y: number) => {
    const first = lookup[0];

    if (first === undefined) {
        return 0;
    }

    if (y <= first.y) {
        return first.x;
    }

    let from = first;

    for (const to of lookup.slice(1)) {
        if (y <= to.y) {
            const span = to.y - from.y;

            return from.x + (to.x - from.x) * (span === 0 ? 0 : (y - from.y) / span);
        }

        from = to;
    }

    return from.x;
};

interface LookupInput {
    top: GraphNode;
    fork: GraphNode;
    tip: GraphNode;
    root: GraphNode;
    lanes: Lanes;
    handles: { from: { x: number; y: number }; to: { x: number; y: number } };
}

/**
 * Samples the whole ink route into a y → x table.
 *
 * The curve's y is monotonic for this handle layout, so sampling evenly in `t`
 * yields a table that is already sorted by y.
 */
const buildLookup = ({ top, fork, tip, root, lanes, handles }: LookupInput): LaneLookup => {
    const lookup: LaneLookup = [
        { y: top.y, x: lanes.indie },
        { y: fork.y, x: lanes.indie },
    ];

    for (let step = 1; step <= LOOKUP_SAMPLES; step++) {
        const t = step / LOOKUP_SAMPLES;

        lookup.push({
            y: cubicAt(fork.y, handles.from.y, handles.to.y, tip.y, t),
            x: cubicAt(lanes.indie, handles.from.x, handles.to.x, lanes.main, t),
        });
    }

    lookup.push({ y: root.y, x: lanes.main });

    return lookup;
};

const cubicAt = (p0: number, p1: number, p2: number, p3: number, t: number) => {
    const u = 1 - t;

    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};

/** Keeps path strings short without visibly moving anything. */
const round = (value: number) => Math.round(value * 100) / 100;
