import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BlogPage from './BlogPage';
import RootLayout from '../layout';

/**
 * Storybook configuration for the BlogPage component.
 * Showcases the blog listing page layout with hero and post list.
 */
const meta = {
    title: 'Pages/BlogPage',
    component: BlogPage,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'The blog listing page component featuring a hero section and grid of blog post cards.',
            },
        },
    },
    tags: [''],
    decorators: [
        (Story) => {
            return (
                <RootLayout>
                    <Story />
                </RootLayout>
            );
        },
    ],
} satisfies Meta<typeof BlogPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default blog page story showing the complete blog listing.
 */
export const Default: Story = {};

/**
 * Blog page with mobile viewport for responsive testing.
 */
export const Mobile: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};

/**
 * Blog page with tablet viewport for responsive testing.
 */
export const Tablet: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
};

/**
 * Blog page with desktop viewport for responsive testing.
 */
export const Desktop: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'desktop',
        },
    },
};
