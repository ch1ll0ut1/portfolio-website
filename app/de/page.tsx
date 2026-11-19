import { FC } from 'react';
import type { Metadata } from 'next';
import { GermanHomeCopy } from '@/components/home/GermanHomeCopy';
import { HomePage } from '@/components/home/HomePage';
import { homeMetadata } from '@/components/home/homeMetadata';

export const metadata: Metadata = homeMetadata('de');

/** The German homepage, the twin of `/`: the same sections, in German. */
const Startseite: FC = () => (
    <GermanHomeCopy>
        <HomePage locale="de" />
    </GermanHomeCopy>
);

export default Startseite;
