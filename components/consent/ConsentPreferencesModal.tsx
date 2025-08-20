/**
 * Cookie consent preferences modal component.
 * Allows users to customize their cookie preferences with detailed descriptions.
 */

'use client';

import React, { FC, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useConsent, type ConsentState } from './ConsentContext';

interface ConsentPreferencesModalProps {
    onClose: () => void;
    onSave: () => void;
}

export const ConsentPreferencesModal: FC<ConsentPreferencesModalProps> = ({ onClose, onSave }) => {
    const { consent, updateConsent } = useConsent();
    const [preferences, setPreferences] = useState<ConsentState>({
        analytics: consent?.analytics ?? false,
        marketing: consent?.marketing ?? false,
        preferences: consent?.preferences ?? false,
        essential: true,
    });

    const handleToggle = (type: keyof ConsentState) => {
        if (type === 'essential') return; // Can't toggle essential cookies

        setPreferences(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleSave = () => {
        updateConsent(preferences);
        onSave();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Cookie Preferences</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="p-1"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-600">
                            Manage your cookie preferences below. You can enable or disable different types
                            of cookies except essential cookies which are required for the website to function properly.
                        </p>

                        {/* Essential Cookies */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900">Essential Cookies</h3>
                                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    Always Active
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                These cookies are necessary for the website to function and cannot be switched off.
                                They include your consent preferences and basic website functionality.
                            </p>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900">Analytics Cookies</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={() => { handleToggle('analytics'); }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <p className="text-sm text-gray-600">
                                Help me understand how visitors interact with the website by collecting and
                                reporting information anonymously via Google Analytics.
                            </p>
                        </div>

                        {/* Marketing Cookies */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900">Marketing Cookies</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={() => { handleToggle('marketing'); }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <p className="text-sm text-gray-600">
                                These cookies may be set through the website by advertising partners to build
                                a profile of your interests and show relevant ads on other sites.
                            </p>
                        </div>

                        {/* Preference Cookies */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900">Preference Cookies</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.preferences}
                                        onChange={() => { handleToggle('preferences'); }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <p className="text-sm text-gray-600">
                                Enable the website to remember information that changes the way it behaves
                                or looks, such as your preferred language or region.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200 mt-6">
                        <Link
                            href="/privacy"
                            className="text-sm text-primary hover:text-primary/80 underline"
                        >
                            Read Privacy Policy
                        </Link>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleSave}
                                className="bg-action text-action-foreground hover:bg-action/90"
                            >
                                Save Preferences
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
