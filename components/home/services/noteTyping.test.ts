/**
 * Tests for the closing paragraph's word splitting.
 */

import { describe, expect, it } from 'vitest';
import { engagementNote } from '@/config/engagements';
import { splitNoteWords } from './noteTyping';

describe('splitNoteWords', () => {
    it('should reconstruct the paragraph from its words', () => {
        // Arrange
        const expected = engagementNote.map(segment => segment.text).join(' ');

        // Act
        const words = splitNoteWords(engagementNote);

        // Assert
        expect(words.map(word => word.text).join(' ')).toBe(expected);
    });

    it('should carry the selection flag through from the segments', () => {
        // Act
        const words = splitNoteWords(engagementNote);
        const selected = words.filter(word => word.selected);

        // Assert
        expect(selected.map(word => word.text).join(' ')).toBe('senior quality, faster.');
    });

    it('should number the selected words in reading order', () => {
        // Act
        const words = splitNoteWords(engagementNote);
        const indices = words.filter(word => word.selected).map(word => word.selectIndex);

        // Assert
        expect(indices).toEqual([0, 1, 2]);
    });

    it('should leave unselected words without a selection index', () => {
        // Act
        const words = splitNoteWords(engagementNote);

        // Assert
        words.filter(word => !word.selected).forEach((word) => {
            expect(word.selectIndex).toBe(-1);
        });
    });

    it('should collapse whitespace runs into single words', () => {
        // Act
        const words = splitNoteWords([{ text: '  two   words \n here ', selected: false }]);

        // Assert
        expect(words.map(word => word.text)).toEqual(['two', 'words', 'here']);
    });
});
