'use client';

import { type FC, type MouseEvent, type ReactNode } from 'react';
import { storeLanguage } from '@/components/chrome/languageStore';
import { localizedPath } from '@/lib/i18n/paths';

interface Props {
    className?: string;
    children: ReactNode;
}

/**
 * The global 404's way to the German home page. That page has no nav, so no
 * language switch; this link stands in for it and, like the switch, stores
 * the choice however it is followed. A plain link would bounce: with `en`
 * stored, the boot script would send the German page straight back.
 */
export const GermanHomeLink: FC<Props> = ({ className, children }) => {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        // A right click only opens the context menu: nothing is chosen yet.
        if (event.button !== 2) {
            storeLanguage('de');
        }
    };

    return (
        <a
            className={className}
            href={localizedPath('de', '/')}
            hrefLang="de"
            lang="de"
            onClick={handleClick}
            onAuxClick={handleClick}
        >
            {children}
        </a>
    );
};
