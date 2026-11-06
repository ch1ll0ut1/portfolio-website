import { FC } from 'react';
import type { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage';
import { homeMetadata } from '@/components/home/homeMetadata';

export const metadata: Metadata = homeMetadata('de');

/** The German homepage, the twin of `/`: the same sections, in German. */
const Startseite: FC = () => <HomePage locale="de" />;

export default Startseite;
