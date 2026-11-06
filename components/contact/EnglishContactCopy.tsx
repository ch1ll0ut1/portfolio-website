'use client';

import { type FC, type ReactNode } from 'react';
import { contactEn } from '@/config/contact/en';
import { type ClientCopy, CopyProvider } from '@/lib/i18n/CopyContext';

const COPY: Partial<ClientCopy> = { contact: contactEn };

/** The English contact form's words, and no German ones; see `useCopy`. */
export const EnglishContactCopy: FC<{ children: ReactNode }> = ({ children }) => (
    <CopyProvider copy={COPY}>{children}</CopyProvider>
);
