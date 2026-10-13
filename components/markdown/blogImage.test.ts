/**
 * Tests for blog image path resolution and build-time measuring.
 */

import { describe, expect, it } from 'vitest';
import { blogImagePath, readImageDimensions } from './blogImage';

describe('blogImagePath', () => {
    it('should resolve a bare file name into the blog image folder', () => {
        expect(blogImagePath('cover.webp')).toBe('/images/blog/cover.webp');
    });

    it('should leave an absolute path untouched', () => {
        expect(blogImagePath('/custom/path/image.png')).toBe('/custom/path/image.png');
    });
});

describe('readImageDimensions', () => {
    it('should read the real pixel size of an image in public/', () => {
        // A portrait image: the old fixed 800×600 box got exactly this wrong.
        expect(readImageDimensions('how-to-build-a-startup-dev-team-for-real-world-success.webp'))
            .toEqual({ width: 1024, height: 1536 });
    });

    it('should return undefined when no file exists at the path', () => {
        expect(readImageDimensions('does-not-exist.webp')).toBeUndefined();
    });
});
