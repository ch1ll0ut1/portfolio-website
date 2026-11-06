'use client';

import { type FC, type ReactNode } from 'react';
import { heroEn } from '@/config/home/hero/en';
import { proofEn } from '@/config/home/proof/en';
import { engagementsEn } from '@/config/home/services/en';
import { workEn } from '@/config/home/work/en';
import { writingEn } from '@/config/home/writing/en';
import { type ClientCopy, CopyProvider } from '@/lib/i18n/CopyContext';

/** What the homepage's client components read on top of the chrome's. */
const COPY: Partial<ClientCopy> = {
    hero: heroEn,
    proof: proofEn,
    engagements: engagementsEn,
    work: workEn,
    writing: writingEn,
};

/** The English homepage's words for its client components, and no German ones; see `useCopy`. */
export const EnglishHomeCopy: FC<{ children: ReactNode }> = ({ children }) => (
    <CopyProvider copy={COPY}>{children}</CopyProvider>
);
