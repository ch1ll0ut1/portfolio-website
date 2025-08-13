/**
 * Tests for Badge component.
 * Tests behavior and public API, focusing on variants and content display.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
    describe('Basic Rendering', () => {
        it('should render badge with text content', () => {
            // Act
            render(<Badge>New Feature</Badge>);

            // Assert
            const badge = screen.getByText('New Feature');
            expect(badge).toBeInTheDocument();
            expect(badge.tagName).toBe('SPAN');
        });

        it('should have data-slot attribute', () => {
            // Act
            render(<Badge>Test Badge</Badge>);

            // Assert
            const badge = screen.getByText('Test Badge');
            expect(badge).toHaveAttribute('data-slot', 'badge');
        });

        it('should apply default variant classes', () => {
            // Act
            render(<Badge>Default</Badge>);

            // Assert
            const badge = screen.getByText('Default');
            expect(badge).toHaveClass('bg-primary', 'text-primary-foreground', 'border-transparent');
        });

        it('should apply base badge classes', () => {
            // Act
            render(<Badge>Base Classes</Badge>);

            // Assert
            const badge = screen.getByText('Base Classes');
            expect(badge).toHaveClass(
                'inline-flex',
                'items-center',
                'justify-center',
                'rounded-md',
                'border',
                'px-2',
                'py-0.5',
                'text-xs',
                'font-medium',
            );
        });
    });

    describe('Variants', () => {
        it('should apply secondary variant classes', () => {
            // Act
            render(<Badge variant="secondary">Secondary</Badge>);

            // Assert
            const badge = screen.getByText('Secondary');
            expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground', 'border-transparent');
        });

        it('should apply destructive variant classes', () => {
            // Act
            render(<Badge variant="destructive">Error</Badge>);

            // Assert
            const badge = screen.getByText('Error');
            expect(badge).toHaveClass('bg-destructive', 'text-white', 'border-transparent');
        });

        it('should apply outline variant classes', () => {
            // Act
            render(<Badge variant="outline">Outlined</Badge>);

            // Assert
            const badge = screen.getByText('Outlined');
            expect(badge).toHaveClass('text-foreground');
            expect(badge).not.toHaveClass('border-transparent');
        });
    });

    describe('Custom Props', () => {
        it('should apply custom className', () => {
            // Act
            render(<Badge className="custom-badge-class">Custom</Badge>);

            // Assert
            const badge = screen.getByText('Custom');
            expect(badge).toHaveClass('custom-badge-class');
        });

        it('should pass through native span props', () => {
            // Act
            render(<Badge id="test-badge" title="Test tooltip">Test</Badge>);

            // Assert
            const badge = screen.getByText('Test');
            expect(badge).toHaveAttribute('id', 'test-badge');
            expect(badge).toHaveAttribute('title', 'Test tooltip');
        });
    });

    describe('Content Handling', () => {
        it('should render with icon content', () => {
            // Act
            render(<Badge>🚀 Launch</Badge>);

            // Assert
            const badge = screen.getByText('🚀 Launch');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveTextContent('🚀 Launch');
        });

        it('should render with number content', () => {
            // Act
            render(<Badge>42</Badge>);

            // Assert
            const badge = screen.getByText('42');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveTextContent('42');
        });

        it('should render empty badge', () => {
            // Act
            const { container } = render(<Badge></Badge>);

            // Assert
            const badge = container.firstChild;
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('inline-flex');
        });
    });

    describe('AsChild Behavior', () => {
        it('should render as custom element when asChild is true', () => {
            // Act
            render(
                <Badge asChild>
                    <a href="/category">Category Badge</a>
                </Badge>,
            );

            // Assert
            const link = screen.getByRole('link');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', '/category');
            expect(link).toHaveTextContent('Category Badge');
            expect(link).toHaveClass('bg-primary'); // Should still have badge classes
        });

        it('should render as button when asChild with button child', () => {
            // Act
            render(
                <Badge asChild>
                    <button type="button">Interactive Badge</button>
                </Badge>,
            );

            // Assert
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('type', 'button');
            expect(button).toHaveTextContent('Interactive Badge');
            expect(button).toHaveClass('inline-flex', 'items-center');
        });
    });

    describe('Styling Combinations', () => {
        it('should combine variant with custom classes properly', () => {
            // Act
            render(<Badge variant="destructive" className="ml-2">Error Badge</Badge>);

            // Assert
            const badge = screen.getByText('Error Badge');
            expect(badge).toHaveClass('bg-destructive', 'text-white', 'ml-2');
        });

        it('should handle multiple badges in container', () => {
            // Act
            render(
                <div>
                    <Badge variant="default">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                </div>,
            );

            // Assert
            expect(screen.getByText('Primary')).toHaveClass('bg-primary');
            expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');
            expect(screen.getByText('Outline')).toHaveClass('text-foreground');
        });
    });

    describe('Accessibility', () => {
        it('should support aria attributes', () => {
            // Act
            render(<Badge aria-label="Status indicator" role="status">Active</Badge>);

            // Assert
            const badge = screen.getByRole('status');
            expect(badge).toHaveAttribute('aria-label', 'Status indicator');
            expect(badge).toHaveTextContent('Active');
        });

        it('should be focusable when interactive', () => {
            // Act
            render(
                <Badge asChild>
                    <button>Clickable Badge</button>
                </Badge>,
            );

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('focus-visible:ring-ring/50');
            button.focus();
            expect(button).toHaveFocus();
        });
    });
});
