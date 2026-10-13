/**
 * Tests for the footer wordmark's sizing maths.
 */

import { describe, expect, it } from 'vitest';
import { stubRect } from '../../../test/motionEnv';
import { itemAt } from '@/test/itemAt';
import { createWordmarkFit, fitFontSize, shouldRefit } from './wordmarkFit';

describe('fitFontSize', () => {
    it('should scale the probe size by the ratio the word has to grow', () => {
        // Act
        const size = fitFontSize(1000, 500);

        // Assert
        expect(size).toBeCloseTo(199);
    });

    it('should shrink the word when it is measured wider than the container', () => {
        // Act
        const size = fitFontSize(400, 800);

        // Assert
        expect(size).toBeCloseTo(49.75);
    });

    it('should honour a probe size other than the default', () => {
        // Act
        const size = fitFontSize(600, 300, 50);

        // Assert
        expect(size).toBeCloseTo(99.5);
    });

    it('should stay just under an exact fit so rounding cannot overflow', () => {
        // Act
        const size = fitFontSize(500, 500);

        // Assert
        expect(size).toBeLessThan(100);
    });

    it('should return zero when the word has not been measured yet', () => {
        // Act & Assert
        expect(fitFontSize(1000, 0)).toBe(0);
    });
});

describe('shouldRefit', () => {
    it('should refuse a container that has no width', () => {
        // Act & Assert
        expect(shouldRefit(0, 0, true)).toBe(false);
    });

    it('should ignore sub-pixel width changes', () => {
        // Act & Assert
        expect(shouldRefit(800.2, 800, false)).toBe(false);
    });

    it('should accept a real width change', () => {
        // Act & Assert
        expect(shouldRefit(820, 800, false)).toBe(true);
    });

    it('should accept an unchanged width when forced', () => {
        // Act & Assert
        expect(shouldRefit(800, 800, true)).toBe(true);
    });
});

describe('createWordmarkFit', () => {
    const build = () => {
        const container = document.createElement('div');
        const word = document.createElement('span');
        const letters = ['S', 'k'].map((character) => {
            const letter = document.createElement('span');

            letter.textContent = character;
            word.appendChild(letter);

            return letter;
        });

        container.appendChild(word);
        document.body.appendChild(container);
        Object.defineProperty(container, 'clientWidth', { value: 900, configurable: true });
        stubRect(word, { width: 300 });
        stubRect(itemAt(letters, 0), { width: 120 });
        stubRect(itemAt(letters, 1), { width: 80 });

        return { container, word, letters };
    };

    it('should set the font size that makes the word span its container', () => {
        // Arrange
        const { container, word, letters } = build();

        // Act
        createWordmarkFit({ container, word, letters }).run(true);

        // Assert
        expect(word.style.fontSize).toBe('298.5px');
    });

    it('should freeze each letter at its measured width', () => {
        // Arrange
        const { container, word, letters } = build();

        // Act
        createWordmarkFit({ container, word, letters }).run(true);

        // Assert
        expect(itemAt(letters, 0).style.width).toBe('120px');
        expect(itemAt(letters, 1).style.width).toBe('80px');
    });

    it('should drop the inline sizing when cleared', () => {
        // Arrange
        const { container, word, letters } = build();
        const fit = createWordmarkFit({ container, word, letters });

        fit.run(true);

        // Act
        fit.clear();

        // Assert
        expect(word.style.fontSize).toBe('');
        expect(itemAt(letters, 0).style.width).toBe('');
    });

    it('should skip a re-run when the container width has not changed', () => {
        // Arrange
        const { container, word, letters } = build();
        const fit = createWordmarkFit({ container, word, letters });

        fit.run(true);
        word.style.fontSize = '12px';

        // Act
        fit.run();

        // Assert
        expect(word.style.fontSize).toBe('12px');
    });
});
