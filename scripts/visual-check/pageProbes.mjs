/**
 * What the sweep does inside a loaded page: scroll it end to end, wait for its
 * entrances, and measure horizontal overflow.
 */

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
export const sweepPage = page => page.evaluate(async () => {
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
export const waitForReveals = async (page) => {
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

/**
 * How far the page overflows horizontally, with the widest offenders named so
 * the failure is actionable, or null when it fits.
 */
export const measureOverflow = page => page.evaluate(() => {
    const doc = document.documentElement;
    const overshoot = doc.scrollWidth - doc.clientWidth;

    if (overshoot <= 1) {
        return null;
    }

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
