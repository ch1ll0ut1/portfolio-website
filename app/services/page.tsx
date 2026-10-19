import { FC } from 'react';
import type { Metadata } from 'next';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { ServicesPage } from '@/components/services/ServicesPage';
import { servicesEn } from '@/config/services/en';
import { servicesJsonLd, servicesMetadata } from '@/lib/servicesPage';

export const metadata: Metadata = servicesMetadata(servicesEn);

const Services: FC = () => (
    <>
        <JsonLd data={servicesJsonLd(servicesEn)} />
        <ReadingShell>
            <ServicesPage copy={servicesEn} />
        </ReadingShell>
    </>
);

export default Services;
