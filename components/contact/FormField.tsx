import { type FC, type ReactNode } from 'react';
import styles from './ContactForm.module.css';

/** What a field's control needs to be tied to its label, hint and error. */
export interface FieldControlProps {
    'id': string;
    'aria-describedby'?: string;
    'aria-invalid'?: true;
}

interface Props {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    /** Marks the label "optional"; every other field is required. */
    optional?: boolean;
    children: (control: FieldControlProps) => ReactNode;
}

/**
 * A labelled form control with its hint and its error.
 *
 * The control comes in as a render prop so it can be an input, a select or a
 * textarea, and gets the ids that connect it: `aria-describedby` names the
 * hint and the error, and `aria-invalid` is set only while there is an error.
 */
export const FormField: FC<Props> = ({ id, label, hint, error, optional = false, children }) => {
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={id}>
                {label}
                {optional && (
                    <>
                        {' '}
                        <span className={styles.optional}>(optional)</span>
                    </>
                )}
            </label>
            {hint && <p id={hintId} className={styles.hint}>{hint}</p>}
            {children({
                'id': id,
                'aria-describedby': describedBy,
                'aria-invalid': error ? true : undefined,
            })}
            {error && <p id={errorId} className={styles.error}>{error}</p>}
        </div>
    );
};
