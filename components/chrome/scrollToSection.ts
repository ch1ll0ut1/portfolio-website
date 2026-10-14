/**
 * Takes the reader to a section id, honouring the reduced-motion preference.
 *
 * Shared by the command palette, the keyboard chords and the nav's section
 * links so all three land in the same place with the same behaviour. Focus
 * moves with the scroll: a keyboard or screen-reader user who jumps to "Work"
 * must continue from Work, not from wherever focus was left behind.
 */

import { prefersReducedMotion } from '@/lib/motion';

/** Where "top" lands when the page has no hero: the skip link's target. */
const TOP_FALLBACK_ID = 'main';

export const scrollToSection = (id: string, navigate: (href: string) => void) => {
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';

    if (id === 'top') {
        window.scrollTo({ top: 0, behavior });
        focusTarget(document.getElementById(id) ?? document.getElementById(TOP_FALLBACK_ID));

        return;
    }

    const target = document.getElementById(id);

    if (target) {
        target.scrollIntoView({ behavior });
        focusTarget(target);

        return;
    }

    // The sections only exist on the homepage, so from a reading route the
    // palette and the chords navigate there instead of doing nothing — through
    // the router, so the page is not reloaded from scratch.
    navigate(`/#${id}`);
};

/**
 * Focuses a landmark without scrolling to it a second time. Sections are not
 * focusable by default, so they are made programmatically focusable (and only
 * that: `-1` keeps them out of the Tab order).
 *
 * Also used by the nav once a client-side route change has landed, so focus
 * follows the reader onto the new page the same way.
 */
export const focusTarget = (target: HTMLElement | null) => {
    if (!target) {
        return;
    }

    if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
    }

    target.focus({ preventScroll: true });
};
