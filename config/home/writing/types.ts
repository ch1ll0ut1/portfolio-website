/**
 * The shape of the writing section's words: its heading, how the featured
 * posts are introduced, the "Building now" card and its pipeline.
 */

/** A featured post's kind and the line that sells it, in place of its excerpt. */
export interface PostHighlight {
    kind: string;
    description: string;
}

/** The four nodes of the pipeline, in the order the token visits them. */
export type PipelineNodeId = 'spec' | 'research' | 'gate' | 'implement';

/** What the pipeline's status readout says at each step of its loop. */
export interface PipelineStatusCopy {
    ready: string;
    writingSpec: string;
    researching: string;
    waiting: string;
    approved: string;
    implementing: string;
    done: string;
}

export interface WritingCopy {
    heading: {
        title: string;
        lede: string;
    };
    /** Featured posts by slug. A post without one shows its excerpt under `defaultKind`. */
    highlights: Record<string, PostHighlight | undefined>;
    defaultKind: string;
    allArticles: string;
    buildingNow: {
        /** Small label above the title, next to the live dot. */
        label: string;
        title: string;
        description: string;
    };
    pipeline: {
        nodes: Record<PipelineNodeId, string>;
        status: PipelineStatusCopy;
    };
}
