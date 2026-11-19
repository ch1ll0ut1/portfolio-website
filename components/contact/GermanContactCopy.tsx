'use client';

import { type FC, type ReactNode } from 'react';
import { contactDe } from '@/config/contact/de';
import { type ClientCopy, CopyProvider } from '@/lib/i18n/CopyContext';

const COPY: Partial<ClientCopy> = { contact: contactDe };

/** The German contact form's words, and no English ones; see `useCopy`. */
export const GermanContactCopy: FC<{ children: ReactNode }> = ({ children }) => (
    <CopyProvider copy={COPY}>{children}</CopyProvider>
);
