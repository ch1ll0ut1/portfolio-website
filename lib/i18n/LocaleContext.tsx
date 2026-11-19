/**
 * The page's language for client components.
 *
 * Each root layout wraps the site in a provider with its own language, so
 * long-lived client chrome (nav, palette, consent, the contact form) can read
 * it without a prop chain. Server components get `locale` from their page.
 */

'use client';

import { createContext, useContext, type FC, type ReactNode } from 'react';
import { type Locale, defaultLocale } from './locale';

const LocaleContext = createContext<Locale>(defaultLocale);

interface Props {
    locale: Locale;
    children: ReactNode;
}

export const LocaleProvider: FC<Props> = ({ locale, children }) => (
    <LocaleContext value={locale}>
        {children}
    </LocaleContext>
);

/** The language of the page; English outside any provider. */
export const useLocale = () => useContext(LocaleContext);
