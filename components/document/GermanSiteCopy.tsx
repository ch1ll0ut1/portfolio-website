'use client';

import { type FC, type ReactNode } from 'react';
import { chromeDe } from '@/config/chrome/de';
import { consentDe } from '@/config/consent/de';
import { homeContactDe } from '@/config/home/contact/de';
import { type ClientCopy, CopyProvider } from '@/lib/i18n/CopyContext';

/** What every page's chrome reads: nav, palette, shortcuts, consent and footer. */
const COPY: Partial<ClientCopy> = {
    chrome: chromeDe,
    consent: consentDe,
    homeContact: homeContactDe,
};

/**
 * The site chrome's words on a German page, and no English ones: the German
 * root layout renders it (see `SiteDocument`), the English one `EnglishSiteCopy`.
 */
export const GermanSiteCopy: FC<{ children: ReactNode }> = ({ children }) => (
    <CopyProvider copy={COPY}>{children}</CopyProvider>
);
