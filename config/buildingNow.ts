/**
 * The "Building now" card on the homepage.
 *
 * Copy for the project Stefan has in flight. Kept here so the writing section
 * stays markup and motion, and so the card can be updated without touching a
 * component.
 */

export interface BuildingNowProject {
    /** Small label above the title, next to the live dot. */
    label: string;
    title: string;
    description: string;
    /**
     * Optional call to action. Both fields are set together or not at all: the
     * Command&Code repo is private for now, so the card ships without a link
     * and gets one back when the repo goes public.
     */
    linkLabel?: string;
    linkHref?: string;
}

export const buildingNow: BuildingNowProject = {
    label: 'Building now',
    title: 'Command&Code',
    description: 'A desktop app that puts a visual orchestration layer on top of Claude Code: a workflow rail, approval gates on every artifact, and autonomy modes you set per step.',
};
