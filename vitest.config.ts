import { defineConfig } from 'vitest/config';
import path from 'node:path';

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
    'components/home/hero/editorDom.test.ts',
    'components/home/hero/headlineCommands.test.ts',
    'components/home/hero/heroIntro.test.ts',
    'components/home/proof/marqueeEngine.test.ts',
    'components/home/work/visuals/runner.test.ts',
    'components/nav/retypeMark.test.ts',
    'lib/analytics.test.ts',
    'lib/bootScript.test.ts',
    'lib/consentStorage.test.ts',
    'lib/motion/inView.test.ts',
    'lib/motion/scramble.test.ts',
    'lib/motion/scrollStore.test.ts',
    'lib/motion/splitWords.test.ts',
    'lib/motion/stage.test.ts',
    'lib/motion/ticker.test.ts',
    'lib/motion/toast.test.ts',
    'lib/scrollTracking.test.ts',
    'lib/timeTracking.test.ts',
    'lib/whenIdle.test.ts',
];

/** Never collected: dependencies, and agent worktrees that are full repo checkouts. */
const EXCLUDED = ['**/node_modules/**', '.claude/**'];

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: 'dom',
                    environment: 'jsdom',
                    include: ['**/*.test.tsx', ...DOM_TS_TESTS],
                    exclude: EXCLUDED,
                    setupFiles: ['./test/setup.ts'],
                },
            },
            {
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
            // A ratchet, set about a point under the coverage measured on
            // Vitest 5 (68.5% lines, 68.6% statements, 64.2% branches, 71.1%
            // functions): a change that drops it fails CI. Raise it as tests
            // are added; never lower it to pass. Since Vitest 4 the v8 provider
            // remaps through the AST, so a file no test loads counts its
            // branches and functions as uncovered rather than as 100% — hence
            // branches sitting far below the 88% that Vitest 3 reported for
            // the same tests.
            thresholds: {
                lines: 67,
                statements: 67,
                branches: 63,
                functions: 70,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './'),
            // The `server-only` marker throws outside a Server Component build.
            // Tests import server modules directly, so they get the no-op
            // export Next itself resolves it to on the server.
            'next/dist/compiled/server-only': 'next/dist/compiled/server-only/empty.js',
        },
    },
});
