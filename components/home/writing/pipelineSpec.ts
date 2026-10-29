/**
 * What the pipeline visual is made of.
 *
 * The nodes the component renders and the class-name contract the imperative
 * modules work against. CSS Module names are hashed, so nothing below the
 * component may hard-code one — it receives this object instead.
 */

import type { PipelineNodeId } from '@/config/home/writing/types';

export interface PipelineNodeSpec {
    /** Matches the `data-node` attribute in the markup, and keys the node's label in the dictionary. */
    id: PipelineNodeId;
    /** Resting position, as a percentage of the canvas. */
    x: string;
    y: string;
    /** The approval gate carries a checkmark and the caret colour. */
    gate?: boolean;
}

/** The four stages, in the order the token visits them. */
export const pipelineNodes: PipelineNodeSpec[] = [
    { id: 'spec', x: '7%', y: '16%' },
    { id: 'research', x: '55%', y: '10%' },
    { id: 'gate', x: '24%', y: '50%', gate: true },
    { id: 'implement', x: '62%', y: '60%' },
];

/** Indices into `pipelineNodes`, and into the edges leaving each node. */
export const SPEC = 0;
export const RESEARCH = 1;
export const GATE = 2;
export const IMPLEMENT = 3;

export interface PipelineClasses {
    edge: string;
    edgeDone: string;
    edgeLive: string;
    token: string;
    tokenHalo: string;
    tokenOn: string;
    nodeRunning: string;
    nodeDone: string;
    gateWaiting: string;
    gateApproved: string;
    stateSwap: string;
    canvasDraggable: string;
    nodeDragging: string;
}
