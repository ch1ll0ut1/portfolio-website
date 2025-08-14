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
        it('should render with content and data attributes', () => {
            render(<Card>Card content</Card>);

            const card = screen.getByText('Card content');
            expect(card).toBeInTheDocument();
            expect(card).toHaveAttribute('data-slot', 'card');
        });

        it('should handle custom className prop', () => {
            render(<Card className="custom-card">Test</Card>);

            const card = screen.getByText('Test');
            expect(card).toHaveClass('custom-card');
        });
    });

    describe('CardHeader', () => {
        it('should render with proper structure', () => {
            render(<CardHeader>Header content</CardHeader>);

            const header = screen.getByText('Header content');
            expect(header).toBeInTheDocument();
            expect(header).toHaveAttribute('data-slot', 'card-header');
        });
    });

    describe('CardTitle', () => {
        it('should render as div element', () => {
            render(<CardTitle>Card Title</CardTitle>);

            const title = screen.getByText('Card Title');
            expect(title).toBeInTheDocument();
            expect(title.tagName).toBe('DIV');
        });
    });

    describe('CardDescription', () => {
        it('should render description text', () => {
            render(<CardDescription>Card description</CardDescription>);

            const description = screen.getByText('Card description');
            expect(description).toBeInTheDocument();
        });
    });

    describe('CardContent', () => {
        it('should render content area', () => {
            render(<CardContent>Main content</CardContent>);

            const content = screen.getByText('Main content');
            expect(content).toBeInTheDocument();
        });
    });

    describe('CardAction', () => {
        it('should render action area', () => {
            render(<CardAction>Action content</CardAction>);

            const action = screen.getByText('Action content');
            expect(action).toBeInTheDocument();
        });
    });

    describe('CardFooter', () => {
        it('should render footer area', () => {
            render(<CardFooter>Footer content</CardFooter>);

            const footer = screen.getByText('Footer content');
            expect(footer).toBeInTheDocument();
        });
    });

    describe('Component Composition', () => {
        it('should work together as a complete card', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Test Title</CardTitle>
                        <CardDescription>Test description</CardDescription>
                    </CardHeader>
                    <CardContent>Test content</CardContent>
                    <CardFooter>Test footer</CardFooter>
                </Card>,
            );

            expect(screen.getByText('Test Title')).toBeInTheDocument();
            expect(screen.getByText('Test description')).toBeInTheDocument();
            expect(screen.getByText('Test content')).toBeInTheDocument();
            expect(screen.getByText('Test footer')).toBeInTheDocument();
        });
    });
});
