/**
 * What the pipeline visual is made of.
 *
 * The nodes the component renders and the class-name contract the imperative
 * modules work against. CSS Module names are hashed, so nothing below the
 * component may hard-code one — it receives this object instead.
 */

export interface PipelineNodeSpec {
    /** Matches the `data-node` attribute in the markup. */
    id: string;
    label: string;
    /** Resting position, as a percentage of the canvas. */
    x: string;
    y: string;
    /** The approval gate carries a checkmark and the caret colour. */
    gate?: boolean;
}

/** The four stages, in the order the token visits them. */
export const pipelineNodes: PipelineNodeSpec[] = [
    { id: 'spec', label: 'spec.md', x: '7%', y: '16%' },
    { id: 'research', label: 'research', x: '55%', y: '10%' },
    { id: 'gate', label: 'review gate', x: '24%', y: '50%', gate: true },
    { id: 'implement', label: 'implement', x: '62%', y: '60%' },
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
