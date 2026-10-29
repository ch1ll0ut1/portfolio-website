/**
 * Tests for the pre-paint boot script: the classes it leaves on <html> for
 * the stored theme, the motion switch, the armed entrance and a stored
 * consent choice. The script is run as the browser runs it, from its string.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { installMatchMedia } from '../test/motionEnv';
import { BOOT_SCRIPT } from './bootScript';
import { CONSENT_KEY, CONSENT_VERSION } from './consentStorage';

const html = document.documentElement;

const runBootScript = () => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval -- running the inline script is the point.
    new Function(BOOT_SCRIPT)();
};

const storeConsent = (record: unknown) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
};

describe('BOOT_SCRIPT', () => {
    let restoreMedia: () => void;

    beforeEach(() => {
        restoreMedia = installMatchMedia([]);
    });

    afterEach(() => {
        html.className = '';
        delete html.dataset.theme;
        localStorage.clear();
        restoreMedia();
    });

    it('should apply the stored theme and arm the entrance when motion is allowed', () => {
        localStorage.setItem('sk-theme', 'light');
        runBootScript();

        expect(html.dataset.theme).toBe('light');
        expect(html).toHaveClass('js', 'motion', 'is-pre');
    });

    it('should leave the entrance unarmed under reduced motion', () => {
        restoreMedia();
        restoreMedia = installMatchMedia(['(prefers-reduced-motion: reduce)']);
        runBootScript();

        expect(html).toHaveClass('js');
        expect(html).not.toHaveClass('motion');
        expect(html).not.toHaveClass('is-pre');
    });

    describe('stored consent', () => {
        it('should mark a current choice, granted or denied, so the banner never paints', () => {
            storeConsent({ version: CONSENT_VERSION, consent: { analytics: false, essential: true } });
            runBootScript();

            expect(html).toHaveClass('has-consent');
        });

        it('should not mark a first visit', () => {
            runBootScript();

            expect(html).not.toHaveClass('has-consent');
        });

        it.each([
            ['an older consent version', { version: '1.0', consent: { analytics: true, essential: true } }],
            ['a record without an analytics flag', { version: CONSENT_VERSION, consent: { essential: true } }],
            ['a record without a consent object', { version: CONSENT_VERSION }],
            ['a value that is not a record', 'yes'],
        ])('should not mark %s, which the banner still asks about', (_, record) => {
            storeConsent(record);
            runBootScript();

            expect(html).not.toHaveClass('has-consent');
        });

        it('should survive a corrupt record and still set the other classes', () => {
            localStorage.setItem(CONSENT_KEY, '{not json');
            runBootScript();

            expect(html).not.toHaveClass('has-consent');
            expect(html).toHaveClass('js', 'motion');
        });
    });
});
