/**
 * Tests for the locale provider and its hook.
 */

import { FC } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider, useLocale } from './LocaleContext';

const ShowLocale: FC = () => <p>{useLocale()}</p>;

describe('LocaleContext', () => {
    it('should hand the provider\'s language to the components below it', () => {
        // Arrange
        render(
            <LocaleProvider locale="de">
                <ShowLocale />
            </LocaleProvider>,
        );

        // Assert
        expect(screen.getByText('de')).toBeInTheDocument();
    });

    it('should default to English outside any provider', () => {
        // Arrange
        render(<ShowLocale />);

        // Assert
        expect(screen.getByText('en')).toBeInTheDocument();
    });
});
