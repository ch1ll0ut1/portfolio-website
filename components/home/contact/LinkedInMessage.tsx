import { type FC } from 'react';
import { links } from '@/config/links';
import { externalLinkHandlers } from './outboundTracking';
import styles from './LinkedInMessage.module.css';

const LABEL = 'Message me on LinkedIn';
const TRACKING_LABEL = 'linkedin message';

/**
 * The secondary way to get in touch: a written message on LinkedIn.
 *
 * It sits next to the booking call to action as the quieter outline pill, and
 * borrows that button's arrow swap on hover and focus so the pair reads as one
 * set. It is a plain link, so the browser handles the new tab.
 */
export const LinkedInMessage: FC = () => {
    const tracking = externalLinkHandlers(links.social.linkedin, TRACKING_LABEL);

    return (
        <a
            className={`btn ${styles.link}`}
            href={links.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={tracking.onClick}
            onAuxClick={tracking.onAuxClick}
        >
            {LABEL}
            {/* Two identical glyphs: the first leaves up and right as the
                second arrives from down and left. */}
            <span className={styles.arrow} aria-hidden="true">
                {[0, 1].map(copy => (
                    <svg key={copy} viewBox="0 0 16 16" width="14" height="14">
                        <path
                            d="M4 12 12 4M5.5 4H12v6.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ))}
            </span>
        </a>
    );
};
