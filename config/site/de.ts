/**
 * Die Worte der Website auf Deutsch: Titel, Positionierung, Beschreibung.
 * Formal ("Sie"), like `config/services/de.ts`.
 */

import { siteIdentity } from './identity';
import type { SiteCopy } from './types';

const { name, sinceYear } = siteIdentity;

export const siteDe: SiteCopy = {
    title: `${name} — Freier Softwarearchitekt & Interim-CTO`,
    jobTitle: 'Freier Softwarearchitekt & Interim-CTO',
    jobTitleHighlight: 'Interim-CTO',
    description: `Freiberuflicher Softwarearchitekt & Interim-CTO seit ${sinceYear}. Ich baue neue Apps, rette fehlerhafte und führe Ihr Team, für Startups und kleine Unternehmen.`,
    since: `seit ${sinceYear}`,
};
