import type { FC } from 'react';
import { ogFonts } from './fonts';
import { ogPalette } from './palette';
import { headlineWords } from './text';

interface Props {
    text: string;
    /** Phrase drawn on the selection highlight, with the caret after it. */
    highlight?: string;
    fontSize: number;
}

/**
 * The card's headline, set like the hero's editor: one phrase selected in
 * editor blue and the molten caret parked after it.
 *
 * Satori lays every element out as a flex item, so the words are separate
 * items in a wrapping row rather than one run of inline text.
 */
export const OgHeadline: FC<Props> = ({ text, highlight, fontSize }) => {
    const gap = Math.round(fontSize * 0.2);

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: gap,
                rowGap: Math.round(fontSize * 0.06),
                fontFamily: ogFonts.display,
                fontWeight: 700,
                fontSize,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                color: ogPalette.fg,
            }}
        >
            {headlineWords(text, highlight).map((word, index) => (
                <div key={`${index}-${word.lead}${word.selected}`} style={{ display: 'flex', alignItems: 'center' }}>
                    {word.lead !== '' && <span>{word.lead}</span>}
                    {word.selected !== '' && (
                        <div data-selected style={{ display: 'flex', position: 'relative' }}>
                            {/* Like the hero's mark: a flat block from cap height to just under the baseline. */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: Math.round(fontSize * 0.2),
                                    bottom: Math.round(fontSize * 0.02),
                                    left: -Math.round(fontSize * 0.035),
                                    right: -Math.round(fontSize * 0.035),
                                    background: ogPalette.select,
                                    borderRadius: Math.round(fontSize * 0.035),
                                }}
                            />
                            <span>{word.selected}</span>
                        </div>
                    )}
                    {word.caret && (
                        <span
                            data-caret
                            style={{
                                width: Math.max(3, Math.round(fontSize * 0.07)),
                                height: Math.round(fontSize * 0.86),
                                marginLeft: Math.round(fontSize * 0.08),
                                background: ogPalette.caret,
                                borderRadius: 2,
                            }}
                        />
                    )}
                    {word.tail !== '' && <span>{word.tail}</span>}
                </div>
            ))}
        </div>
    );
};
