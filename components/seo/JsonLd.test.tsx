import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { itemAt } from '@/test/itemAt';
import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
    it('should render the data as a JSON-LD script that parses back to the same object', () => {
        // Arrange
        const data = { '@context': 'https://schema.org', '@type': 'Person', 'name': 'Ada' };

        // Act
        const { container } = render(<JsonLd data={data} />);
        const script = container.querySelector('script[type="application/ld+json"]');

        // Assert
        expect(script).not.toBeNull();
        expect(JSON.parse(script?.textContent ?? '')).toEqual(data);
    });

    it('should not let a value close the script tag early', () => {
        // Arrange
        const data = { headline: '</script><script>alert(1)</script>' };

        // Act
        const { container } = render(<JsonLd data={data} />);
        const scripts = container.querySelectorAll('script');

        // Assert
        expect(scripts).toHaveLength(1);
        expect(itemAt(scripts, 0).innerHTML).not.toContain('</script>');
        expect(JSON.parse(itemAt(scripts, 0).innerHTML)).toEqual(data);
    });
});
