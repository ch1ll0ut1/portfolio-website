/**
 * Tests for measuring blog images at build time.
 */

import { describe, expect, it } from 'vitest';
import { readImageDimensions } from './blogImages';

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
