/**
 * Tests for blog image path resolution.
 */

import { describe, expect, it } from 'vitest';
import { blogImagePath } from './blogImage';

describe('blogImagePath', () => {
    it('should resolve a bare file name into the blog image folder', () => {
        expect(blogImagePath('cover.webp')).toBe('/images/blog/cover.webp');
    });

    it('should leave an absolute path untouched', () => {
        expect(blogImagePath('/custom/path/image.png')).toBe('/custom/path/image.png');
    });
});
