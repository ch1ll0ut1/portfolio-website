/**
 * Tests for the web app manifest.
 */

import { describe, it, expect } from 'vitest';
import manifest from './manifest';

describe('manifest', () => {
    it('should list the rendered brand icons, a maskable one among them', () => {
        // Act
        const icons = manifest().icons ?? [];

        // Assert
        expect(icons.length).toBeGreaterThan(0);
        expect(icons.every(icon => icon.src.startsWith('/icons/') && icon.type === 'image/png')).toBe(true);
        expect(icons.some(icon => icon.purpose === 'maskable')).toBe(true);
        expect(icons.map(icon => icon.sizes)).toContain('512x512');
    });
});
