/**
 * Renders routes across theme, viewport and motion-preference combinations,
 * failing on console errors or horizontal overflow.
 *
 * Mirrors the design prototype's own check harness, so the ported site is held
 * to the same bar: it must read and work in dark, light, at 390px, and with
 * reduced motion.
 *
 * A bare run sweeps every route type the site has, so it cannot report a
 * confident green having loaded only the homepage. The articles it samples are
 * the newest published ones in the running site's sitemap.
 *
 * The pieces live in `scripts/visual-check/`: the command line and case matrix
 * (options), the route list (routes, publishedArticles), one route's check
 * (checkRoute) and what it does inside the page (pageProbes).
 *
 * Usage:
 *   node scripts/visual-check.mjs [--base http://localhost:3000]
 *                                 [--routes /,/blog] [--out .visual-check]
 *                                 [--only desktop-dark,mobile-dark]
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { checkRoute } from './visual-check/checkRoute.mjs';
import { BASE, OUT, cases } from './visual-check/options.mjs';
import { resolveRoutes } from './visual-check/routes.mjs';

const report = async (results) => {
    const failures = results.filter(result => result.errors.length > 0);

    for (const result of results) {
        const status = result.errors.length === 0 ? 'ok  ' : 'FAIL';

        console.log(`${status} ${result.route} [${result.testCase}] -> ${result.file}`);
        result.errors.forEach((error) => {
            console.log(`       ${error}`);
        });
    }

    await writeFile(join(OUT, 'report.json'), `${JSON.stringify(results, null, 2)}\n`);
    console.log(`\n${results.length - failures.length}/${results.length} passed. Screenshots in ${OUT}/`);

    if (failures.length > 0) {
        process.exitCode = 1;
    }
};

const main = async () => {
    const routes = await resolveRoutes(BASE);
    const browser = await chromium.launch();
    const results = [];

    for (const route of routes) {
        for (const testCase of cases) {
            try {
                results.push(await checkRoute(browser, route, testCase, { base: BASE, out: OUT }));
            }
            catch (error) {
                results.push({
                    route,
                    testCase: testCase.name,
                    errors: [`check threw: ${String(error).split('\n')[0]}`],
                    file: null,
                });
            }
        }
    }

    await browser.close();
    await report(results);
};

await main();
