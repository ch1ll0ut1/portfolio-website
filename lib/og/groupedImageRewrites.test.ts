/**
 * Tests for the rewrites that keep the English share-card URLs working
 * under the `(en)` route group.
 */

import fs from 'fs';
import path from 'path';
import { djb2Hash } from 'next/dist/shared/lib/hash';
import { describe, expect, it } from 'vitest';
import { ENGLISH_IMAGE_DIRS, groupedImageRewrites, metadataRouteSuffix } from './groupedImageRewrites';

const ENGLISH_ROOT = path.join(process.cwd(), 'app', '(en)');

/** Every directory under app/(en) holding an `opengraph-image` file, as a path inside the group. */
const imageDirsOnDisk = () => fs.readdirSync(ENGLISH_ROOT, { recursive: true, encoding: 'utf8' })
    .filter(file => path.basename(file) === 'opengraph-image.tsx')
    .map(file => path.dirname(file) === '.' ? '' : `/${path.dirname(file).split(path.sep).join('/')}`)
    .sort();

describe('metadataRouteSuffix', () => {
    it.each(['/(en)', '/(en)/blog', '/(en)/work/[slug]'])('should match the suffix Next computes for %s', (parent) => {
        expect(metadataRouteSuffix(parent)).toBe(djb2Hash(parent).toString(36).slice(0, 6));
    });

    it('should give the suffixes the build serves the cards at', () => {
        expect(metadataRouteSuffix('/(en)')).toBe('35z9bs');
        expect(metadataRouteSuffix('/(en)/work/[slug]')).toBe('j99tbg');
    });
});

describe('groupedImageRewrites', () => {
    it('should cover every English directory that has share cards, each with an X card too', () => {
        expect([...ENGLISH_IMAGE_DIRS].sort()).toEqual(imageDirsOnDisk());

        for (const dir of ENGLISH_IMAGE_DIRS) {
            expect(fs.existsSync(path.join(ENGLISH_ROOT, dir, 'twitter-image.tsx')), dir).toBe(true);
        }
    });

    it('should send the old URLs to the suffixed routes, slug kept', () => {
        expect(groupedImageRewrites()).toEqual(expect.arrayContaining([
            { source: '/opengraph-image', destination: '/opengraph-image-35z9bs' },
            { source: '/twitter-image', destination: '/twitter-image-35z9bs' },
            { source: '/work/:slug/opengraph-image', destination: '/work/:slug/opengraph-image-j99tbg' },
        ]));
        expect(groupedImageRewrites()).toHaveLength(ENGLISH_IMAGE_DIRS.length * 2);
    });
});
