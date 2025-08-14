/**
 * Tests for Button component.
 * Tests behavior, variants, accessibility, and user interactions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
    it('should render with content', () => {
        render(<Button>Test Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Test Button');
    });

    it('should handle click events', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support different variants', () => {
        render(<Button variant="secondary">Secondary Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Secondary Button');
    });

    it('should support different sizes', () => {
        render(<Button size="lg">Large Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Large Button');
    });

    it('should handle custom className prop', () => {
        render(<Button className="custom-button">Custom</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-button');
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should not trigger click when disabled', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button disabled onClick={handleClick}>Disabled</Button>);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(handleClick).not.toHaveBeenCalled();
    });

    it('should render as different HTML elements when asChild is used', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>,
        );

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/test');
    });

    it('should be keyboard accessible', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Keyboard Button</Button>);

        const button = screen.getByRole('button');
        button.focus();
        await user.keyboard('{Enter}');

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
