/**
 * Renders routes across theme, viewport and motion-preference combinations,
 * failing on console errors or horizontal overflow.
 *
 * Mirrors the design prototype's own check harness, so the ported site is held
 * to the same bar: it must read and work in dark, light, at 390px, and with
 * reduced motion.
 *
 * Usage:
 *   node scripts/visual-check.mjs [--base http://localhost:3000]
 *                                 [--routes /,/blog] [--out .visual-check]
 *                                 [--only desktop-dark,mobile-dark]
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';

const argOf = (name, fallback) => {
    const index = process.argv.indexOf(`--${name}`);

    return index >= 0 ? process.argv[index + 1] : fallback;
};

const BASE = argOf('base', 'http://localhost:3000');
const OUT = argOf('out', '.visual-check');
const ROUTES = argOf('routes', '/').split(',').filter(Boolean);

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const ALL_CASES = [
    { name: 'desktop-dark', viewport: DESKTOP, colorScheme: 'dark', reducedMotion: 'no-preference' },
    { name: 'desktop-light', viewport: DESKTOP, colorScheme: 'light', reducedMotion: 'no-preference' },
    { name: 'mobile-dark', viewport: MOBILE, colorScheme: 'dark', reducedMotion: 'no-preference' },
    { name: 'reduced-dark', viewport: DESKTOP, colorScheme: 'dark', reducedMotion: 'reduce' },
];

const only = argOf('only', '');
const cases = only
    ? ALL_CASES.filter(item => only.split(',').includes(item.name))
    : ALL_CASES;

/** Console noise that is expected and not a defect. */
const IGNORED_ERRORS = [
    /favicon/i,
    /Download the React DevTools/i,
];

const slug = route => (route === '/' ? 'home' : route.replace(/^\/+|\/+$/g, '').replace(/\//g, '-'));

const checkRoute = async (browser, route, testCase) => {
    const context = await browser.newContext({
        viewport: testCase.viewport,
        colorScheme: testCase.colorScheme,
        reducedMotion: testCase.reducedMotion,
        deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];

    page.on('console', (message) => {
        if (message.type() !== 'error') {
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

    const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 45000 });

    if (!response?.ok()) {
        errors.push(`HTTP ${response ? response.status() : 'no response'}`);
    }

    // Scroll the whole page first. Entrances are triggered by an observer, so
    // without this a full-page screenshot captures every below-fold section in
    // its armed (hidden) pre-state, which hides both the design and real bugs.
    await page.evaluate(async () => {
        const step = Math.round(window.innerHeight * 0.75);
        const sleep = ms => new Promise((resolve) => {
            setTimeout(resolve, ms);
        });

        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await sleep(120);
        }

        window.scrollTo(0, document.documentElement.scrollHeight);
        await sleep(300);
        window.scrollTo(0, 0);
        await sleep(300);
    });

    // Let the entrances that just fired finish.
    await page.waitForTimeout(1600);

    // Anything still armed was never released, so it is invisible to a reader.
    const stuck = await page.evaluate(() => Array.from(document.querySelectorAll('.is-armed'))
        .filter(element => !element.classList.contains('is-in'))
        .slice(0, 5)
        .map((element) => {
            const text = (element.textContent || '').trim().slice(0, 40);

            return `${element.tagName.toLowerCase()} "${text}"`;
        }));

    if (stuck.length > 0) {
        errors.push(`content left hidden after scrolling: ${stuck.join(', ')}`);
    }

    const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const overshoot = doc.scrollWidth - doc.clientWidth;

        if (overshoot <= 1) {
            return null;
        }

        // Name the widest offenders so the failure is actionable.
        const culprits = Array.from(document.body.querySelectorAll('*'))
            .map((element) => {
                const rect = element.getBoundingClientRect();

                return { element, right: rect.right, left: rect.left };
            })
            .filter(entry => entry.right > doc.clientWidth + 1 || entry.left < -1)
            .slice(0, 5)
            .map((entry) => {
                const classes = String(entry.element.className || '').split(/\s+/).filter(Boolean).slice(0, 2).join('.');

                return `${entry.element.tagName.toLowerCase()}${classes ? `.${classes}` : ''} (right ${Math.round(entry.right)})`;
            });

        return { overshoot, culprits };
    });

    if (overflow) {
        errors.push(`horizontal overflow of ${overflow.overshoot}px — ${overflow.culprits.join(', ')}`);
    }

    const file = join(OUT, `${slug(route)}--${testCase.name}.png`);

    await mkdir(dirname(file), { recursive: true });
    await page.screenshot({ path: file, fullPage: true });
    await context.close();

    return { route, testCase: testCase.name, errors, file };
};

const main = async () => {
    const browser = await chromium.launch();
    const results = [];

    for (const route of ROUTES) {
        for (const testCase of cases) {
            results.push(await checkRoute(browser, route, testCase));
        }
    }

    await browser.close();

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

await main();
