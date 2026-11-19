'use client';

import { Fragment, type FC, type RefObject, useEffect, useRef } from 'react';
import { type GraphGeometry, NODE_RADIUS } from './graphGeometry';
import styles from './CareerGraph.module.css';

/** Radius of the filled dot inside a commit node. */
const DOT_RADIUS = 2.2;
/** The write head: a caret-coloured point with a soft halo. */
const HEAD_DOT_RADIUS = 3.5;
const HEAD_HALO_RADIUS = 9;

export interface Props {
    /** Null until the rows have been measured. */
    geometry: GraphGeometry | null;
    /** Per commit, bumped to pulse its ring. */
    pulses: number[];
    /** False under reduced motion. */
    showHead: boolean;
    /** The layer whose `--ink` the scroll position drives. */
    inkRef: RefObject<SVGSVGElement | null>;
    /** The write head, moved along the lane by the scroll position. */
    headRef: RefObject<SVGGElement | null>;
}

/**
 * The `git log --graph` lanes beside the commit list.
 *
 * Two stacked SVGs share one viewBox. The track layer is hairline and always
 * fully visible, so the shape of the history reads even before any scrolling;
 * the ink layer is identical but coloured, and a clip-path reveals it top-down
 * as the reading line descends. Pulse rings and the write head live on the
 * track layer, which is never clipped.
 *
 * Decorative: the same history is in the list next to it, so the whole thing is
 * `aria-hidden`.
 */
export const CareerGraph: FC<Props> = ({ geometry, pulses, showHead, inkRef, headRef }) => {
    const ringsRef = useRef<(SVGCircleElement | null)[]>([]);
    const seen = useRef<number[]>([]);

    useEffect(() => {
        const previous = seen.current;

        seen.current = pulses;

        pulses.forEach((token, index) => {
            if (token === 0 || token === previous[index]) {
                return;
            }

            const ring = ringsRef.current[index];

            if (!ring) {
                return;
            }

            // Restarting a CSS animation needs the class off, a forced reflow,
            // then the class back on.
            ring.classList.remove(styles.isPulse);
            ring.getBoundingClientRect();
            ring.classList.add(styles.isPulse);
        });
    }, [pulses]);

    // Both layers render before the first measurement, empty, so the graph's
    // own width can be read off the DOM. Measuring a layer that does not exist
    // yet left the viewBox narrower than the gutter, and `xMidYMid meet`
    // centred that narrow box inside the wide element — every lane sat half the
    // difference too far right until the first `layout` event corrected it.
    const nodes = geometry?.nodes ?? [];
    const mainPath = geometry?.mainPath ?? '';
    const indiePath = geometry?.indiePath ?? '';
    const viewBox = geometry ? `0 0 ${geometry.width} ${geometry.height}` : undefined;
    const size = geometry ? { height: `${geometry.height}px` } : undefined;

    return (
        <>
            <svg className={`${styles.graph} ${styles.track}`} viewBox={viewBox} style={size} aria-hidden="true">
                {mainPath && <path d={mainPath} />}
                {indiePath && <path d={indiePath} />}

                {nodes.map((node, index) => (
                    <circle key={index} className={styles.node} cx={node.x} cy={node.y} r={NODE_RADIUS} />
                ))}

                {nodes.map((node, index) => (
                    <circle
                        key={index}
                        className={`${styles.ring} ${node.branch === 'indie' ? styles.ringIndie : styles.ringMain}`}
                        cx={node.x}
                        cy={node.y}
                        r={NODE_RADIUS}
                        ref={(element) => {
                            ringsRef.current[index] = element;
                        }}
                    />
                ))}

                {showHead && (
                    <g className={styles.head} ref={headRef}>
                        <circle className={styles.headHalo} cx={0} cy={0} r={HEAD_HALO_RADIUS} />
                        <circle className={styles.headDot} cx={0} cy={0} r={HEAD_DOT_RADIUS} />
                    </g>
                )}
            </svg>

            <svg
                className={`${styles.graph} ${styles.ink}`}
                viewBox={viewBox}
                style={size}
                aria-hidden="true"
                ref={inkRef}
            >
                {mainPath && <path className={styles.laneMain} d={mainPath} />}
                {indiePath && <path className={styles.laneIndie} d={indiePath} />}

                {nodes.map((node, index) => (
                    <Fragment key={index}>
                        <circle
                            className={`${styles.node} ${node.branch === 'indie' ? styles.nodeIndie : styles.nodeMain} ${index === 0 ? styles.nodeHead : ''}`}
                            cx={node.x}
                            cy={node.y}
                            r={NODE_RADIUS}
                        />
                        <circle
                            className={node.branch === 'indie' ? styles.dotIndie : styles.dotMain}
                            cx={node.x}
                            cy={node.y}
                            r={DOT_RADIUS}
                        />
                    </Fragment>
                ))}
            </svg>
        </>
    );
};
