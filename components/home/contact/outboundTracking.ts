/**
 * Analytics handlers for the section's outbound links.
 *
 * The links stay real `<a href>` elements: these handlers report the click and
 * let the browser navigate. Nothing is intercepted, so middle-click, cmd-click
 * and "open in new tab" all still work — and all three are counted, which a
 * plain `onClick` would miss, since browsers fire `auxclick` rather than
 * `click` for the middle button.
 *
 * Event names and payloads match what the pre-redesign `TrackedConversionButton`
 * and `TrackedSocialLink` sent, so the GA4 series continues rather than
 * restarting.
 */

import { type MouseEvent } from 'react';
import { trackConversion, trackExternalLink } from '@/lib/analytics';

/** `MouseEvent.button` for the middle button. */
const MIDDLE_BUTTON = 1;

export interface OutboundHandlers {
    onClick: () => void;
    onAuxClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/** Reports a booking click. `conversionType` and `location` feed GA4 directly. */
export const conversionHandlers = (conversionType: string, location: string): OutboundHandlers => handlersFor(() => {
    trackConversion.ctaClick(conversionType, location);
});

/** Reports an outbound link click, including social profiles. */
export const externalLinkHandlers = (href: string, linkText: string): OutboundHandlers => handlersFor(() => {
    trackExternalLink(href, linkText);
});

const handlersFor = (send: () => void): OutboundHandlers => ({
    onClick: send,
    // Right-click fires `auxclick` too, and opening a context menu is not a
    // click, so only the middle button counts here.
    onAuxClick: (event) => {
        if (event.button === MIDDLE_BUTTON) {
            send();
        }
    },
});
