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
        expect(formatDate('2025-08-14')).toBe('August 14, 2025');
    });

    it('should keep the calendar day of a bare date at the edges of the day', () => {
        expect(formatDate('2026-01-01')).toBe('January 1, 2026');
        expect(formatDate('2025-12-31')).toBe('December 31, 2025');
    });
});
