import { FC } from 'react';
import { type PolicyItem } from './policyLists';
import styles from './Privacy.module.css';

interface Props {
    items: PolicyItem[];
}

export const PolicyList: FC<Props> = ({ items }) => {
    return (
        <ul className={styles.list}>
            {items.map(item => (
                <li key={item.label ?? item.text} className={styles.item}>
                    {item.label && (
                        <>
                            <strong className={styles.label}>
                                {item.label}
                                :
                            </strong>
                            {' '}
                        </>
                    )}
                    {item.text}
                </li>
            ))}
        </ul>
    );
};
