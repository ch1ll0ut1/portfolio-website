/**
 * The shape of the work section's words: the case study cards, the "More
 * projects" index, and the few words inside the cards' illustrations.
 */

import type { CaseVisualId } from '../../caseStudies';
import type { IndexedProjectId } from '../../projectsIndex';

/** One case study's words; its name, years, tags and link target are in `config/caseStudies.ts`. */
export interface CaseStudyCopy {
    /** Role held on the project. */
    role: string;
    /** Who it was for, in one line. */
    client: string;
    problem: string;
    /** The "What I did" body. */
    did: string;
    result: string;
    /** What the outbound link says, for a case that has one. */
    linkLabel?: string;
    /** What the metric's number counts. */
    metricLabel: string;
}

export interface IndexedProjectCopy {
    name: string;
    /** One sentence on what it is. */
    description: string;
}

/** The words the case illustrations draw; file names and code stay as they are. */
export interface CaseVisualsCopy {
    edithing: {
        valid: string;
        normalizing: string;
        /** The status bar's line readout. */
        line: (line: number) => string;
    };
    bluereceipt: {
        title: string;
        /** What each of the four layers is, top to bottom. */
        layers: [string, string, string, string];
        clean: string;
        failed: string;
        checking: string;
        /** The note under the compiler error. */
        caught: string;
    };
    socialbee: {
        title: string;
        team: (size: number) => string;
        shipping: string;
        handover: string;
        lead: string;
        engineer: string;
        designer: string;
        product: string;
    };
    eko: {
        title: string;
        before: string;
        after: string;
        throughput: string;
        latency: string;
    };
}

export interface WorkCopy {
    heading: {
        title: string;
        lede: string;
    };
    /** The labels of a case card. */
    card: {
        problem: string;
        did: string;
        result: string;
        readMore: string;
        /** Completes the link's name for screen readers. */
        readMoreAbout: (title: string) => string;
    };
    cases: Record<CaseVisualId, CaseStudyCopy>;
    moreProjects: {
        title: string;
        /** The year of current work. */
        now: string;
        projects: Record<IndexedProjectId, IndexedProjectCopy>;
    };
    visuals: CaseVisualsCopy;
}
