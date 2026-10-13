/**
 * Runs an axe-core scan of every route type in both color themes and prints
 * the violations, failing when there are any.
 *
 * The themes are switched through `prefers-color-scheme`, which is what decides
 * the tokens while no explicit choice is stored, so the scan sees exactly what a
 * first-time visitor in either OS theme sees.
 *
 * Usage:
 *   node scripts/a11y-check.mjs [--base http://localhost:3000] [--routes /,/blog]
 */

import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright';
import { publishedArticles } from './visual-check/publishedArticles.mjs';

const argOf = (name, fallback) => {
    const index = process.argv.indexOf(`--${name}`);

    return index >= 0 ? process.argv[index + 1] : fallback;
};

const BASE = argOf('base', 'http://localhost:3000');
const THEMES = ['dark', 'light'];
/** WCAG 2.2 A and AA, which is the bar the site holds itself to. */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** The newest published post, from the same sitemap the visual check samples. */
const newestArticle = async () => (await publishedArticles(BASE)).slice(0, 1);

const routes = async () => {
    const listed = argOf('routes', '');

    if (listed) {
        return listed.split(',');
    }

    return ['/', '/blog', ...await newestArticle(), '/privacy'];
};

const scan = async (browser, route, theme) => {
    const context = await browser.newContext({ colorScheme: theme, viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    // Let the intro settle, so the scan reads the page at rest.
    await page.waitForTimeout(1500);

    const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    await context.close();

    return result.violations;
};

const main = async () => {
    const browser = await chromium.launch();
    let total = 0;

    for (const route of await routes()) {
        for (const theme of THEMES) {
            const violations = await scan(browser, route, theme);

            total += violations.length;
            console.log(`${route} [${theme}]: ${violations.length} violation(s)`);

            for (const violation of violations) {
                console.log(`  - ${violation.id} (${violation.impact}, ${violation.nodes.length} node(s)): ${violation.help}`);

                for (const node of violation.nodes) {
                    console.log(`      ${node.target.join(' ')} — ${node.failureSummary?.split('\n').slice(1).join(' ').trim()}`);
                }
            }
        }
    }

    await browser.close();
    process.exitCode = total > 0 ? 1 : 0;
};

await main();
