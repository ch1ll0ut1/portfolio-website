/**
 * Loads one route in one case, collects every way it fails, and screenshots it.
 */

import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { measureOverflow, sweepPage, waitForReveals } from './pageProbes.mjs';
import { expectedStatus } from './routes.mjs';

/** Console noise that is expected and not a defect. */
const IGNORED_ERRORS = [
    /favicon/i,
    /Download the React DevTools/i,
];

const slug = route => (route === '/' ? 'home' : route.replace(/^\/+|\/+$/g, '').replace(/\//g, '-'));

/**
 * Renders `route` under `testCase` against `base`, writing its screenshot to
 * `out`. Resolves to the route, the case name, the errors found and the
 * screenshot's path (null when the page never loaded).
 */
export const checkRoute = async (browser, route, testCase, { base, out }) => {
    const context = await browser.newContext({
        viewport: testCase.viewport,
        colorScheme: testCase.colorScheme,
        reducedMotion: testCase.reducedMotion,
        deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];

    const url = `${base}${route}`;
    const expected = expectedStatus(route);

    /**
     * A route expected to 404 makes the browser log its own document as a
     * failed resource. Matched on the document's URL rather than on the text
     * alone, so a genuinely missing image or font on that same page is still
     * reported.
     */
    const isExpectedDocument404 = message => expected === 404
      && /status of 404/.test(message.text())
      && message.location().url === url;

    page.on('console', (message) => {
        if (message.type() !== 'error' || isExpectedDocument404(message)) {
            return;
        }

        const text = message.text();

        if (!IGNORED_ERRORS.some(pattern => pattern.test(text))) {
            errors.push(text);
        }
    });
    page.on('pageerror', (error) => {
        errors.push(`pageerror: ${String(error)}`);
    });

    // 'load' rather than 'networkidle': the dev server holds an HMR socket open,
    // so networkidle may never settle and simply times out under load.
    let response = null;

    try {
        response = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    }
    catch (error) {
        errors.push(`navigation failed: ${String(error).split('\n')[0]}`);
    }

    if (response && response.status() !== expected) {
        errors.push(`HTTP ${response.status()}, expected ${expected}`);
    }

    // Nothing below can run meaningfully if the page never loaded.
    if (errors.length > 0) {
        await context.close();

        return { route, testCase: testCase.name, errors, file: null };
    }

    const reached = await sweepPage(page);

    if (reached.bottom < reached.height - reached.viewport - 2) {
        errors.push(`sweep stalled at ${reached.bottom}px of ${reached.height - reached.viewport}px`);
    }

    // Anything still armed was never released, so it is invisible to a reader.
    const stuck = await waitForReveals(page);

    if (stuck.length > 0) {
        errors.push(`content left hidden after scrolling: ${stuck.join(', ')}`);
    }

    const overflow = await measureOverflow(page);

    if (overflow) {
        errors.push(`horizontal overflow of ${overflow.overshoot}px — ${overflow.culprits.join(', ')}`);
    }

    const file = join(out, `${slug(route)}--${testCase.name}.png`);

    await mkdir(dirname(file), { recursive: true });
    await page.screenshot({ path: file, fullPage: true });
    await context.close();

    return { route, testCase: testCase.name, errors, file };
};
