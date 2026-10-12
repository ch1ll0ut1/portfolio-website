'use client';

import { type FC, useEffect, useRef, useState } from 'react';

/** Rendered on the server and on the first client paint, so the two agree. */
const PLACEHOLDER = '--:--:--';
const TICK_MS = 1000;

const formatter = () => {
    try {
        return new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Bangkok',
        });
    }
    catch {
        // An environment without the time zone data: the label still reads.
        return null;
    }
};

/**
 * Live Bangkok time.
 *
 * The markup ships a static placeholder and the real time only arrives after
 * mount, because a server-rendered clock is a guaranteed hydration mismatch.
 * It ticks only while on screen and while the tab is in the foreground, so a
 * footer nobody is looking at costs nothing.
 */
export const FooterClock: FC = () => {
    const [time, setTime] = useState(PLACEHOLDER);
    const elementRef = useRef<HTMLTimeElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        const format = formatter();

        if (!element || !format) {
            return;
        }

        let interval = 0;
        let onScreen = false;

        const tick = () => {
            setTime(format.format(new Date()));
        };

        const sync = () => {
            const shouldRun = onScreen && !document.hidden;

            if (shouldRun && interval === 0) {
                tick();
                interval = window.setInterval(tick, TICK_MS);
            }
            else if (!shouldRun && interval !== 0) {
                window.clearInterval(interval);
                interval = 0;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                onScreen = entry.isIntersecting;
            }

            sync();
        });

        observer.observe(element);
        document.addEventListener('visibilitychange', sync);

        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', sync);
            window.clearInterval(interval);
        };
    }, []);

    return <time ref={elementRef}>{time}</time>;
};
