/**
 * Cookie consent banner component.
 * Lightweight, GDPR-compliant consent management styled to match the site design.
 */

'use client';

import React, { FC, useState } from 'react';
import Link from 'next/link';
import { Settings, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useConsent } from './ConsentContext';
import { ConsentPreferencesModal } from './ConsentPreferencesModal';

export const CookieConsent: FC = () => {
    const { showBanner, acceptAll, rejectAll, hideBanner } = useConsent();
    const [showPreferences, setShowPreferences] = useState(false);

    if (!showBanner) return null;

    return (
        <>
            {/* Main consent banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Cookie Preferences
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    I use cookies to enhance your experience and analyze website usage.
                                    You can accept all cookies or customize your preferences. Essential cookies are always enabled.
                                    {' '}
                                    <Link
                                        href="/privacy"
                                        className="text-primary hover:text-primary/80 underline"
                                    >
                                        Learn more
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setShowPreferences(true); }}
                                className="whitespace-nowrap"
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Customize
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={rejectAll}
                                className="whitespace-nowrap"
                            >
                                Reject All
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={acceptAll}
                                className="whitespace-nowrap bg-action text-action-foreground hover:bg-action/90"
                            >
                                Accept All
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences modal */}
            {showPreferences && (
                <ConsentPreferencesModal
                    onClose={() => { setShowPreferences(false); }}
                    onSave={() => {
                        setShowPreferences(false);
                        hideBanner();
                    }}
                />
            )}
        </>
    );
};
