/**
 * Tests for the share card's headline.
 */

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { itemAt } from '@/test/itemAt';
import { OgHeadline } from './OgHeadline';

describe('OgHeadline', () => {
    it('should draw the highlighted phrase as one selected unit', () => {
        // Act
        const { container } = render(<OgHeadline text="I build the hard part." highlight="hard part" fontSize={80} />);
        const selected = container.querySelectorAll('[data-selected]');

        // Assert
        expect(selected).toHaveLength(1);
        expect(itemAt(selected, 0).textContent).toBe('hard part');
        expect(container.textContent).toBe('Ibuildthehard part.');
    });

    it('should park exactly one caret, after the selection', () => {
        // Act
        const { container } = render(<OgHeadline text="I build the hard part." highlight="hard part" fontSize={80} />);
        const caret = container.querySelector('[data-caret]');

        // Assert
        expect(container.querySelectorAll('[data-caret]')).toHaveLength(1);
        expect(caret?.previousElementSibling?.hasAttribute('data-selected')).toBe(true);
        expect(caret?.nextElementSibling?.textContent).toBe('.');
    });

    it('should put the caret after the last word without a highlight', () => {
        // Act
        const { container } = render(<OgHeadline text="Why good software is expensive" fontSize={72} />);
        const caret = container.querySelector('[data-caret]');

        // Assert
        expect(container.querySelector('[data-selected]')).toBeNull();
        expect(caret?.previousElementSibling?.textContent).toBe('expensive');
    });
});
