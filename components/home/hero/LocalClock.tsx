'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import { heroLocation } from '@/config/hero';

/** The headline is not a dashboard — minute resolution is enough. */
const TICK_MS = 20000;

export interface Props {
    className?: string;
}

const readTime = () => {
    try {
        return new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: heroLocation.timeZone,
        }).format(new Date());
    }
    catch {
        // A runtime without the IANA database: better a placeholder than a lie.
        return heroLocation.placeholder;
    }
};

/**
 * Stefan's local time.
 *
 * Renders a placeholder on the server and starts ticking after mount, so the
 * server's clock and the visitor's can never disagree during hydration. The
 * interval only runs while the chip is on screen and the tab is active.
 */
export const LocalClock: FC<Props> = ({ className }) => {
    const ref = useRef<HTMLTimeElement>(null);
    const [time, setTime] = useState(heroLocation.placeholder);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        let timer = 0;
        let onScreen = false;

        const update = () => {
            setTime(readTime());
        };

        const sync = () => {
            window.clearInterval(timer);
            timer = 0;

            if (onScreen && !document.hidden) {
                update();
                timer = window.setInterval(update, TICK_MS);
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
            window.clearInterval(timer);
            observer.disconnect();
            document.removeEventListener('visibilitychange', sync);
        };
    }, []);

    return (
        <time ref={ref} className={className} dateTime={time === heroLocation.placeholder ? undefined : time}>
            {time}
        </time>
    );
};
