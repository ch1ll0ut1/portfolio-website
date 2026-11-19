import { describe, expect, it } from 'vitest';
import { webFontFamily } from './webFontFamily';

describe('webFontFamily', () => {
    it('should keep the web font and drop the fallback next/font appends', () => {
        const font = { style: { fontFamily: '\'Bricolage Grotesque\', \'Bricolage Grotesque Fallback\'' } };

        expect(webFontFamily(font)).toBe('\'Bricolage Grotesque\'');
    });

    it('should keep a family that comes without a fallback', () => {
        expect(webFontFamily({ style: { fontFamily: '\'Martian Mono\'' } })).toBe('\'Martian Mono\'');
    });
});
