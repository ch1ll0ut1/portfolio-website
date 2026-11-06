'use client';

import { type MouseEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { scrollToSection } from '@/components/chrome/scrollToSection';
import { localizedPath } from '@/lib/i18n/paths';
import { useLocale } from '@/lib/i18n/LocaleContext';

/**
 * The click handler for a link to a homepage section (`/#work`), shared by the
 * header's link row and the mobile menu.
 *
 * On the homepage a plain click is taken over and handed to `scrollToSection`,
 * the same move the palette and the `g` chords make, so focus lands on the
 * section along with the scroll; the URL still gains the fragment. Anywhere
 * else, and for modified clicks (new tab, new window), the link is left to
 * Next and the browser.
 *
 * `before` runs once the click is taken over, ahead of the scroll: the mobile
 * menu closes itself there, and `defer` holds the scroll for a task so the
 * dialog has left the top layer and the section can take focus.
 */
export const useSectionClick = () => {
    const locale = useLocale();
    const home = localizedPath(locale, '/');
    const pathname = usePathname();
    const router = useRouter();

    return (event: MouseEvent<HTMLAnchorElement>, id: string, options: { before?: () => void; defer?: boolean } = {}) => {
        if (pathname !== home || isModifiedClick(event) || !document.getElementById(id)) {
            return false;
        }

        event.preventDefault();
        options.before?.();

        const go = () => {
            scrollToSection(id, (href) => {
                router.push(href);
            }, locale);
            // Next keeps its router in step with native history calls.
            window.history.pushState(null, '', `#${id}`);
        };

        if (options.defer) {
            window.setTimeout(go, 0);
        }
        else {
            go();
        }

        return true;
    };
};

/** A click the browser should keep: another button, or opening elsewhere. */
const isModifiedClick = (event: MouseEvent) => (
    event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
);
