'use client';

import { type FC, type ReactNode, useRef } from 'react';
import { useMaskReveal, useReveal } from '@/lib/motion';

/** The sub-line follows the headline on the same beat in every section. */
const LEDE_DELAY_S = 0.15;

interface Props {
    /** The heading's id, which the section's `aria-labelledby` points at. */
    id: string;
    title: string;
    lede: ReactNode;
}

/**
 * A home section's heading and sub-line, with their entrance.
 *
 * The client island of an otherwise server-rendered section: the heading
 * rises line by line out of its mask and the sub-line follows. Both are real
 * text in the markup, so they read unchanged with JS off and under reduced
 * motion.
 */
export const SectionHead: FC<Props> = ({ id, title, lede }) => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const ledeRef = useRef<HTMLParagraphElement>(null);

    useMaskReveal(titleRef);
    useReveal(ledeRef, { delay: LEDE_DELAY_S });

    return (
        <header className="sec-head">
            <h2 id={id} ref={titleRef}>{title}</h2>
            <p ref={ledeRef}>{lede}</p>
        </header>
    );
};
