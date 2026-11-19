/**
 * The per-language checks over every dictionary on the site, in one table:
 * German holds the same keys as English (and so the same list lengths), no
 * empty string, no informal address, and no dollar sign. A new dictionary
 * pair goes into `DICTIONARIES`.
 *
 * The types already make a missing German key an error; these catch what
 * types cannot: an emptied string, a „du“, or a price left in dollars.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { blogDe } from './blog/de';
import { blogEn } from './blog/en';
import { workDe as caseStudyDetailsDe } from './caseStudyDetails/de';
import { workEn as caseStudyDetailsEn } from './caseStudyDetails/en';
import { chromeDe } from './chrome/de';
import { chromeEn } from './chrome/en';
import { consentDe } from './consent/de';
import { consentEn } from './consent/en';
import { contactDe } from './contact/de';
import { contactEn } from './contact/en';
import { errorsDe } from './errors/de';
import { errorsEn } from './errors/en';
import { homeContactDe } from './home/contact/de';
import { homeContactEn } from './home/contact/en';
import { experienceDe } from './home/experience/de';
import { experienceEn } from './home/experience/en';
import { heroDe } from './home/hero/de';
import { heroEn } from './home/hero/en';
import { processDe } from './home/process/de';
import { processEn } from './home/process/en';
import { proofDe } from './home/proof/de';
import { proofEn } from './home/proof/en';
import { engagementsDe } from './home/services/de';
import { engagementsEn } from './home/services/en';
import { workDe } from './home/work/de';
import { workEn } from './home/work/en';
import { writingDe } from './home/writing/de';
import { writingEn } from './home/writing/en';
import { legalNoticeDe } from './legalNotice/de';
import { legalNoticeEn } from './legalNotice/en';
import { markdownDe } from './markdown/de';
import { markdownEn } from './markdown/en';
import { privacyDe } from './privacy/de';
import { privacyEn } from './privacy/en';
import { servicesDe } from './services/de';
import { servicesEn } from './services/en';
import { siteDe } from './site/de';
import { siteEn } from './site/en';

/** Every dictionary pair: its name, English, German. */
const DICTIONARIES: [string, unknown, unknown][] = [
    // English names its tags by themselves; only German maps them (`tagLabel`),
    // so its labels are checked on their own, against the tags as English shows them.
    ['blog', { ...blogEn, tags: {} }, { ...blogDe, tags: {} }],
    ['blog tags', Object.fromEntries(Object.keys(blogDe.tags).map(tag => [tag, tag])), blogDe.tags],
    ['caseStudyDetails', caseStudyDetailsEn, caseStudyDetailsDe],
    ['chrome', chromeEn, chromeDe],
    ['consent', consentEn, consentDe],
    ['contact', contactEn, contactDe],
    ['errors', errorsEn, errorsDe],
    ['home/contact', homeContactEn, homeContactDe],
    ['home/experience', experienceEn, experienceDe],
    ['home/hero', heroEn, heroDe],
    ['home/process', processEn, processDe],
    ['home/proof', proofEn, proofDe],
    ['home/services', engagementsEn, engagementsDe],
    ['home/work', workEn, workDe],
    ['home/writing', writingEn, writingDe],
    ['legalNotice', legalNoticeEn, legalNoticeDe],
    ['markdown', markdownEn, markdownDe],
    ['privacy', privacyEn, privacyDe],
    ['services', servicesEn, servicesDe],
    ['site', siteEn, siteDe],
];

/** The value at a dotted `path` in `value`, as `dictionaryStrings` writes paths. */
const at = (value: unknown, path: string): unknown => path.split('.').reduce<unknown>(
    (node, key) => (typeof node === 'object' && node !== null ? Reflect.get(node, key) : undefined),
    value,
);

/**
 * A terminal's shell prompt: a segment that is exactly `$` and marked as the
 * prompt (`config/home/process`, `{ text: '$', tone: 'prompt' }`). The one
 * dollar sign German copy may hold.
 */
const isShellPrompt = (dictionary: unknown, path: string, text: string) => {
    if (text !== '$' || !path.endsWith('.text')) {
        return false;
    }

    const segment = at(dictionary, path.slice(0, -'.text'.length));

    return typeof segment === 'object' && segment !== null && Reflect.get(segment, 'tone') === 'prompt';
};

describe.each(DICTIONARIES)('the %s dictionary', (_name, english, german) => {
    it('should hold the same keys and list lengths in German as in English', () => {
        expect(keyPaths(german)).toEqual(keyPaths(english));
    });

    it('should hold no empty German string', () => {
        const empty = dictionaryStrings(german).filter(({ text }) => text.trim() === '');

        expect(empty).toEqual([]);
    });

    it('should never address the reader informally in German', () => {
        expect(dictionaryStrings(german).filter(({ text }) => INFORMAL_ADDRESS.test(text))).toEqual([]);
    });

    it('should hold no dollar sign in German, but a terminal\'s prompt', () => {
        const dollars = dictionaryStrings(german).filter(({ path, text }) => text.includes('$') && !isShellPrompt(german, path, text));

        expect(dollars).toEqual([]);
    });
});

describe('the shell prompt allowance', () => {
    const terminal = { lines: [[{ text: '$', tone: 'prompt' }, { text: ' ls $HOME' }]], price: '$3,500', loose: { text: '$' } };

    it('should allow only a prompt segment that is exactly $', () => {
        const dollars = dictionaryStrings(terminal).filter(({ path, text }) => text.includes('$') && !isShellPrompt(terminal, path, text));

        expect(dollars.map(({ path }) => path)).toEqual(['lines.0.1.text', 'price', 'loose.text']);
    });

    it('should find the prompts in the German process terminals it exists for', () => {
        const prompts = dictionaryStrings(processDe).filter(({ path, text }) => isShellPrompt(processDe, path, text));

        expect(prompts.length).toBeGreaterThan(0);
    });
});
