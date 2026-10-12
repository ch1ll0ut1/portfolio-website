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
 */
export const useActiveSection = (ids: readonly string[]) => {
    const [activeId, setActiveId] = useState<string | null>(null);

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
    }, [ids]);

    return activeId;
};
