'use client';

import { type FC, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { chromeCopy } from '@/config/chrome';
import { otherLocale } from '@/lib/i18n/locale';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { twinPath } from '@/lib/i18n/paths';
import { storeLanguage, switchLanguage } from './languageStore';

interface Props {
    /** Styling comes from the host, so the nav keeps one definition of its pill. */
    className?: string;
}

/**
 * The link to this page in the other language, labelled in that language.
 *
 * A real link, so it can be opened in a new tab, copied or crawled. A plain
 * click stores the choice and replaces the page (`switchLanguage`), so Back
 * does not land on the language just left; a modified click (new tab or
 * window, download) stores the choice and leaves the navigation to the browser.
 */
export const LanguageSwitch: FC<Props> = ({ className }) => {
    const target = otherLocale(useLocale());
    const pathname = usePathname();
    const offer = chromeCopy[target].languageOffer;

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        // A right click only opens the context menu: nothing is chosen yet.
        if (event.button === 2) {
            return;
        }

        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            storeLanguage(target);

            return;
        }

        event.preventDefault();
        switchLanguage(target);
    };

    return (
        <a
            className={className}
            href={twinPath(pathname, target)}
            hrefLang={target}
            lang={target}
            aria-label={offer.invite}
            onClick={handleClick}
            onAuxClick={handleClick}
        >
            {offer.code}
        </a>
    );
};
