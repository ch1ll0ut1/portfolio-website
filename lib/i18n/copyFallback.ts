import type { ClientCopy } from './CopyContext';

/**
 * The words a client component gets outside any copy provider: none on the
 * site, where every page has its language's provider. Tests replace it with
 * English (test/setup.ts), so a component rendered on its own reads English,
 * as it would on an English page.
 */
export const copyFallback: Partial<ClientCopy> = {};
