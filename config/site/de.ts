/**
 * Die Worte der Website auf Deutsch: Titel, Positionierung, Beschreibung.
 * Formal ("Sie"), like `config/services/de.ts`.
 */

import { siteIdentity } from './identity';
import type { SiteCopy } from './types';

const { name, sinceYear } = siteIdentity;

export const siteDe: SiteCopy = {
    title: `${name} — Softwarearchitekt & Tech Lead`,
    jobTitle: 'Softwarearchitekt & Tech Lead',
    jobTitleHighlight: 'Tech Lead',
    description: `Softwarearchitekt & Tech Lead seit ${sinceYear}. Ich baue neue Apps, rette fehlerhafte und führe Ihr Team, für Startups und kleine Unternehmen. Remote aus Bangkok.`,
    since: `seit ${sinceYear}`,
};
