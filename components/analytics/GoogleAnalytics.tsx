/**
 * Loads gtag.js once, and only once, analytics consent is granted.
 *
 * Nothing is requested from Google before that: no script, no cookieless
 * pings (Basic Consent Mode). A returning visitor's stored consent is read
 * after hydration, so their script loads right after it. The `gtag` queue the
 * script reads is set up by `lib/analytics` when consent is applied.
 */

'use client';

import { type FC } from 'react';
import Script from 'next/script';
import { gaMeasurementId } from '@/lib/analytics';
import { useConsent } from '@/components/consent/ConsentContext';

export const GoogleAnalytics: FC = () => {
    const { consent } = useConsent();
    const id = gaMeasurementId();

    if (id === '' || consent?.analytics !== true) {
        return null;
    }

    return (
        <Script
            id="gtag-js"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
            strategy="afterInteractive"
        />
    );
};
