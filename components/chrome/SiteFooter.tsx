'use client';

import { type FC } from 'react';
import { usePathname } from 'next/navigation';
import { ContactFooter } from '@/components/home/contact/ContactFooter';
import { localizedPath } from '@/lib/i18n/paths';
import { useLocale } from '@/lib/i18n/LocaleContext';

/**
 * The site footer for every route but the homepage, in either language.
 *
 * On the homepage the footer is the bottom half of the contact band — inside
 * that section, so it rides the band's edge reveal — and the band renders it
 * itself. Everywhere else it sits below `<main>`, rendered once here by the
 * root layout.
 *
 * The pathname is the same on the server and in the browser for every route
 * (a 404 is never served at `/`), so this branch cannot cause a hydration
 * mismatch.
 */
export const SiteFooter: FC = () => (usePathname() === localizedPath(useLocale(), '/') ? null : <ContactFooter />);
