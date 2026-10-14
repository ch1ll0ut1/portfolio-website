'use client';

import { useEffect, useState } from 'react';

/**
 * A band across the middle of the viewport. A section is "active" while it
 * crosses that band, which is what makes the nav highlight change over at the
 * point the reader's eye is, not when a section's edge touches the screen.
 */
const ROOT_MARGIN = '-45% 0px -50% 0px';

/**
 * Tracks which of the given section ids is currently crossing the viewport
 * middle.
 *
 * Returns `null` until one does, so nothing is highlighted while the reader is
 * above the first tracked section. Pass a stable array — a module-level
 * constant, or a memoised one — since changing it rebuilds the observer.
 *
 * `route` is the current pathname. The nav lives in the root layout and so
 * outlives client-side navigation: a new route means new section elements to
 * look up, and a highlight from the previous route no longer applies — not
 * even on a return to the same pathname, which renders the page afresh at the
 * top. The observer's first report for the new elements says what is in the
 * band now.
 */
export const useActiveSection = (ids: readonly string[], route: string | null) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [seenRoute, setSeenRoute] = useState(route);

    // Reset during render rather than in the effect, so the old route's
    // highlight is gone on the very render that shows the new route.
    if (route !== seenRoute) {
        setSeenRoute(route);
        setActiveId(null);
    }

    useEffect(() => {
        const targets: HTMLElement[] = [];

        for (const id of ids) {
            const target = document.getElementById(id);

            if (target) {
                targets.push(target);
            }
        }

        if (targets.length === 0) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting && entry.target instanceof HTMLElement) {
                    setActiveId(entry.target.id);
                }
            }
        }, { rootMargin: ROOT_MARGIN });

        for (const target of targets) {
            observer.observe(target);
        }

        return () => {
            observer.disconnect();
        };
    }, [ids, route]);

    return activeId;
};
