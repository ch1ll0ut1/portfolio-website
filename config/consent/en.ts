import type { ConsentCopy } from './types';

export const consentEn: ConsentCopy = {
    title: 'Cookie preferences',
    privacyLink: 'Privacy policy',
    banner: {
        body: 'I use cookies to understand how the site is used. Essential cookies are always on; analytics cookies are up to you, and you can change your mind any time under Cookie settings in the footer.',
        customize: 'Customize',
        rejectAll: 'Reject all',
        acceptAll: 'Accept all',
    },
    dialog: {
        close: 'Close cookie preferences',
        intro: 'Switch each kind of cookie on or off. Essential cookies stay on, because the site needs them to work.',
        cancel: 'Cancel',
        save: 'Save preferences',
    },
    alwaysOn: 'always on',
    categories: {
        essential: {
            title: 'Essential cookies',
            description: 'Needed for the site to work. They hold your consent choice, and cannot be switched off.',
        },
        analytics: {
            title: 'Analytics cookies',
            description: 'Report anonymously via Google Analytics how visitors move through the site, so I can see what is worth keeping. Google Analytics is not loaded at all unless this is on.',
        },
    },
};
