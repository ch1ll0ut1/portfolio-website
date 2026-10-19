import { type FC } from 'react';
import styles from './Grain.module.css';

/**
 * The page's film grain.
 *
 * Pure CSS on purpose: an SVG noise filter tiled as a background costs one
 * paint and never touches the main thread again.
 */
export const Grain: FC = () => <div className={styles.grain} aria-hidden="true" />;
