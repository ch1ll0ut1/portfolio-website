/**
 * Who the engagement suits and who it does not.
 *
 * Copy is lifted, lightly edited, from the unshipped `/how-i-work` page (see
 * `docs/how-i-work-content.md`, section 6). `tone` picks the list marker: a
 * caret for a fit, a struck hairline for a mismatch.
 */

export type FitTone = 'fit' | 'unfit';

export interface FitList {
    id: string;
    title: string;
    tone: FitTone;
    items: string[];
}

export interface FitContent {
    label: string;
    heading: string;
    intro: string;
    lists: [FitList, FitList];
}

export const fitContent: FitContent = {
    label: 'Fit',
    heading: 'The best work happens when expectations are honest.',
    intro: 'I work best with clients who want a serious product partner, not just a pair of hands.',
    lists: [
        {
            id: 'good-fit',
            title: 'Who I work best with',
            tone: 'fit',
            items: [
                'Founders who care about building a real product, not just a demo',
                'Businesses that need reliable custom software',
                'Teams that value UX and maintainability',
                'Clients who want technical guidance, not just code output',
                'Startups that need senior product engineering judgment',
                'Companies with broken or unfinished software that needs rescue or restructuring',
            ],
        },
        {
            id: 'not-a-fit',
            title: 'What is not a good fit',
            tone: 'unfit',
            items: [
                'Projects where the cheapest possible implementation is the main goal',
                'Clients who expect AI to replace engineering judgment',
                'Unrealistic deadlines that require sacrificing quality',
                'Micromanaged work where technical decisions are forced without discussion',
                'Projects where maintainability, UX, and long-term reliability do not matter',
            ],
        },
    ],
};
