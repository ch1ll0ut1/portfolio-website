import React, { FC } from 'react';
import { siteConfig } from '@/config/site';
import { type InlineSegment } from './markdownProcessor';
import styles from './Markdown.module.css';

interface Props {
    segments: InlineSegment[];
}

export const InlineContent: FC<Props> = ({ segments }) => {
    const content = segments.map((segment: InlineSegment, segmentIndex: number) => {
        let segmentContent: React.ReactNode = segment.text;
        const hasFormatting = Boolean(segment.isBold)
          || Boolean(segment.isItalic)
          || Boolean(segment.isLink)
          || Boolean(segment.isCode);

        // Code is the innermost wrapper: its text is never re-formatted.
        if (segment.isCode) {
            segmentContent = (
                <code key={segmentIndex} className={styles.inlineCode}>
                    {segmentContent}
                </code>
            );
        }

        // Handle link first (innermost). Only links that leave the site open a
        // new tab, and they say so to assistive technology.
        if (segment.isLink && segment.href) {
            const offSite = isOffSite(segment.href);

            segmentContent = (
                <a
                    key={segmentIndex}
                    href={segment.href}
                    className={styles.link}
                    target={offSite ? '_blank' : undefined}
                    rel={offSite ? 'noopener noreferrer' : undefined}
                >
                    {segmentContent}
                    {offSite ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
                </a>
            );
        }

        // Wrap with bold if needed
        if (segment.isBold) {
            segmentContent = (
                <strong key={segmentIndex} className={styles.strong}>
                    {segmentContent}
                </strong>
            );
        }

        // Wrap with italic if needed (outermost)
        if (segment.isItalic) {
            segmentContent = (
                <i key={segmentIndex}>
                    {segmentContent}
                </i>
            );
        }

        // For plain text, we need a React key but no HTML wrapper
        if (!hasFormatting) {
            return <React.Fragment key={segmentIndex}>{segmentContent}</React.Fragment>;
        }

        return segmentContent;
    });

    return <>{content}</>;
};

const SITE_HOST = new URL(siteConfig.url).host.replace(/^www\./, '');

/** An absolute http(s) URL on another host. Relative paths, anchors and `mailto:` stay put. */
const isOffSite = (href: string) => {
    if (!/^https?:\/\//i.test(href)) {
        return false;
    }

    try {
        return new URL(href).host.replace(/^www\./, '') !== SITE_HOST;
    }
    catch {
        return true;
    }
};
