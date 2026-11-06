'use client';

import { type FC, type ReactNode } from 'react';
import { heroDe } from '@/config/home/hero/de';
import { proofDe } from '@/config/home/proof/de';
import { engagementsDe } from '@/config/home/services/de';
import { workDe } from '@/config/home/work/de';
import { writingDe } from '@/config/home/writing/de';
import { type ClientCopy, CopyProvider } from '@/lib/i18n/CopyContext';

/** What the homepage's client components read on top of the chrome's. */
const COPY: Partial<ClientCopy> = {
    hero: heroDe,
    proof: proofDe,
    engagements: engagementsDe,
    work: workDe,
    writing: writingDe,
};

/** The German homepage's words for its client components, and no English ones; see `useCopy`. */
export const GermanHomeCopy: FC<{ children: ReactNode }> = ({ children }) => (
    <CopyProvider copy={COPY}>{children}</CopyProvider>
);
