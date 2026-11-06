import { FC } from 'react';
import { ReadingShell } from '@/components/blog/ReadingShell';
import type { Locale } from '@/lib/i18n/locale';
import { LegalNotice } from './LegalNotice';

interface Props {
    locale: Locale;
}

/**
 * The legal notice's body in one language, so `/imprint` and `/de/impressum`
 * are each a thin route around it. Their metadata is `legalNoticeMetadata`.
 */
export const LegalNoticePage: FC<Props> = ({ locale }) => {
    return (
        <ReadingShell>
            <div className="wrap">
                <LegalNotice locale={locale} />
            </div>
        </ReadingShell>
    );
};
