import type { FC, ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import { ogFonts } from './fonts';
import { OgMono } from './OgMono';
import { ogPalette } from './palette';
import { siteMetaLine } from './text';

interface Props {
    /** Mono label at the top right, naming the part of the site the card is for. */
    kicker?: string;
    children: ReactNode;
}

/**
 * The shared card: a left-aligned editorial column inside a hairline frame,
 * the name at the top and the site's mono metadata line at the bottom.
 * The page's own content (headline, lede, metadata) goes in between.
 */
export const OgLayout: FC<Props> = ({ kicker, children }) => (
    <div
        style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            padding: 32,
            background: ogPalette.bg,
            fontFamily: ogFonts.body,
            color: ogPalette.fg,
        }}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                padding: '44px 60px 40px',
                border: `1px solid ${ogPalette.line}`,
                borderRadius: 20,
                background: ogPalette.bg2,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <span
                    style={{
                        fontFamily: ogFonts.display,
                        fontWeight: 700,
                        fontSize: 30,
                        letterSpacing: '-0.01em',
                    }}
                >
                    {siteConfig.name}
                </span>
                {kicker !== undefined && <OgMono>{kicker}</OgMono>}
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flexGrow: 1,
                }}
            >
                {children}
            </div>

            <div
                style={{
                    display: 'flex',
                    paddingTop: 24,
                    borderTop: `1px solid ${ogPalette.line}`,
                }}
            >
                <OgMono>{siteMetaLine()}</OgMono>
            </div>
        </div>
    </div>
);
