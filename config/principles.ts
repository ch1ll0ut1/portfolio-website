/**
 * The three working principles that sit under the engagement stepper.
 *
 * Copy is lifted verbatim from the unshipped `/how-i-work` page (see
 * `docs/how-i-work-content.md`, section 2). The display number comes from the
 * list order rather than the data, so reordering cannot leave it stale.
 */

export interface Principle {
    id: string;
    /** Short label above the heading. */
    label: string;
    heading: string;
    paragraphs: [string, string];
}

export interface PrinciplesContent {
    label: string;
    principles: Principle[];
}

export const principlesContent: PrinciplesContent = {
    label: 'Working principles',
    principles: [
        {
            id: 'vision-first',
            label: 'Vision first',
            heading: 'Start with the product truth',
            paragraphs: [
                'A good project does not start with a 100-page specification. It starts with a clear understanding of who the software is for, what problem it solves, and what a successful first version should achieve.',
                'From there, I help shape the smaller decisions with you: challenging assumptions, simplifying where possible, and translating the business vision into technical and product decisions.',
            ],
        },
        {
            id: 'two-way-collaboration',
            label: 'Two-way collaboration',
            heading: 'Keep business, UX, and engineering in the same room',
            paragraphs: [
                'The client brings business knowledge, user understanding, and product goals. I bring technical judgment, architecture, UX thinking, implementation experience, and the responsibility to say when something does not make sense.',
                'That matters most when designers, stakeholders, or other developers are involved. Design decisions affect implementation. Technical constraints affect user experience. Business goals affect architecture.',
            ],
        },
        {
            id: 'refinement',
            label: 'Refinement',
            heading: 'Treat iteration as part of the craft',
            paragraphs: [
                'A first implementation makes the idea real enough to review. From there, we refine workflows, polish details, fix edge cases, and make the experience feel right.',
                'This is not failure. This is how good products are shaped.',
            ],
        },
    ],
};
