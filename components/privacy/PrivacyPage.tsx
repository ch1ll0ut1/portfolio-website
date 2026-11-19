import { FC } from 'react';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { POLICY_LAST_UPDATED } from '@/config/privacy';
import type { Locale } from '@/lib/i18n/locale';
import { PrivacyPolicy } from './PrivacyPolicy';

interface Props {
    locale: Locale;
}

/**
 * The privacy page's body in one language, so `/privacy` and its German twin
 * are each a thin route around it. Their metadata is `privacyMetadata`.
 */
export const PrivacyPage: FC<Props> = ({ locale }) => {
    return (
        <ReadingShell>
            <div className="wrap">
                <PrivacyPolicy locale={locale} lastUpdated={POLICY_LAST_UPDATED} />
            </div>
        </ReadingShell>
    );
};
