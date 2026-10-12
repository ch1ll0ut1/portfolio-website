/**
 * One consent category row inside the preferences dialog.
 *
 * Locked categories print a badge instead of a switch; the switch is a native
 * checkbox so it keeps checkbox semantics, labelling and keyboard behaviour.
 */

'use client';

import { type FC } from 'react';
import type { ConsentState } from './ConsentContext';
import type { ConsentCategory } from './consentCategories';
import styles from './ConsentCategoryRow.module.css';

interface Props {
    category: ConsentCategory;
    checked: boolean;
    onToggle: (key: keyof ConsentState) => void;
}

export const ConsentCategoryRow: FC<Props> = ({ category, checked, onToggle }) => {
    const titleId = `consent-${category.key}-title`;
    const descriptionId = `consent-${category.key}-description`;

    return (
        <li className={styles.row}>
            <div className={styles.head}>
                <h3 className={styles.title} id={titleId}>{category.title}</h3>
                {category.locked
                    ? <span className={styles.badge}>always on</span>
                    : (
                        <input
                            className={styles.switch}
                            type="checkbox"
                            role="switch"
                            checked={checked}
                            aria-labelledby={titleId}
                            aria-describedby={descriptionId}
                            onChange={() => { onToggle(category.key); }}
                        />
                    )}
            </div>
            <p className={styles.text} id={descriptionId}>{category.description}</p>
        </li>
    );
};
