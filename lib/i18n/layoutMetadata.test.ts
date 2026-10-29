/**
 * Tests for the metadata each language's root layout hands its pages.
 */

import { describe, expect, it } from 'vitest';
import { siteCopy } from '@/config/site';
import { layoutMetadata } from './layoutMetadata';

describe('layoutMetadata', () => {
    it('should fall back to the German title and description on German pages', () => {
        // Act
        const metadata = layoutMetadata('de');

        // Assert
        expect(metadata.title).toEqual({ default: siteCopy.de.title, template: '%s | Stefan Knoch' });
        expect(metadata.description).toBe(siteCopy.de.description);
        expect(metadata.openGraph?.title).toBe(siteCopy.de.title);
        expect(metadata.openGraph?.description).toBe(siteCopy.de.description);
        expect(metadata.twitter?.title).toBe(siteCopy.de.title);
    });

    it('should keep the English words on English pages', () => {
        // Act
        const metadata = layoutMetadata('en');

        // Assert
        expect(metadata.description).toBe(siteCopy.en.description);
        expect(metadata.description).not.toBe(siteCopy.de.description);
    });
});
