/**
 * Motion kit.
 *
 * Three module-level singletons back everything here: one animation clock
 * (`ticker`), one scroll listener (`scrollStore`), and one lifecycle bus
 * (`stage`). Sections use the hooks; imperative engines can use the plain
 * functions directly.
 */

export { EASE, tween } from './tween';
export { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY, hasFinePointer, prefersReducedMotion, watchMedia } from './env';
export { clamp, lerp, mapRange, smoothstep } from './math';
export { copyText, showToast } from './toast';
export { indexWords, splitWords, trackWordIndices } from './splitWords';
export { observeInView, type InViewOptions } from './inView';
export { emitStage, isIntroDone, onStage, startStage, type StageEvent } from './stage';
export {
    registerScrub,
    runScrubs,
    scrollState,
    subscribeScroll,
    subscribeScrollWhileNear,
    type ScrollState,
    type ScrubOptions,
} from './scrollStore';
export { subscribeTick, tickerCount, type TickFn } from './ticker';

export { useFinePointer } from './useFinePointer';
export { useInView } from './useInView';
export { useIntro } from './useIntro';
export { useMagnetic } from './useMagnetic';
export { useMediaQuery } from './useMediaQuery';
export { useMaskReveal, type MaskRevealOptions } from './useMaskReveal';
export { useRaf, useVisibleRaf } from './useRaf';
export { useReducedMotion } from './useReducedMotion';
export { useReveal, type RevealOptions } from './useReveal';
export { useScrollState } from './useScrollState';
export { useScrub } from './useScrub';
export { useSpringMagnet, type SpringMagnetOptions } from './useSpringMagnet';
export { useStageEvent } from './useStageEvent';
