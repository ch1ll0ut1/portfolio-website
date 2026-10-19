'use client';

import { type CSSProperties, type FC, useEffect, useEffectEvent, useRef } from 'react';
import { hasFinePointer, prefersReducedMotion, useStageEvent } from '@/lib/motion';
import { type PipelineFlow, createPipelineFlow } from './pipelineFlow';
import { type PipelineClasses, type PipelineNodeSpec, pipelineNodes } from './pipelineSpec';
import styles from './PipelineCanvas.module.css';

interface Props {
    /** Fires when the loop starts or stops, so the card can pulse only while live. */
    onLiveChange?: (live: boolean) => void;
}

interface NodePosition extends CSSProperties {
    '--x': string;
    '--y': string;
}

/** Hashed class names handed to the imperative engine, which must not know them. */
const classes: PipelineClasses = {
    edge: styles.edge,
    edgeDone: styles.edgeDone,
    edgeLive: styles.edgeLive,
    token: styles.token,
    tokenHalo: styles.tokenHalo,
    tokenOn: styles.tokenOn,
    nodeRunning: styles.nodeRunning,
    nodeDone: styles.nodeDone,
    gateWaiting: styles.gateWaiting,
    gateApproved: styles.gateApproved,
    stateSwap: styles.stateSwap,
    canvasDraggable: styles.draggable,
    nodeDragging: styles.dragging,
};

/**
 * Thin wrapper around the pipeline engine.
 *
 * Renders the nodes and the status readout and owns nothing else: the edges,
 * the token, the loop and the drag gestures all live in `pipelineFlow`, which
 * is handed this module's class names. Decorative, so the whole canvas is
 * hidden from assistive technology.
 */
export const PipelineCanvas: FC<Props> = ({ onLiveChange }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const stateRef = useRef<HTMLSpanElement>(null);
    const flowRef = useRef<PipelineFlow | null>(null);
    const liveChanged = useEffectEvent((live: boolean) => {
        onLiveChange?.(live);
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const svg = svgRef.current;
        const state = stateRef.current;

        if (!canvas || !svg || !state) {
            return;
        }

        const flow = createPipelineFlow({
            canvas,
            svg,
            state,
            classes,
            reduced: prefersReducedMotion(),
            fine: hasFinePointer(),
            onLiveChange: liveChanged,
        });

        flowRef.current = flow;

        return () => {
            flowRef.current = null;
            flow.destroy();
        };
    }, []);

    useStageEvent('layout', () => {
        flowRef.current?.layout();
    });

    return (
        <div className={styles.canvas} ref={canvasRef} aria-hidden="true">
            <svg className={styles.edges} ref={svgRef} />

            {pipelineNodes.map(node => (
                <span
                    className={node.gate === true ? `${styles.node} ${styles.gate}` : styles.node}
                    data-node={node.id}
                    key={node.id}
                    style={positionOf(node)}
                >
                    {node.gate === true
                        ? (
                            <svg className={styles.check} viewBox="0 0 12 12">
                                <path d="M2.5 6.4 5 8.8 9.6 3.4" />
                            </svg>
                        )
                        : null}
                    <span>{node.label}</span>
                </span>
            ))}

            <span className={styles.status}>
                <span className={styles.state} ref={stateRef}>ready</span>
            </span>
        </div>
    );
};

const positionOf = (node: PipelineNodeSpec): NodePosition => ({ '--x': node.x, '--y': node.y });
