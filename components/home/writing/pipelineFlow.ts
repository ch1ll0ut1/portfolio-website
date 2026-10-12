/**
 * The Command&Code card's live pipeline.
 *
 * A token runs spec.md → research → review gate → implement, waits at the gate
 * until it is approved, then loops for as long as the canvas is on screen and
 * the tab is visible. The edges are built here rather than in JSX because
 * their anchor points depend on where the node boxes actually sit, and because
 * a fine pointer can drag the nodes, which re-lays them out mid-gesture.
 *
 * Framework-agnostic on purpose: the component owns the markup and hands in
 * the (hashed) CSS Module class names.
 */

import { subscribeTick } from '@/lib/motion';
import { makeDraggable } from './pipelineDrag';
import { type Box, edgePath } from './pipelineGeometry';
import { GATE, type PipelineClasses, RESEARCH, SPEC, pipelineNodes } from './pipelineSpec';
import { type PipelineStage, buildSteps, createTimeline } from './pipelineTimeline';

const SVG_NS = 'http://www.w3.org/2000/svg';
const TOKEN_RADIUS = 3.2;
const HALO_RADIUS = 7;
/** How much of the canvas must be visible before the loop runs. */
const VISIBLE_THRESHOLD = 0.25;

export interface PipelineFlowOptions {
    /** The positioned container holding the nodes. */
    canvas: HTMLElement;
    /** Empty on arrival: every edge and the token are appended here. */
    svg: SVGSVGElement;
    /** The status readout's text element. */
    state: HTMLElement;
    classes: PipelineClasses;
    /** Renders one static frame and never starts the loop. */
    reduced: boolean;
    /** Enables node dragging. */
    fine: boolean;
    /** Fires when the loop starts or stops, so the card can pulse only while live. */
    onLiveChange?: (live: boolean) => void;
}

export interface PipelineFlow {
    /** Re-measures the nodes and redraws the edges. */
    layout: () => void;
    destroy: () => void;
}

export const createPipelineFlow = (options: PipelineFlowOptions): PipelineFlow => {
    const { canvas, svg, state, classes, reduced, fine, onLiveChange } = options;
    const nodes = collectNodes(canvas);

    if (nodes.length !== pipelineNodes.length) {
        return { layout: noop, destroy: noop };
    }

    const edges = nodes.slice(0, -1).map(() => appendShape(svg, 'path', classes.edge));
    const halo = appendShape(svg, 'circle', classes.tokenHalo);
    const token = appendShape(svg, 'circle', classes.token);
    const cleanups: (() => void)[] = [];

    halo.setAttribute('r', String(HALO_RADIUS));
    token.setAttribute('r', String(TOKEN_RADIUS));

    const layout = () => {
        svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`);

        edges.forEach((edge, index) => {
            edge.setAttribute('d', edgePath(boxOf(nodes[index]), boxOf(nodes[index + 1])));
        });
    };

    let label = '';

    const stage: PipelineStage = {
        classes,
        setNode: (index, className) => {
            const node = nodes[index];

            node.classList.remove(classes.nodeRunning, classes.nodeDone, classes.gateWaiting, classes.gateApproved);

            if (className !== undefined) {
                node.classList.add(className);
            }
        },
        setEdge: (index, className) => {
            const edge = edges[index];

            edge.classList.remove(classes.edgeDone, classes.edgeLive);

            if (className !== undefined) {
                edge.classList.add(className);
            }
        },
        moveToken: (index, progress) => {
            const edge = edges[index];
            const point = edge.getPointAtLength(edge.getTotalLength() * progress);

            for (const shape of [token, halo]) {
                shape.setAttribute('cx', point.x.toFixed(1));
                shape.setAttribute('cy', point.y.toFixed(1));
                shape.classList.add(classes.tokenOn);
            }
        },
        hideToken: () => {
            token.classList.remove(classes.tokenOn);
            halo.classList.remove(classes.tokenOn);
        },
        say: (text) => {
            if (text === label) {
                return;
            }

            label = text;
            state.textContent = text;

            if (reduced) {
                return;
            }

            // Restart the swap animation: drop the class, force a paint, re-add it.
            state.classList.remove(classes.stateSwap);
            state.getBoundingClientRect();
            state.classList.add(classes.stateSwap);
        },
        reset: () => {
            nodes.forEach((_, index) => {
                stage.setNode(index);
            });
            edges.forEach((_, index) => {
                stage.setEdge(index);
            });
            stage.hideToken();
        },
    };

    layout();
    cleanups.push(observeResize(canvas, layout));

    if (fine) {
        canvas.classList.add(classes.canvasDraggable);
        nodes.forEach((node) => {
            cleanups.push(makeDraggable({ node, canvas, classes, layout }));
        });
    }

    const destroy = () => {
        cleanups.forEach((cleanup) => {
            cleanup();
        });
        canvas.classList.remove(classes.canvasDraggable);
        svg.replaceChildren();
    };

    if (reduced) {
        // One still frame of the most telling moment: work done, waiting at the gate.
        stage.setNode(SPEC, classes.nodeDone);
        stage.setNode(RESEARCH, classes.nodeDone);
        stage.setNode(GATE, classes.gateWaiting);
        stage.setEdge(SPEC, classes.edgeDone);
        stage.setEdge(RESEARCH, classes.edgeDone);
        stage.say('review gate: waiting');

        return { layout, destroy };
    }

    const timeline = createTimeline(buildSteps(stage));

    let stop: (() => void) | null = null;
    let onScreen = false;
    let live = false;

    const sync = () => {
        const shouldRun = onScreen && !document.hidden;

        if (shouldRun && !stop) {
            stop = subscribeTick((_now, delta) => {
                timeline.advance(delta);
            });
        }
        else if (!shouldRun && stop) {
            stop();
            stop = null;
        }

        if (shouldRun !== live) {
            live = shouldRun;
            onLiveChange?.(shouldRun);
        }
    };

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            onScreen = entry.isIntersecting;
        }

        sync();
    }, { threshold: VISIBLE_THRESHOLD });

    observer.observe(canvas);
    document.addEventListener('visibilitychange', sync);

    cleanups.push(() => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', sync);
        stop?.();
        onLiveChange?.(false);
    });

    return { layout, destroy };
};

const noop = () => undefined;

const collectNodes = (canvas: HTMLElement) => {
    const found = new Map<string, HTMLElement>();

    for (const element of canvas.querySelectorAll<HTMLElement>('[data-node]')) {
        const id = element.dataset.node;

        if (id !== undefined) {
            found.set(id, element);
        }
    }

    const ordered: HTMLElement[] = [];

    for (const spec of pipelineNodes) {
        const element = found.get(spec.id);

        if (element) {
            ordered.push(element);
        }
    }

    return ordered;
};

const appendShape = <K extends keyof SVGElementTagNameMap>(svg: SVGSVGElement, name: K, className: string) => {
    const shape = document.createElementNS(SVG_NS, name);

    shape.setAttribute('class', className);
    svg.appendChild(shape);

    return shape;
};

const boxOf = (node: HTMLElement): Box => ({
    x: node.offsetLeft,
    y: node.offsetTop,
    w: node.offsetWidth,
    h: node.offsetHeight,
});

const observeResize = (canvas: HTMLElement, layout: () => void) => {
    if (typeof ResizeObserver === 'undefined') {
        return noop;
    }

    const observer = new ResizeObserver(() => {
        layout();
    });

    observer.observe(canvas);

    return () => {
        observer.disconnect();
    };
};
