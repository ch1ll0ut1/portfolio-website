/**
 * The shape of the experience section's words: its heading and what each
 * role in the career log was.
 */

/** The decorative hash of each commit in `config/career.ts`, which keys its words. */
export type CareerHash
    = | 'f0c2a19'
      | 'e7d1b04'
      | 'c3a9f52'
      | '9d2c18e'
      | 'a4f07c3'
      | '8e5b3a7'
      | '7a1d940'
      | '6c0f2e1'
      | '5b94d6a'
      | '4e28a1f'
      | '3f7c0b2'
      | '2a0e5d9';

export interface CareerCommitCopy {
    title: string;
    description: string;
}

export interface ExperienceCopy {
    heading: {
        title: (yearsShipping: number) => string;
        lede: string;
    };
    /** Ends the year range of the current role, as in `2025–now`. */
    now: string;
    commits: Record<CareerHash, CareerCommitCopy>;
}
