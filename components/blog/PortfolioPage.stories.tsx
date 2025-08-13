import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PortfolioPage from './PortfolioPage';
import RootLayout from '../../app/layout';

/**
 * Storybook configuration for the PortfolioPage component.
 * Showcases the complete portfolio page layout with all sections.
 */
const meta = {
    title: 'Pages/PortfolioPage',
    component: PortfolioPage,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'The main portfolio page component showcasing all sections including hero, about, services, portfolio, experience, and CTA.',
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
} satisfies Meta<typeof PortfolioPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default portfolio page story showing the complete layout.
 */
export const Default: Story = {};
