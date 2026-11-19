import type { Metadata } from 'next';
import { legalNoticeCopy } from '@/config/legalNotice';
import type { Locale } from '@/lib/i18n/locale';
import { pageMetadata } from '@/lib/i18n/metadata';

/**
 * The legal notice's metadata in `locale`, with its twin. Every share field
 * is set here, as on the privacy page (see `privacyMetadata`); the card image
 * comes from the route's sibling opengraph-image/twitter-image files.
 */
export const legalNoticeMetadata = (locale: Locale): Metadata => {
    const { title, description } = legalNoticeCopy[locale].meta;

    return pageMetadata({
        locale,
        enPath: '/imprint',
        title,
        description,
        robots: {
            index: true,
            follow: true,
        },
    });
};
