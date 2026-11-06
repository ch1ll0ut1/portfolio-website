import { siteIdentity } from './identity';
import type { SiteCopy } from './types';

const { name, sinceYear } = siteIdentity;

export const siteEn: SiteCopy = {
    title: `${name} — Freelance Software Architect & Fractional CTO`,
    jobTitle: 'Freelance software architect & fractional CTO',
    jobTitleHighlight: 'fractional CTO',
    description: `Freelance software architect & fractional CTO since ${sinceYear}. I build new apps, fix broken ones, and lead developers for startups and small businesses.`,
    since: `since ${sinceYear}`,
};
