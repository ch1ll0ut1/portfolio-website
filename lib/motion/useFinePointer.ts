'use client';

import { useEffect, useState } from 'react';
import { FINE_POINTER_QUERY, hasFinePointer, watchMedia } from './env';

/**
 * Tracks whether the primary pointer can hover precisely.
 *
 * Starts `false` so cursor-only effects never render on the server or flash on
 * touch devices.
 */
export const useFinePointer = () => {
    const [fine, setFine] = useState(false);

    useEffect(() => {
        setFine(hasFinePointer());

        return watchMedia(FINE_POINTER_QUERY, setFine);
    }, []);

    return fine;
};
