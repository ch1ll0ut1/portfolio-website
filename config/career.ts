/**
 * The career history, rendered as a `git log --graph`.
 *
 * Ordered newest first, the way `git log` prints. The list is one history with
 * two lanes: independent work since 2020 sits on the `indie` branch, which
 * forks off `main` at the commit flagged `isFork`. Everything below the fork is
 * the employed track on `main`, down to the commit flagged `isRoot`.
 *
 * The hashes are decorative, but they are fixed strings rather than generated
 * ones so the scramble animation always settles to the same value. They also
 * key each role's title and description in `config/home/experience/`.
 */

import type { Locale } from '@/lib/i18n/locale';
import { experienceCopy } from './home/experience';
import type { CareerHash } from './home/experience/types';

export type CareerBranch = 'indie' | 'main';

export interface CommitRef {
    /** Text of the ref chip shown before the title, e.g. `HEAD → indie`. */
    label: string;
    /** HEAD refs are drawn in the caret color. */
    isHead: boolean;
}

export interface CareerCommit {
    /** Seven hex characters, like an abbreviated git hash. */
    hash: CareerHash;
    /** Year range of the role, e.g. `2013–2015`. */
    years: string;
    title: string;
    description: string;
    branch: CareerBranch;
    /** Ref chip rendered before the title. */
    ref?: CommitRef;
    /** The last commit on `indie`: where the branch leaves `main`. */
    isFork?: boolean;
    /** The oldest commit in the log. */
    isRoot?: boolean;
}

/**
 * A commit apart from its words. The current role's range ends in a bare
 * dash, which `careerFor` closes with the dictionary's word for now.
 */
type CareerCommitData = Omit<CareerCommit, 'title' | 'description'>;

const commits: CareerCommitData[] = [
    {
        hash: 'f0c2a19',
        years: '2025–',
        branch: 'indie',
        ref: { label: 'HEAD → indie', isHead: true },
    },
    {
        hash: 'e7d1b04',
        years: '2023–2025',
        branch: 'indie',
    },
    {
        hash: 'c3a9f52',
        years: '2022–2023',
        branch: 'indie',
    },
    {
        hash: '9d2c18e',
        years: '2021–2022',
        branch: 'indie',
    },
    {
        hash: 'a4f07c3',
        years: '2021',
        branch: 'indie',
    },
    {
        hash: '8e5b3a7',
        years: '2020–2021',
        branch: 'indie',
        isFork: true,
    },
    {
        hash: '7a1d940',
        years: '2018–2020',
        branch: 'main',
        ref: { label: 'main', isHead: false },
    },
    {
        hash: '6c0f2e1',
        years: '2017–2018',
        branch: 'main',
    },
    {
        hash: '5b94d6a',
        years: '2015–2017',
        branch: 'main',
    },
    {
        hash: '4e28a1f',
        years: '2013–2015',
        branch: 'main',
    },
    {
        hash: '3f7c0b2',
        years: '2011–2013',
        branch: 'main',
    },
    {
        hash: '2a0e5d9',
        years: '2008–2011',
        branch: 'main',
        isRoot: true,
    },
];

/** The log, newest first, told in `locale`. */
export const careerFor = (locale: Locale): CareerCommit[] => {
    const { now, commits: words } = experienceCopy[locale];

    return commits.map(commit => ({
        ...commit,
        years: commit.years.endsWith('–') ? `${commit.years}${now}` : commit.years,
        ...words[commit.hash],
    }));
};
