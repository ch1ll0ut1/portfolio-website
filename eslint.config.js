import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import nextPlugin from '@next/eslint-plugin-next';

export default tseslint.config(
    {
        ignores: [
            "dist",
            "node_modules",
            ".next",
            "eslint.config.js",
            "next.config.mjs",
            // Agent worktrees: full checkouts of the repo, linted in their own right.
            '.claude/**',
        ]
    },
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    stylistic.configs.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    reactHooks.configs.flat.recommended,
    jsxA11y.flatConfigs.recommended,
    nextPlugin.flatConfig.recommended,
    nextPlugin.flatConfig.coreWebVitals,
    {
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
                node: true,
            },
            react: {
                version: 'detect',
            },
        },
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    // Node-only dev scripts are not part of the app's tsconfig, but
                    // should still be linted.
                    allowDefaultProject: ['scripts/*.mjs'],
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            // Stylistic rules
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/indent': ['error', 4],
            '@stylistic/member-delimiter-style': ['error', {
                multiline: { delimiter: 'semi', requireLast: true },
                singleline: { delimiter: 'semi', requireLast: false },
            }],

            // React Stylistic rules
            '@stylistic/jsx-indent-props': ['error', 4],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                    leadingUnderscore: 'forbid',
                    trailingUnderscore: 'forbid',
                },
                {
                    selector: 'function',
                    format: ['camelCase', 'PascalCase'],
                    leadingUnderscore: 'forbid',
                    trailingUnderscore: 'forbid',
                },
            ],

            // Developer Experience
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                { allowNumber: true, allowNever: true, allowNullish: true }
            ],
            '@typescript-eslint/require-await': 'off',

            // Disable rules already checked by TypeScript
            '@typescript-eslint/no-undef': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-dupe-class-members': 'off',
            '@typescript-eslint/no-redeclare': 'off',
            '@typescript-eslint/no-loss-of-precision': 'off',

            // Next.js requires default exports for pages
            'import/no-default-export': 'off',

            // A scrollable region has to be focusable so keyboard users can scroll
            // it (axe: scrollable-region-focusable); `region` plus a label names it.
            'jsx-a11y/no-noninteractive-tabindex': ['error', {
                tags: [],
                roles: ['tabpanel', 'region'],
                allowExpressionValues: true,
            }],

            // React rules
            'react/prop-types': 'off', // We use TypeScript
            'react/react-in-jsx-scope': 'off' // Not needed with new JSX transform
        }
    },
    {
        // Test file specific rules
        files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-confusing-void-expression': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@next/next/no-img-element': 'off',
        },
    },
    /*
     * Known violations scheduled for later work in the improvement plan. Each
     * block downgrades only the named rules, only in the named files, so new code
     * is still held to them. Delete a block when its plan item lands.
     */
    {
        // E10: latest-value refs written during render, to be replaced with
        // `useEffectEvent` once React is on 19.2. The memoization the compiler
        // cannot preserve in useCareerLog is a consequence of the same refs.
        files: [
            'components/home/experience/Experience.tsx',
            'components/home/experience/useCareerLog.ts',
            'components/home/work/caseStack.ts',
            'components/home/writing/PipelineCanvas.tsx',
            'components/nav/useSlidingPill.ts',
            'lib/motion/useInView.ts',
            'lib/motion/useRaf.ts',
            'lib/motion/useScrollState.ts',
            'lib/motion/useScrub.ts',
            'lib/motion/useStageEvent.ts',
            'lib/scrollTracking.ts',
            'lib/timeTracking.ts',
        ],
        rules: {
            'react-hooks/refs': 'warn',
            'react-hooks/preserve-manual-memoization': 'warn',
        },
    },
    {
        // E9: media-query and stage subscriptions mirrored into state from an
        // effect, to become one `useSyncExternalStore`-based hook.
        files: [
            'lib/motion/useFinePointer.ts',
            'lib/motion/useReducedMotion.ts',
            'lib/motion/useIntro.ts',
        ],
        rules: {
            'react-hooks/set-state-in-effect': 'warn',
        },
    },
    {
        // A4: the command palette is reworked to the APG combobox pattern.
        files: ['components/chrome/CommandPalette.tsx', 'components/chrome/CommandList.tsx'],
        rules: {
            'react-hooks/set-state-in-effect': 'warn',
            'jsx-a11y/click-events-have-key-events': 'warn',
        },
    },
    {
        // A5: the hand-rolled modals move to native `<dialog>` + `showModal()`.
        files: [
            'components/chrome/Overlay.tsx',
            'components/chrome/ShortcutsOverlay.tsx',
            'components/consent/ConsentPreferencesModal.tsx',
        ],
        rules: {
            'react-hooks/set-state-in-effect': 'warn',
            'jsx-a11y/no-noninteractive-element-interactions': 'warn',
        },
    },
    {
        // A3: the contenteditable h1 becomes an explicit, opt-in textbox widget.
        files: ['components/home/hero/HeadlineEditor.tsx'],
        rules: {
            'jsx-a11y/no-noninteractive-element-interactions': 'warn',
        },
    },
    {
        // Consent and analytics rework (E15/E16 and the consent wave): a callback
        // used before its declaration, and `Date.now()` read during render.
        files: ['components/consent/ConsentContext.tsx', 'lib/scrollTracking.ts', 'lib/timeTracking.ts'],
        rules: {
            'react-hooks/immutability': 'warn',
            'react-hooks/purity': 'warn',
        },
    },
    {
        // Not yet in the plan: focusable preview rows in the project index, and
        // the hover preview mirroring its prop into state from an effect. Both
        // need a design decision rather than a lint fix.
        files: ['components/home/work/MoreProjects.tsx', 'components/home/work/ProjectPreview.tsx'],
        rules: {
            'jsx-a11y/no-noninteractive-tabindex': 'warn',
            'react-hooks/set-state-in-effect': 'warn',
        },
    },
    {
        // Node-only dev scripts. Not part of the app build and not type-checked by
        // the app's tsconfig, so the type-aware rules have nothing to work with.
        files: ['scripts/**/*.mjs'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unnecessary-type-conversion': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/restrict-plus-operands': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
        },
    }
);
