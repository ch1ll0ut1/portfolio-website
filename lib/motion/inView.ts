/**
 * Arm-then-fire visibility, the backbone of "content is visible at rest".
 *
 * An element approaching the viewport is first *armed* (put into its hidden
 * pre-state) and then animated when it actually enters. Anything already on
 * screen is never armed, so content that was visible on load is never hidden
 * and re-revealed — it takes the `onIntro` path instead, or, with no `onIntro`
 * given, goes straight to `onEnter`.
 */

import { prefersReducedMotion } from './env';
import { isIntroDone, onStage } from './stage';

export interface InViewOptions {
    /** Put the element into its hidden pre-state. */
    onArm?: () => void;
    /** Run the entrance. Fires at most once. */
    onEnter?: () => void;
    /**
     * Run instead of arm/enter when the element is already visible on load.
     *
     * Omit it and an element on screen at setup runs `onEnter` immediately
     * instead — never `onArm`. Supply one (even a no-op) whenever `onEnter`
     * would hide content first, since on screen at setup means the visitor is
     * already looking at it.
     */
    onIntro?: () => void;
    /**
     * Run when the element reaches the screen before it could be armed:
     * scrolled in faster than the arm margin, or from above. It is otherwise
     * left as it is, so this is for content whose resting state needs a nudge.
     */
    onSkip?: () => void;
    /** Run instead of everything else under reduced motion. Defaults to onEnter. */
    onReduced?: () => void;
    /** rootMargin for the firing observer. */
    margin?: string;
}

/** Arms well before the element arrives, so the pre-state is never seen. */
const ARM_MARGIN = '0px 0px 45% 0px';
const FIRE_MARGIN = '0px 0px -12% 0px';

const isOnScreen = (element: Element) => {
    const rect = element.getBoundingClientRect();

    return rect.top < window.innerHeight && rect.bottom > 0;
};

export const observeInView = (element: HTMLElement, options: InViewOptions) => {
    const noop = () => undefined;

    if (typeof window === 'undefined') {
        return noop;
    }

    let fired = false;
    let armed = false;

    const fire = () => {
        if (fired) {
            return;
        }

        fired = true;
        options.onEnter?.();
    };

    if (prefersReducedMotion()) {
        if (options.onReduced) {
            options.onReduced();
        }
        else {
            fire();
        }

        return noop;
    }

    // Already on screen at setup: this element belongs to the intro, not to a
    // scroll reveal. Never arm it.
    if (isOnScreen(element)) {
        const { onIntro } = options;

        // No intro path given. Arming below would be pointless — the arm
        // observer fires at once, sees the element on screen and disconnects
        // without ever reaching `onEnter` — so run the entrance directly.
        if (!onIntro) {
            fire();

            return noop;
        }

        if (isIntroDone()) {
            onIntro();

            return noop;
        }

        return onStage('intro', () => {
            onIntro();
        });
    }

    const fireObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                fireObserver.disconnect();
                fire();
            }
        }
    }, { rootMargin: options.margin ?? FIRE_MARGIN, threshold: 0 });

    const armObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting || armed) {
                continue;
            }

            // It scrolled into view faster than the arm margin could react.
            // Leave it alone rather than hiding visible content.
            if (isOnScreen(element)) {
                armObserver.disconnect();
                options.onSkip?.();

                return;
            }

            armed = true;
            armObserver.disconnect();
            options.onArm?.();
            fireObserver.observe(element);
        }
    }, { rootMargin: ARM_MARGIN });

    armObserver.observe(element);

    return () => {
        armObserver.disconnect();
        fireObserver.disconnect();
    };
};
