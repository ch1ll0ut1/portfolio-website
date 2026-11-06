/**
 * Tests for the per-language copy context and the modules that fill it.
 */

import { FC } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EnglishContactCopy } from '@/components/contact/EnglishContactCopy';
import { GermanContactCopy } from '@/components/contact/GermanContactCopy';
import { EnglishSiteCopy } from '@/components/document/EnglishSiteCopy';
import { GermanSiteCopy } from '@/components/document/GermanSiteCopy';
import { EnglishHomeCopy } from '@/components/home/EnglishHomeCopy';
import { GermanHomeCopy } from '@/components/home/GermanHomeCopy';
import { chromeDe } from '@/config/chrome/de';
import { chromeEn } from '@/config/chrome/en';
import { contactDe } from '@/config/contact/de';
import { contactEn } from '@/config/contact/en';
import { heroDe } from '@/config/home/hero/de';
import { heroEn } from '@/config/home/hero/en';
import { useCopy } from './CopyContext';

// As on the site: nothing outside a provider (test/setup.ts would hand out English).
vi.mock('./copyFallback', () => ({ copyFallback: {} }));

const ThemeLabel: FC = () => <p>{useCopy('chrome').themeToggle}</p>;
const HeroEditorLabel: FC = () => <p>{useCopy('hero').editor.label}</p>;
const SendLabel: FC = () => <p>{useCopy('contact').form.send}</p>;

describe('useCopy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should say which words are missing outside every provider', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(() => render(<ThemeLabel />)).toThrow('No "chrome" copy above this component');
    });

    it.each([
        ['English', EnglishSiteCopy, EnglishHomeCopy, EnglishContactCopy, chromeEn, heroEn, contactEn],
        ['German', GermanSiteCopy, GermanHomeCopy, GermanContactCopy, chromeDe, heroDe, contactDe],
    ] as const)('should hand the %s words to the components below, a page\'s modules adding to the layout\'s', (_language, SiteCopy, HomeCopy, ContactCopy, chrome, hero, contact) => {
        render(
            <SiteCopy>
                <HomeCopy>
                    <ContactCopy>
                        <ThemeLabel />
                        <HeroEditorLabel />
                        <SendLabel />
                    </ContactCopy>
                </HomeCopy>
            </SiteCopy>,
        );

        expect(screen.getByText(chrome.themeToggle)).toBeInTheDocument();
        expect(screen.getByText(hero.editor.label)).toBeInTheDocument();
        expect(screen.getByText(contact.form.send)).toBeInTheDocument();
    });

    it('should not hand a page\'s words to another page', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(() => render(
            <EnglishSiteCopy>
                <HeroEditorLabel />
            </EnglishSiteCopy>,
        )).toThrow('No "hero" copy above this component');
    });
});
