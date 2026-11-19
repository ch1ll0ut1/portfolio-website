import { useSyncExternalStore } from 'react';

/**
 * Whether a page is drawing its own reading progress at the top of the
 * viewport, in which case the document-wide hairline steps aside — two bars
 * measuring different things paint as one stepped line in the same strip.
 *
 * A module singleton rather than a prop: the hairline lives in the root
 * layout's chrome, which outlives the page that draws the narrower bar, so the
 * page cannot hand it a prop. Counted, so a claim released late by one page
 * cannot cancel one taken by the next.
 */

let claims = 0;
const listeners = new Set<() => void>();

const notify = () => {
    for (const listener of listeners) {
        listener();
    }
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

const isClaimed = () => claims > 0;
/** The server never knows about a claim, so it always renders the hairline. */
const isClaimedOnServer = () => false;

/** Takes the top strip for as long as the returned release is not called. */
export const claimReadingProgress = () => {
    let released = false;

    claims += 1;
    notify();

    return () => {
        if (released) {
            return;
        }

        released = true;
        claims -= 1;
        notify();
    };
};

/** True while any page holds a claim on the top strip. */
export const useReadingProgressClaimed = () => useSyncExternalStore(subscribe, isClaimed, isClaimedOnServer);
