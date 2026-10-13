import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Plain `.ts` tests that need a DOM. Everything else in `.ts` is pure logic and
 * runs in Node, which skips jsdom's start-up cost for every one of those files.
 * A `.ts` test that touches `document` or `window` fails in Node with a
 * "not defined" error — add it here.
 */
const DOM_TS_TESTS = [
    'components/chrome/caretCursorEngine.test.ts',
    'components/chrome/isEditingTarget.test.ts',
    'components/chrome/pickCursorMode.test.ts',
    'components/chrome/runCommand.test.ts',
    'components/chrome/themeStore.test.ts',
    'components/home/contact/outboundTracking.test.ts',
    'components/home/contact/wordmarkFit.test.ts',
    'components/home/experience/hashScramble.test.ts',
    'components/home/hero/editorDom.test.ts',
    'components/home/hero/headlineCommands.test.ts',
    'components/home/process/scramble.test.ts',
    'components/home/proof/marqueeEngine.test.ts',
    'components/home/work/visuals/runner.test.ts',
    'components/nav/retypeMark.test.ts',
    'lib/analytics.test.ts',
    'lib/consentStorage.test.ts',
    'lib/motion/inView.test.ts',
    'lib/motion/scrollStore.test.ts',
    'lib/motion/splitWords.test.ts',
    'lib/motion/ticker.test.ts',
    'lib/motion/toast.test.ts',
    'lib/scrollTracking.test.ts',
    'lib/timeTracking.test.ts',
];

/** Never collected: dependencies, and agent worktrees that are full repo checkouts. */
const EXCLUDED = ['**/node_modules/**', '.claude/**'];

export default defineConfig({
    // tsconfig keeps `jsx: preserve` for Next, which would otherwise make esbuild
    // compile JSX to `React.createElement` and need React in scope in every test.
    // Next itself uses the automatic runtime, so the tests do too.
    esbuild: {
        jsx: 'automatic',
    },
    test: {
        projects: [
            {
                extends: true,
                test: {
                    name: 'dom',
                    environment: 'jsdom',
                    include: ['**/*.test.tsx', ...DOM_TS_TESTS],
                    exclude: EXCLUDED,
                    setupFiles: ['./test/setup.ts'],
                },
            },
            {
                extends: true,
                test: {
                    name: 'node',
                    environment: 'node',
                    include: ['**/*.test.ts'],
                    exclude: [...EXCLUDED, ...DOM_TS_TESTS],
                },
            },
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['app/**', 'components/**', 'config/**', 'lib/**'],
            exclude: ['.claude/**', '**/*.test.{ts,tsx}', '**/*.d.ts', '**/*.css'],
            // A ratchet, set just under the measured coverage (66.2% lines and
            // statements, 86.6% branches, 72% functions): a change that drops
            // it fails CI. Raise it as tests are added; never lower it to pass.
            thresholds: {
                lines: 65,
                statements: 65,
                branches: 85,
                functions: 70,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
            // The `server-only` marker throws outside a Server Component build.
            // Tests import server modules directly, so they get the no-op
            // export Next itself resolves it to on the server.
            'next/dist/compiled/server-only': 'next/dist/compiled/server-only/empty.js',
        },
    },
});
