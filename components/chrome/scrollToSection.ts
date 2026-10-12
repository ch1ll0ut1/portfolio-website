/**
 * Scrolls to a section id, honouring the reduced-motion preference.
 *
 * Shared by the command palette and the keyboard chords so both land in the
 * same place with the same behaviour.
 */

import { prefersReducedMotion } from '@/lib/motion';

export const scrollToSection = (id: string) => {
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';

    if (id === 'top') {
        window.scrollTo({ top: 0, behavior });

        return;
    }

    const target = document.getElementById(id);

    if (target) {
        target.scrollIntoView({ behavior });

        return;
    }

    // The sections only exist on the homepage, so from a reading route the
    // palette and the chords navigate there instead of doing nothing.
    window.location.assign(`/#${id}`);
};
