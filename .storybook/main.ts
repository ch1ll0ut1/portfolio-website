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
    // Allow Storybook to read md files from the content directory (blog articles)
    viteFinal: async (config) => {
        // Configure Vite to handle Node.js modules in browser
        config.define = config.define ?? {};
        config.define.global = 'globalThis';
        config.define.process = JSON.stringify({
            env: {},
            cwd: () => '/fake-cwd',
        });

        // Configure resolve to handle Node.js polyfills
        config.resolve = config.resolve ?? {};
        config.resolve.alias = Object.assign(
            {},
            config.resolve.alias && !Array.isArray(config.resolve.alias) ? config.resolve.alias : {},
            {
                fs: 'memfs',
                path: 'path-browserify',
                process: 'process/browser',
            },
        );

        // Add polyfills for Node.js globals
        config.optimizeDeps = config.optimizeDeps ?? {};
        config.optimizeDeps.include = [
            ...(config.optimizeDeps.include ?? []),
            'path-browserify',
            'process/browser',
        ];

        return config;
    },
};

export default config;
