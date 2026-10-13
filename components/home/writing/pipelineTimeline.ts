/**
 * The pipeline's narrative loop.
 *
 * Write the spec, travel, run the research agents, travel, wait at the review
 * gate, get approved, travel, implement, done — then round again. Each step
 * owns a duration and a one-off start effect; travelling steps also get a
 * per-frame callback that walks the token along their edge.
 *
 * Pure timing: it talks to the DOM only through the stage handed in.
 */

import { clamp } from '@/lib/motion';
import { GATE, IMPLEMENT, type PipelineClasses, RESEARCH, SPEC } from './pipelineSpec';

/** Time the token takes to travel one edge, in ms. */
const TRAVEL_MS = 760;

export interface PipelineStage {
    /** Applies a single state class to a node, clearing the others. */
    setNode: (index: number, className?: string) => void;
    setEdge: (index: number, className?: string) => void;
    /** Places the token at `progress` (0..1) along an edge. */
    moveToken: (index: number, progress: number) => void;
    hideToken: () => void;
    /** Updates the status readout. */
    say: (text: string) => void;
    reset: () => void;
    classes: PipelineClasses;
}

export interface Step {
    duration: number;
    onStart: () => void;
    onFrame?: (progress: number) => void;
}

export interface Timeline {
    /** Advances by `delta` ms, wrapping at the end of the loop. */
    advance: (delta: number) => void;
}

export const buildSteps = (stage: PipelineStage): Step[] => {
    const { classes } = stage;
    const travel = (index: number): Step => ({
        duration: TRAVEL_MS,
        onStart: () => { stage.setEdge(index, classes.edgeLive); },
        onFrame: (progress) => { stage.moveToken(index, easeInOut(progress)); },
    });

    return [
        {
            duration: 500,
            onStart: () => {
                stage.reset();
                stage.setNode(SPEC, classes.nodeRunning);
                stage.say('writing spec.md');
            },
        },
        { duration: 120, onStart: () => { stage.setNode(SPEC, classes.nodeDone); } },
        travel(SPEC),
        {
            duration: 1000,
            onStart: () => {
                stage.hideToken();
                stage.setEdge(SPEC, classes.edgeDone);
                stage.setNode(RESEARCH, classes.nodeRunning);
                stage.say('research agents running');
            },
        },
        { duration: 120, onStart: () => { stage.setNode(RESEARCH, classes.nodeDone); } },
        travel(RESEARCH),
        {
            duration: 1500,
            onStart: () => {
                stage.moveToken(RESEARCH, 1);
                stage.setEdge(RESEARCH, classes.edgeDone);
                stage.setNode(GATE, classes.gateWaiting);
                stage.say('review gate: waiting');
            },
        },
        {
            duration: 650,
            onStart: () => {
                stage.setNode(GATE, classes.gateApproved);
                stage.say('approved');
            },
        },
        travel(GATE),
        {
            duration: 1100,
            onStart: () => {
                stage.hideToken();
                stage.setEdge(GATE, classes.edgeDone);
                stage.setNode(IMPLEMENT, classes.nodeRunning);
                stage.say('implementing');
            },
        },
        {
            duration: 1700,
            onStart: () => {
                stage.setNode(IMPLEMENT, classes.nodeDone);
                stage.say('done, next task');
            },
        },
    ];
};

export const createTimeline = (steps: Step[]): Timeline => {
    const total = steps.reduce((sum, step) => sum + step.duration, 0);

    let elapsed = 0;
    let current = -1;

    const advance = (delta: number) => {
        elapsed = (elapsed + delta) % total;

        let start = 0;
        let index = 0;
        let step = steps[index];

        if (step === undefined) {
            return;
        }

        let next = steps[index + 1];

        while (next !== undefined && elapsed >= start + step.duration) {
            start += step.duration;
            index += 1;
            step = next;
            next = steps[index + 1];
        }

        if (index !== current) {
            current = index;
            step.onStart();
        }

        step.onFrame?.(clamp((elapsed - start) / step.duration, 0, 1));
    };

    return { advance };
};

/** Cubic in-out, so the token leaves and arrives softly. */
const easeInOut = (progress: number) => (progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2);
