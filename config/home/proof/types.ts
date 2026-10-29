/**
 * The shape of the proof section's words: who the work was for, what each
 * number counts, and the marquee's pause control.
 */

/** The four numbers behind the pitch; their values are in `config/proof.ts`. */
export type ProofStatId = 'since' | 'teams' | 'team-size' | 'messaging';

export interface ProofCopy {
    /** The section's heading, for screen readers only. */
    heading: string;
    /** Organizations the work was done for, in marquee order. */
    clients: string[];
    /** What each number counts. */
    stats: Record<ProofStatId, string>;
    marquee: {
        play: string;
        pause: string;
        playLabel: string;
        pauseLabel: string;
    };
}
