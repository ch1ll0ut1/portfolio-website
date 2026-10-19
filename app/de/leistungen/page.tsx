import { FC } from 'react';
import type { Metadata } from 'next';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { ServicesPage } from '@/components/services/ServicesPage';
import { servicesDe } from '@/config/services/de';
import { servicesJsonLd, servicesMetadata } from '@/lib/servicesPage';

export const metadata: Metadata = servicesMetadata(servicesDe);

/** The German services page. The layout's `<html lang="en">` stays; the page body says `lang="de"`. */
const Leistungen: FC = () => (
    <>
        <JsonLd data={servicesJsonLd(servicesDe)} />
        <ReadingShell>
            <ServicesPage copy={servicesDe} />
        </ReadingShell>
    </>
);

export default Leistungen;
