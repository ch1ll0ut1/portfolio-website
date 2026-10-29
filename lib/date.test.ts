/**
 * Tests for the date helpers.
 */

import { describe, expect, it } from 'vitest';
import { bangkokDateTime, formatDate, sortByDate } from './date';

describe('bangkokDateTime', () => {
    it('should turn a calendar date into midnight in Bangkok', () => {
        // Act
        const dateTime = bangkokDateTime('2026-10-13');

        // Assert
        expect(dateTime).toBe('2026-10-13T00:00:00+07:00');
        expect(new Date(dateTime).toISOString()).toBe('2026-10-12T17:00:00.000Z');
    });
});

describe('sortByDate', () => {
    it('should put the newest item first', () => {
        // Act
        const sorted = sortByDate([{ date: '2025-01-01' }, { date: '2026-01-01' }]);

        // Assert
        expect(sorted.map(item => item.date)).toEqual(['2026-01-01', '2025-01-01']);
    });
});

describe('formatDate', () => {
    it('should write the date in US English whatever the runtime locale', () => {
        expect(formatDate('2025-08-14', 'en')).toBe('August 14, 2025');
    });

    it('should write the date the German way on a German page', () => {
        expect(formatDate('2025-08-14', 'de')).toBe('14. August 2025');
    });

    it('should keep the calendar day of a bare date at the edges of the day', () => {
        expect(formatDate('2026-01-01', 'en')).toBe('January 1, 2026');
        expect(formatDate('2025-12-31', 'en')).toBe('December 31, 2025');
        expect(formatDate('2025-12-31', 'de')).toBe('31. Dezember 2025');
    });
});
