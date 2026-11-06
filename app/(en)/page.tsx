import { FC } from 'react';
import type { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage';
import { homeMetadata } from '@/components/home/homeMetadata';

export const metadata: Metadata = homeMetadata('en');

const Home: FC = () => <HomePage locale="en" />;

export default Home;
