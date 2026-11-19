import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';

/** The contact form in `locale`, with the project topic already chosen. */
export const contactHref = (locale: Locale) => localizedPath(locale, '/contact?topic=project');
