import { FC, ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { SiteDocument } from '@/components/document/SiteDocument';
import { layoutMetadata, layoutViewport } from '@/lib/i18n/layoutMetadata';

// The German site title and description as fallbacks; every German page
// sets its own title, description and share fields.
export const metadata: Metadata = layoutMetadata('de');

export const viewport: Viewport = layoutViewport;

/** The root layout of every German page: everything under `/de`. */
const GermanLayout: FC<{ children: ReactNode }> = ({ children }) => (
    <SiteDocument locale="de">
        {children}
    </SiteDocument>
);

export default GermanLayout;
