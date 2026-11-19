import { FC } from 'react';
import type { Metadata } from 'next';
import { EnglishHomeCopy } from '@/components/home/EnglishHomeCopy';
import { HomePage } from '@/components/home/HomePage';
import { homeMetadata } from '@/components/home/homeMetadata';

export const metadata: Metadata = homeMetadata('en');

const Home: FC = () => (
    <EnglishHomeCopy>
        <HomePage locale="en" />
    </EnglishHomeCopy>
);

export default Home;
