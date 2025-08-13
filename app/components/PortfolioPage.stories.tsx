import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PortfolioPage from './PortfolioPage';
import RootLayout from '../layout';

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

/**
 * Portfolio page with mobile viewport for responsive testing.
 */
export const Mobile: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};

/**
 * Portfolio page with tablet viewport for responsive testing.
 */
export const Tablet: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
};

/**
 * Portfolio page with desktop viewport for responsive testing.
 */
export const Desktop: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'desktop',
        },
    },
};
