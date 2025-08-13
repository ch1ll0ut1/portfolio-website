import type { Preview } from '@storybook/nextjs-vite';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },

        viewport: {
            options: {
                desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
                tablet: { name: 'Tablet', styles: { width: '1024px', height: '768px' } },
                mobile: { name: 'Mobile', styles: { width: '640px', height: '480px' } },
            },
        },
    },
};

export default preview;
