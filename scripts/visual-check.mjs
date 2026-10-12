/**
 * Renders routes across theme, viewport and motion-preference combinations,
 * failing on console errors or horizontal overflow.
 *
 * Mirrors the design prototype's own check harness, so the ported site is held
 * to the same bar: it must read and work in dark, light, at 390px, and with
 * reduced motion.
 *
 * A bare run sweeps every route type the site has, so it cannot report a
 * confident green having loaded only the homepage.
 *
 * Usage:
 *   node scripts/visual-check.mjs [--base http://localhost:3000]
 *                                 [--routes /,/blog] [--out .visual-check]
 *                                 [--only desktop-dark,mobile-dark]
 */

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const argOf = (name, fallback) => {
    const index = process.argv.indexOf(`--${name}`);

    return index >= 0 ? process.argv[index + 1] : fallback;
};

const BASE = argOf('base', 'http://localhost:3000');
const OUT = argOf('out', '.visual-check');

/** Exercises the not-found branch of /blog/[slug]. */
const MISSING_ARTICLE = '/blog/this-article-does-not-exist';
/**
 * It is swept *because* it 404s. The not-found page carries the same nav,
 * chrome and footer as any other route, so it has to read as well as they do —
 * and asserting the status here is what keeps the route from regressing back
 * into a soft 404 that answers 200 and can be indexed.
 */
const MISSING_ARTICLE_STATUS = 404;
const BLOG_CONFIG = join(dirname(fileURLToPath(import.meta.url)), '..', 'config', 'blog.ts');
/** Two articles is enough to catch template-wide breakage. */
const ARTICLE_SAMPLE = 2;

/**
 * The newest published slugs, read from the blog config.
 *
 * The config is the only place `published` lives — the markdown carries no
 * frontmatter and an unpublished post still has a file — so listing
 * `content/blog/` would check posts the site does not serve. Post objects hold
 * no nested braces, so matching block by block keeps `slug` and `published`
 * paired whatever the field order, and survives posts being renamed or retired.
 */
const publishedArticles = async () => {
    const source = await readFile(BLOG_CONFIG, 'utf8');
    const posts = (source.match(/\{[^{}]*\}/g) ?? [])
        .filter(block => /\bpublished:\s*true\b/.test(block))
        .map(block => ({
            slug: /\bslug:\s*'([^']+)'/.exec(block)?.[1],
            date: /\bdate:\s*'([^']+)'/.exec(block)?.[1] ?? '',
        }))
        .filter(post => post.slug);

    // Silently checking fewer routes is the trap this default exists to close.
    if (posts.length < ARTICLE_SAMPLE) {
        throw new Error(`expected ${ARTICLE_SAMPLE}+ published posts in config/blog.ts, found ${posts.length}`);
    }

    return posts
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, ARTICLE_SAMPLE)
        .map(post => `/blog/${post.slug}`);
};

/** Every route type by default; `--routes` narrows it for a quick check. */
const resolveRoutes = async () => {
    const override = argOf('routes', '');

    return override
        ? override.split(',').filter(Boolean)
        : ['/', '/blog', ...await publishedArticles(), MISSING_ARTICLE, '/privacy'];
};

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

/** Longest an entrance is given to be released before it counts as stuck. */
const REVEAL_TIMEOUT_MS = 10000;
const REVEAL_POLL_MS = 150;
/** One `--dur-m` plus the line stagger, so a released entrance has finished. */
const SETTLE_MS = 1200;

/**
 * Walks the page top to bottom and back, so every observer-driven entrance has
 * had its chance to fire.
 *
 * The page sets `scroll-behavior: smooth` globally, which makes a stepped
 * `window.scrollTo` *animate*. A loop that sleeps a fixed amount between steps
 * then races its own animation and never reaches the bottom — which is what
 * made this check report a different set of "hidden" sections on every run. So
 * the sweep turns smooth scrolling off for its duration, and advances only once
 * the browser confirms it actually moved.
 *
 * Returns how far it got, so a stall is reported as a failure rather than read
 * as a clean page.
 */
const sweepPage = page => page.evaluate(async () => {
    const doc = document.documentElement;
    const previous = doc.style.scrollBehavior;
    const sleep = ms => new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

    doc.style.scrollBehavior = 'auto';

    const step = Math.round(window.innerHeight * 0.5);
    let bottom = 0;
    let stalled = 0;

    // Re-reads scrollHeight every lap: a section that grows as it reveals
    // moves the bottom of the page while the sweep is still on its way down.
    for (let guard = 0; guard < 400; guard += 1) {
        const limit = Math.max(0, doc.scrollHeight - window.innerHeight);

        window.scrollTo(0, Math.min(window.scrollY + step, limit));
        await sleep(160);

        const now = Math.round(window.scrollY);

        // One lap that fails to advance is not proof the bottom is real. A
        // short page can start with nothing to scroll at all and only grow
        // once its entrances release, and breaking on that first lap left the
        // sweep reporting a stall at 0px against the page's final height.
        if (now <= bottom) {
            stalled += 1;

            if (stalled >= 2) {
                break;
            }
        }
        else {
            stalled = 0;
        }

        bottom = Math.max(bottom, now);
    }

    await sleep(300);
    window.scrollTo(0, 0);
    await sleep(300);
    doc.style.scrollBehavior = previous;

    return { bottom, height: doc.scrollHeight, viewport: window.innerHeight };
});

/**
 * Waits for every armed entrance to be released, then for the releases to play.
 *
 * Waits on the condition rather than on a fixed budget: a slow machine gets the
 * time it needs, and a genuinely stuck element is still reported — it is simply
 * reported after the deadline instead of after a guess.
 */
const waitForReveals = async (page) => {
    const read = () => page.evaluate(() => Array.from(document.querySelectorAll('.is-armed'))
        .filter(element => !element.classList.contains('is-in'))
        .slice(0, 5)
        .map((element) => {
            const text = (element.textContent || '').trim().slice(0, 40);

            return `${element.tagName.toLowerCase()} "${text}"`;
        }));

    const deadline = Date.now() + REVEAL_TIMEOUT_MS;
    let stuck = await read();

    while (stuck.length > 0 && Date.now() < deadline) {
        await page.waitForTimeout(REVEAL_POLL_MS);
        stuck = await read();
    }

    // Released, but mid-transition: the screenshot should show the end state.
    await page.waitForTimeout(SETTLE_MS);

    return stuck;
};

const checkRoute = async (browser, route, testCase) => {
    const context = await browser.newContext({
        viewport: testCase.viewport,
        colorScheme: testCase.colorScheme,
        reducedMotion: testCase.reducedMotion,
        deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];

    const url = `${BASE}${route}`;
    const expected = route === MISSING_ARTICLE ? MISSING_ARTICLE_STATUS : 200;

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
    const routes = await resolveRoutes();
    const browser = await chromium.launch();
    const results = [];

    for (const route of routes) {
        for (const testCase of cases) {
            try {
                results.push(await checkRoute(browser, route, testCase));
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
