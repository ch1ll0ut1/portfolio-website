/**
 * The page language's words for client components, and only that language's.
 *
 * Every dictionary is a `Record<Locale, …>` (`config/<domain>/index.ts`), so a
 * missing German key is a type error. A client component that indexed one of
 * those at runtime would put both languages into the browser's bundle. So
 * client components read their words from here instead, and each language
 * hands them in through its own client module, which imports only its own
 * dictionaries: the site chrome from the root layout (`EnglishSiteCopy`,
 * `GermanSiteCopy`), the homepage's from its route (`EnglishHomeCopy`,
 * `GermanHomeCopy`), the contact form's from its (`EnglishContactCopy`,
 * `GermanContactCopy`). The words never cross the server/client boundary as
 * props, so dictionaries may hold functions.
 *
 * Data built from the words, such as the case studies or the palette's
 * commands, is built on the server and passed down as props.
 */

'use client';

import { type FC, type ReactNode, createContext, useContext } from 'react';
import type { ChromeCopy } from '@/config/chrome/types';
import type { ConsentCopy } from '@/config/consent/types';
import type { ContactCopy } from '@/config/contact/types';
import type { HomeContactCopy } from '@/config/home/contact/types';
import type { HeroCopy } from '@/config/home/hero/types';
import type { ProofCopy } from '@/config/home/proof/types';
import type { EngagementsCopy } from '@/config/home/services/types';
import type { WorkCopy } from '@/config/home/work/types';
import type { WritingCopy } from '@/config/home/writing/types';
import { copyFallback } from './copyFallback';

/** Every dictionary a client component reads, by name. */
export interface ClientCopy {
    chrome: ChromeCopy;
    consent: ConsentCopy;
    homeContact: HomeContactCopy;
    hero: HeroCopy;
    proof: ProofCopy;
    engagements: EngagementsCopy;
    work: WorkCopy;
    writing: WritingCopy;
    contact: ContactCopy;
}

const CopyContext = createContext<Partial<ClientCopy>>(copyFallback);

interface Props {
    copy: Partial<ClientCopy>;
    children: ReactNode;
}

/** Adds `copy` to the dictionaries of any provider above. Rendered only by the per-language modules. */
export const CopyProvider: FC<Props> = ({ copy, children }) => {
    const outer = useContext(CopyContext);

    return (
        <CopyContext value={{ ...outer, ...copy }}>
            {children}
        </CopyContext>
    );
};

/** The page language's `name` dictionary, from the nearest provider that has it. */
export const useCopy = <Name extends keyof ClientCopy>(name: Name): ClientCopy[Name] => {
    const copy = useContext(CopyContext)[name];

    if (copy === undefined) {
        throw new Error(`No "${name}" copy above this component: render it inside its language's copy module.`);
    }

    return copy;
};
