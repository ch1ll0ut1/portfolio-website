import { type FC } from 'react';
import { orderedChordSections } from './orderedChordSections';
import styles from './ChordHint.module.css';

const keys = orderedChordSections.map(section => section.chord).join(' ');

interface Props {
    /** True while a `g` chord is waiting for its second key. */
    armed: boolean;
}

/**
 * Shows which keys will finish a pending `g` chord.
 *
 * Decorative: the shortcuts overlay is the accessible version of this list, so
 * the hint itself stays out of the accessibility tree.
 */
export const ChordHint: FC<Props> = ({ armed }) => (
    <div className={armed ? `${styles.hint} ${styles.on}` : styles.hint} aria-hidden="true">
        <kbd>g</kbd>
        {/* One expression: as separate children the formatter splits them and JSX eats the space. */}
        <span>{`then ${keys}`}</span>
    </div>
);
