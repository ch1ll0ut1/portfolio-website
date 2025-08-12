/**
 * Tests for Button component.
 * Tests behavior and public API, focusing on variants, sizes, and interaction.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
    describe('Basic Rendering', () => {
        it('should render button with text content', () => {
            // Act
            render(<Button>Click me</Button>);

            // Assert
            const button = screen.getByRole('button', { name: /click me/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent('Click me');
        });

        it('should render as button element by default', () => {
            // Act
            render(<Button>Default Button</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button.tagName).toBe('BUTTON');
            expect(button).toHaveAttribute('data-slot', 'button');
        });

        it('should apply default variant and size classes', () => {
            // Act
            render(<Button>Default</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-primary', 'text-primary-foreground', 'h-9', 'px-4', 'py-2');
        });
    });

    describe('Variants', () => {
        it('should apply destructive variant classes', () => {
            // Act
            render(<Button variant="destructive">Delete</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-destructive', 'text-white');
        });

        it('should apply outline variant classes', () => {
            // Act
            render(<Button variant="outline">Outlined</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('border', 'bg-background');
        });

        it('should apply secondary variant classes', () => {
            // Act
            render(<Button variant="secondary">Secondary</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
        });

        it('should apply ghost variant classes', () => {
            // Act
            render(<Button variant="ghost">Ghost</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('hover:bg-accent');
        });

        it('should apply link variant classes', () => {
            // Act
            render(<Button variant="link">Link Button</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('text-primary', 'underline-offset-4');
        });
    });

    describe('Sizes', () => {
        it('should apply small size classes', () => {
            // Act
            render(<Button size="sm">Small</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('h-8', 'px-3');
        });

        it('should apply large size classes', () => {
            // Act
            render(<Button size="lg">Large</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('h-10', 'px-6');
        });

        it('should apply icon size classes', () => {
            // Act
            render(<Button size="icon">🔥</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('size-9');
        });
    });

    describe('Custom Props', () => {
        it('should apply custom className', () => {
            // Act
            render(<Button className="custom-class">Custom</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('custom-class');
        });

        it('should handle disabled state', () => {
            // Act
            render(<Button disabled>Disabled</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
        });

        it('should pass through native button props', () => {
            // Act
            render(<Button type="submit" id="test-button">Submit</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'submit');
            expect(button).toHaveAttribute('id', 'test-button');
        });
    });

    describe('Interactions', () => {
        it('should handle click events', () => {
            // Arrange
            const handleClick = vi.fn();

            // Act
            render(<Button onClick={handleClick}>Clickable</Button>);
            fireEvent.click(screen.getByRole('button'));

            // Assert
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should not trigger click when disabled', () => {
            // Arrange
            const handleClick = vi.fn();

            // Act
            render(<Button onClick={handleClick} disabled>Disabled</Button>);
            fireEvent.click(screen.getByRole('button'));

            // Assert
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('AsChild Behavior', () => {
        it('should render as Slot when asChild is true', () => {
            // Act
            render(
                <Button asChild>
                    <a href="/test">Link Button</a>
                </Button>,
            );

            // Assert
            const link = screen.getByRole('link');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', '/test');
            expect(link).toHaveClass('bg-primary'); // Should still have button classes
        });
    });

    describe('Accessibility', () => {
        it('should be keyboard accessible', () => {
            // Act
            render(<Button>Accessible</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('focus-visible:ring-ring/50');
            button.focus();
            expect(button).toHaveFocus();
        });

        it('should support aria attributes', () => {
            // Act
            render(<Button aria-label="Close dialog" aria-pressed="false">×</Button>);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', 'Close dialog');
            expect(button).toHaveAttribute('aria-pressed', 'false');
        });
    });
});
