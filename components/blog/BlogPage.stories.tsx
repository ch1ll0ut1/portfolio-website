import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BlogPage from './BlogPage';
import RootLayout from '../../app/layout';

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
        chromatic: {
            modes: {
                desktop: {
                    viewport: 'desktop',
                },
                mobile: {
                    viewport: 'mobile',
                },
                tablet: {
                    viewport: 'tablet',
                },
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
