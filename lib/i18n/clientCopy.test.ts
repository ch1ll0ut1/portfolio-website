/**
 * Guards that a page's browser bundle holds one language's words only.
 *
 * From every client module (`'use client'`), follows its value imports
 * through the repo, as the bundler would, and fails if both an English and a
 * German dictionary file (`config/<domain>/en.ts` and `de.ts`) can be reached.
 * A client component that reads a `Record<Locale, …>` dictionary, or imports
 * anything from a module that builds data from one, trips it; reading the
 * words through `useCopy` or taking them as props does not.
 */

import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const SOURCE_DIRS = ['app', 'components', 'lib'];

/** The one client module that carries both languages: the last-resort error page, outside either root layout. */
const BILINGUAL = new Set(['app/global-error.tsx']);

const DICTIONARY = /^config\/.+\/(en|de|faqEn|faqDe|enLists|deLists)\.ts$/;

const walk = (dir: string): string[] => fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(dir, entry.name);

    if (entry.isDirectory()) {
        return walk(relative);
    }

    return /\.tsx?$/.test(entry.name) && !/\.(test|d)\.tsx?$/.test(entry.name) ? [relative] : [];
});

const resolve = (from: string, specifier: string): string | null => {
    let base: string;

    if (specifier.startsWith('@/')) {
        base = specifier.slice(2);
    }
    else if (specifier.startsWith('.')) {
        base = path.join(path.dirname(from), specifier);
    }
    else {
        return null;
    }

    const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')];

    return candidates.find(candidate => /\.tsx?$/.test(candidate) && fs.existsSync(path.join(ROOT, candidate))) ?? null;
};

/** The modules `file` imports for their values: `import type` and `export type` bring nothing into a bundle. */
const valueImports = (file: string) => {
    const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const statements = [...text.matchAll(/^(import|export)\s+(?!type\s)[^;]*?from\s+'([^']+)'/gm), ...text.matchAll(/import\('([^']+)'\)/g)];

    return statements
        .map(match => resolve(file, match[2] ?? match[1] ?? ''))
        .filter((resolved): resolved is string => resolved !== null);
};

const reachable = (entry: string) => {
    const seen = new Set<string>();
    const queue = [entry];

    while (queue.length > 0) {
        const file = queue.pop() ?? '';

        if (seen.has(file)) {
            continue;
        }

        seen.add(file);
        queue.push(...valueImports(file));
    }

    return seen;
};

const clientModules = SOURCE_DIRS.flatMap(walk)
    .filter(file => /^\s*(\/\*[\s\S]*?\*\/\s*)?['"]use client['"]/.test(fs.readFileSync(path.join(ROOT, file), 'utf8')))
    .filter(file => !BILINGUAL.has(file));

describe('client bundles', () => {
    it('should find the client modules', () => {
        expect(clientModules.length).toBeGreaterThan(50);
    });

    it.each(clientModules)('should reach one language\'s dictionaries at most from %s', (file) => {
        const dictionaries = [...reachable(file)].filter(module => DICTIONARY.test(module));
        const languages = new Set(dictionaries.map(module => (/(de|De)(Lists)?\.ts$/.test(module) ? 'de' : 'en')));

        expect(languages.size, dictionaries.join(', ')).toBeLessThanOrEqual(1);
    });

    it('should catch a client module that reads both languages', () => {
        const reached = [...reachable('app/global-error.tsx')].filter(module => DICTIONARY.test(module));

        expect(reached).toEqual(expect.arrayContaining(['config/errors/en.ts', 'config/errors/de.ts']));
    });
});
