import { type FC } from 'react';
import { SectionHead } from '../SectionHead';
import { CaseList } from './CaseList';
import { MoreProjects } from './MoreProjects';

/**
 * Selected work: the stacking case studies, then the smaller projects.
 */
export const Work: FC = () => (
    <section className="section" id="work" aria-labelledby="work-title">
        <div className="wrap">
            <SectionHead
                id="work-title"
                title="Selected work"
                lede="Four projects where the difficult part was the whole point: structured documents, typed data from the database to the UI, a department built from nothing, and a messaging system under load."
            />

            <CaseList />

            <MoreProjects />
        </div>
    </section>
);
