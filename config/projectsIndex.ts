/**
 * The "More projects" index under the case studies.
 *
 * Deliberately terse: one line each, newest first. The stack array is rendered
 * joined in the row and split back into tags by the cursor preview card. Names
 * and descriptions are in the work section's dictionary, `config/home/work/`.
 */

import type { Locale } from '@/lib/i18n/locale';
import { workCopy } from './home/work';

export type IndexedProjectId
    = | 'command-code'
      | 'fokus-nachhilfe'
      | 'directmail'
      | 'slimwiki'
      | 'indycloud'
      | 'hotel-visual-cms'
      | 'doctor-discovery';

export interface IndexedProject {
    /** Slug used for keys and the preview card's fake path. */
    id: string;
    /** Year or range, as shown. The dictionary's word for now, for current work. */
    year: string;
    name: string;
    /** One sentence on what it is. */
    description: string;
    stack: string[];
}

/** What a project is apart from its words. Current work has no `year`. */
interface IndexedProjectData {
    id: IndexedProjectId;
    year?: string;
    stack: string[];
}

const projectData: IndexedProjectData[] = [
    { id: 'command-code', stack: ['TypeScript', 'agentic LLM workflows'] },
    { id: 'fokus-nachhilfe', year: '2025–', stack: ['Next.js', 'Supabase', 'HubSpot', 'Vercel'] },
    { id: 'directmail', year: '2021–22', stack: ['React', 'Slate.js'] },
    { id: 'slimwiki', year: '2017–18', stack: ['React', 'Koa', 'PostgreSQL', 'AWS'] },
    { id: 'indycloud', year: '2013–15', stack: ['React', 'Node.js', 'Koa'] },
    { id: 'hotel-visual-cms', year: '2013–15', stack: ['JavaScript', 'CSS'] },
    { id: 'doctor-discovery', year: '2013–15', stack: ['MeteorJS', 'MongoDB'] },
];

/** The index, newest first, told in `locale`. */
export const projectsIndexFor = (locale: Locale): IndexedProject[] => {
    const { now, projects } = workCopy[locale].moreProjects;

    return projectData.map(({ id, year, stack }) => ({
        id,
        year: year ?? now,
        ...projects[id],
        stack,
    }));
};
