import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
    stories: [
        '../**/*.stories.@(js|jsx|mjs|ts|tsx)',
    ],
    addons: [
        '@chromatic-com/storybook',
        '@storybook/addon-docs',
        '@storybook/addon-onboarding',
        '@storybook/addon-a11y',
        '@storybook/addon-vitest',
    ],
    framework: {
        name: '@storybook/nextjs-vite',
        options: {},
    },
    staticDirs: [
        '../public',
        { from: '../content', to: '/content' },
    ],
    // Configure Vite for Storybook
    viteFinal: async (config) => {
        // Ensure we can resolve TypeScript paths
        config.resolve = config.resolve ?? {};
        config.resolve.alias = Object.assign(
            {},
            config.resolve.alias,
            {
                '@': new URL('..', import.meta.url).pathname,
            },
        );

        return config;
    },
};

export default config;
