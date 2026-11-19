import { FC, ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { EnglishSiteCopy } from '@/components/document/EnglishSiteCopy';
import { SiteDocument } from '@/components/document/SiteDocument';
import { layoutMetadata, layoutViewport } from '@/lib/i18n/layoutMetadata';

export const metadata: Metadata = layoutMetadata('en');

export const viewport: Viewport = layoutViewport;

/** The root layout of every English page: the whole site outside `/de`. */
const EnglishLayout: FC<{ children: ReactNode }> = ({ children }) => (
    <SiteDocument locale="en" SiteCopy={EnglishSiteCopy}>
        {children}
    </SiteDocument>
);

export default EnglishLayout;
