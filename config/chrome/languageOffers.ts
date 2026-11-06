import type { Locale } from '@/lib/i18n/locale';

export interface LanguageOffer {
    /** The switch's visible label. */
    code: string;
    /** The switch's accessible name and the palette command's label. */
    invite: string;
}

/**
 * Each language as it offers itself on the other language's pages: the nav's
 * switch and the palette's command speak the language they lead to, so a
 * reader who cannot read the page still finds one they can. Both languages in
 * one small module, apart from the dictionaries: a page needs the offer of
 * the language it is not in.
 */
export const languageOffers: Record<Locale, LanguageOffer> = {
    en: { code: 'EN', invite: 'Read in English' },
    de: { code: 'DE', invite: 'Auf Deutsch lesen' },
};
