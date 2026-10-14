'use client';

import { FC, ReactNode, useRef } from 'react';
import { useIntro, useMaskReveal } from '@/lib/motion';

interface Props {
    className?: string;
    children: ReactNode;
}

/**
 * The page's `h1`, rising line by line out of a mask.
 *
 * The text is real markup, so it reads unchanged with JS off and under reduced
 * motion, where `useMaskReveal` does nothing at all.
 */
export const MaskHeading: FC<Props> = ({ className, children }) => {
    const ref = useRef<HTMLHeadingElement>(null);

    useIntro();
    useMaskReveal(ref);

    return (
        <h1 ref={ref} className={className}>
            {children}
        </h1>
    );
};
