'use client';

import { type FC, type ReactNode } from 'react';
import { chromeEn } from '@/config/chrome/en';
import { consentEn } from '@/config/consent/en';
import { homeContactEn } from '@/config/home/contact/en';
import { type ClientCopy, CopyProvider } from '@/lib/i18n/CopyContext';

/** What every page's chrome reads: nav, palette, shortcuts, consent and footer. */
const COPY: Partial<ClientCopy> = {
    chrome: chromeEn,
    consent: consentEn,
    homeContact: homeContactEn,
};

/**
 * The site chrome's words on an English page, and no German ones: the English
 * root layout renders it (see `SiteDocument`), the German one `GermanSiteCopy`.
 */
export const EnglishSiteCopy: FC<{ children: ReactNode }> = ({ children }) => (
    <CopyProvider copy={COPY}>{children}</CopyProvider>
);
