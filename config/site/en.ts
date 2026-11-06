import { siteIdentity } from './identity';
import type { SiteCopy } from './types';

const { name, sinceYear } = siteIdentity;

export const siteEn: SiteCopy = {
    title: `${name} — Software Architect & Tech Lead`,
    jobTitle: 'Software architect & tech lead',
    jobTitleHighlight: 'tech lead',
    description: `Software architect & tech lead since ${sinceYear}. I build new apps, fix broken ones and lead your developers, for startups and small businesses. Remote from Bangkok.`,
    since: `since ${sinceYear}`,
};
