'use client';

import { type FC, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { hasFinePointer } from '@/lib/motion';
import { type Retype, createRetype } from './retypeMark';
import styles from './BrandMark.module.css';

/**
 * The `sk` badge with its blinking caret: back to the top on the homepage, and
 * the way home from every other route (client-side, so the nav stays mounted).
 *
 * On hover (fine pointers) or keyboard focus the mark retypes itself: the two
 * letters are backspaced, then typed again, with the caret held solid. The
 * scheduler refuses to restart mid-run, so a jittery pointer cannot stack
 * sequences on top of each other.
 *
 * `data-nav-item` opts this element into `SiteNav`'s entrance stagger.
 */
export const BrandMark: FC = () => {
    const isHome = usePathname() === '/';
    const markRef = useRef<HTMLSpanElement>(null);
    const retypeRef = useRef<Retype | null>(null);

    // Rebuilt when the link switches between `<a>` and `<Link>`, since that
    // remounts the mark it animates.
    useEffect(() => {
        const mark = markRef.current;

        if (!mark) {
            return;
        }

        const letters: HTMLElement[] = [];

        for (const letter of mark.querySelectorAll('[data-brand-letter]')) {
            if (letter instanceof HTMLElement) {
                letters.push(letter);
            }
        }

        const retype = createRetype({
            mark,
            letters,
            typingClass: styles.isTyping,
            goneClass: styles.isGone,
        });

        retypeRef.current = retype;

        return () => {
            retypeRef.current = null;
            retype.cancel();
        };
    }, [isHome]);

    const handlePointerEnter = () => {
        if (hasFinePointer()) {
            retypeRef.current?.run();
        }
    };

    const handleFocus = (event: React.FocusEvent<HTMLAnchorElement>) => {
        if (event.currentTarget.matches(':focus-visible')) {
            retypeRef.current?.run();
        }
    };

    const shared = {
        className: styles.brand,
        onPointerEnter: handlePointerEnter,
        onFocus: handleFocus,
        children: (
            <>
                <span className={styles.mark} ref={markRef} aria-hidden="true">
                    <span className={styles.letter} data-brand-letter>s</span>
                    <span className={styles.letter} data-brand-letter>k</span>
                    <span className={styles.caret} />
                </span>
                <span className={styles.name}>Stefan Knoch</span>
            </>
        ),
    };

    // On the homepage a plain fragment link, so the browser scrolls to the
    // hero as before; elsewhere a client-side route change home.
    return isHome
        ? <a href="#top" aria-label="Stefan Knoch, back to top" data-nav-item {...shared} />
        : <Link href="/" aria-label="Stefan Knoch, home" data-nav-item {...shared} />;
};
