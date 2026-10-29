import { type FC } from 'react';
import { workCopy } from '@/config/home/work';
import type { Locale } from '@/lib/i18n/locale';
import { SectionHead } from '../SectionHead';
import { CaseList } from './CaseList';
import { MoreProjects } from './MoreProjects';

/**
 * Selected work: the stacking case studies, then the smaller projects.
 */
interface Props {
    locale: Locale;
}

export const Work: FC<Props> = ({ locale }) => (
    <section className="section" id="work" aria-labelledby="work-title">
        <div className="wrap">
            <SectionHead
                id="work-title"
                title={workCopy[locale].heading.title}
                lede={workCopy[locale].heading.lede}
            />

            <CaseList />

            <MoreProjects />
        </div>
    </section>
);
