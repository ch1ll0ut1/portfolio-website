/**
 * Tests for Card components.
 * Tests behavior and public API for all card-related components.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardAction,
    CardFooter,
} from './Card';

describe('Card Components', () => {
    describe('Card', () => {
        it('should render card with basic content', () => {
            // Act
            render(<Card>Card content</Card>);

            // Assert
            const card = screen.getByText('Card content');
            expect(card).toBeInTheDocument();
            expect(card).toHaveAttribute('data-slot', 'card');
        });

        it('should apply default card classes', () => {
            // Act
            render(<Card>Test Card</Card>);

            // Assert
            const card = screen.getByText('Test Card');
            expect(card).toHaveClass(
                'bg-card',
                'text-card-foreground',
                'flex',
                'flex-col',
                'gap-6',
                'rounded-xl',
                'border',
                'py-6',
                'shadow-sm',
            );
        });

        it('should apply custom className', () => {
            // Act
            render(<Card className="custom-card">Custom Card</Card>);

            // Assert
            const card = screen.getByText('Custom Card');
            expect(card).toHaveClass('custom-card');
        });
    });

    describe('CardHeader', () => {
        it('should render card header', () => {
            // Act
            render(<CardHeader>Header content</CardHeader>);

            // Assert
            const header = screen.getByText('Header content');
            expect(header).toBeInTheDocument();
            expect(header).toHaveAttribute('data-slot', 'card-header');
        });

        it('should apply header-specific classes', () => {
            // Act
            render(<CardHeader>Header</CardHeader>);

            // Assert
            const header = screen.getByText('Header');
            expect(header).toHaveClass(
                'grid',
                'auto-rows-min',
                'grid-rows-[auto_auto]',
                'items-start',
                'gap-1.5',
                'px-6',
            );
        });
    });

    describe('CardTitle', () => {
        it('should render card title', () => {
            // Act
            render(<CardTitle>Card Title</CardTitle>);

            // Assert
            const title = screen.getByText('Card Title');
            expect(title).toBeInTheDocument();
            expect(title).toHaveAttribute('data-slot', 'card-title');
        });

        it('should apply title classes', () => {
            // Act
            render(<CardTitle>Title</CardTitle>);

            // Assert
            const title = screen.getByText('Title');
            expect(title).toHaveClass('leading-none', 'font-semibold');
        });

        it('should support custom className', () => {
            // Act
            render(<CardTitle className="text-2xl">Large Title</CardTitle>);

            // Assert
            const title = screen.getByText('Large Title');
            expect(title).toHaveClass('text-2xl');
        });
    });

    describe('CardDescription', () => {
        it('should render card description', () => {
            // Act
            render(<CardDescription>This is a description</CardDescription>);

            // Assert
            const description = screen.getByText('This is a description');
            expect(description).toBeInTheDocument();
            expect(description).toHaveAttribute('data-slot', 'card-description');
        });

        it('should apply description classes', () => {
            // Act
            render(<CardDescription>Description</CardDescription>);

            // Assert
            const description = screen.getByText('Description');
            expect(description).toHaveClass('text-muted-foreground', 'text-sm');
        });
    });

    describe('CardContent', () => {
        it('should render card content', () => {
            // Act
            render(<CardContent>Main content here</CardContent>);

            // Assert
            const content = screen.getByText('Main content here');
            expect(content).toBeInTheDocument();
            expect(content).toHaveAttribute('data-slot', 'card-content');
        });

        it('should apply content classes', () => {
            // Act
            render(<CardContent>Content</CardContent>);

            // Assert
            const content = screen.getByText('Content');
            expect(content).toHaveClass('px-6');
        });
    });

    describe('CardAction', () => {
        it('should render card action', () => {
            // Act
            render(<CardAction>Action button</CardAction>);

            // Assert
            const action = screen.getByText('Action button');
            expect(action).toBeInTheDocument();
            expect(action).toHaveAttribute('data-slot', 'card-action');
        });

        it('should apply action positioning classes', () => {
            // Act
            render(<CardAction>Action</CardAction>);

            // Assert
            const action = screen.getByText('Action');
            expect(action).toHaveClass(
                'col-start-2',
                'row-span-2',
                'row-start-1',
                'self-start',
                'justify-self-end',
            );
        });
    });

    describe('CardFooter', () => {
        it('should render card footer', () => {
            // Act
            render(<CardFooter>Footer content</CardFooter>);

            // Assert
            const footer = screen.getByText('Footer content');
            expect(footer).toBeInTheDocument();
            expect(footer).toHaveAttribute('data-slot', 'card-footer');
        });

        it('should apply footer classes', () => {
            // Act
            render(<CardFooter>Footer</CardFooter>);

            // Assert
            const footer = screen.getByText('Footer');
            expect(footer).toHaveClass('flex', 'items-center', 'px-6');
        });
    });

    describe('Complete Card Structure', () => {
        it('should render full card with all components', () => {
            // Act
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Service Title</CardTitle>
                        <CardDescription>Service description here</CardDescription>
                        <CardAction>
                            <button>Action</button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <p>Main service content and details</p>
                    </CardContent>
                    <CardFooter>
                        <span>Footer information</span>
                    </CardFooter>
                </Card>,
            );

            // Assert
            expect(screen.getByText('Service Title')).toBeInTheDocument();
            expect(screen.getByText('Service description here')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
            expect(screen.getByText('Main service content and details')).toBeInTheDocument();
            expect(screen.getByText('Footer information')).toBeInTheDocument();
        });

        it('should handle nested interactive elements', () => {
            // Act
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Interactive Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <button>Primary Action</button>
                    </CardContent>
                    <CardFooter>
                        <a href="/learn-more">Learn More</a>
                    </CardFooter>
                </Card>,
            );

            // Assert
            expect(screen.getByRole('button', { name: 'Primary Action' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Learn More' })).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should support ARIA attributes on card', () => {
            // Act
            render(
                <Card role="article" aria-label="Service card">
                    <CardTitle>Accessible Card</CardTitle>
                </Card>,
            );

            // Assert
            const card = screen.getByRole('article');
            expect(card).toHaveAttribute('aria-label', 'Service card');
        });

        it('should maintain semantic structure', () => {
            // Act
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Semantic Structure</CardTitle>
                        <CardDescription>Well-structured content</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Content follows semantic HTML patterns</p>
                    </CardContent>
                </Card>,
            );

            // Assert
            const title = screen.getByText('Semantic Structure');
            const description = screen.getByText('Well-structured content');
            const content = screen.getByText('Content follows semantic HTML patterns');

            expect(title).toBeInTheDocument();
            expect(description).toBeInTheDocument();
            expect(content).toBeInTheDocument();
        });
    });

    describe('Props Forwarding', () => {
        it('should forward native div props to all components', () => {
            // Act
            render(
                <div>
                    <Card id="test-card">Card</Card>
                    <CardHeader id="test-header">Header</CardHeader>
                    <CardTitle id="test-title">Title</CardTitle>
                    <CardDescription id="test-desc">Description</CardDescription>
                    <CardContent id="test-content">Content</CardContent>
                    <CardAction id="test-action">Action</CardAction>
                    <CardFooter id="test-footer">Footer</CardFooter>
                </div>,
            );

            // Assert
            expect(screen.getByText('Card')).toHaveAttribute('id', 'test-card');
            expect(screen.getByText('Header')).toHaveAttribute('id', 'test-header');
            expect(screen.getByText('Title')).toHaveAttribute('id', 'test-title');
            expect(screen.getByText('Description')).toHaveAttribute('id', 'test-desc');
            expect(screen.getByText('Content')).toHaveAttribute('id', 'test-content');
            expect(screen.getByText('Action')).toHaveAttribute('id', 'test-action');
            expect(screen.getByText('Footer')).toHaveAttribute('id', 'test-footer');
        });
    });
});
