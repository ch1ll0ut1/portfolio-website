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
export { showToast } from './toast';
export { scrambleHash, scrambleInto } from './scramble';
export { observeInView } from './inView';
export { emitStage, isIntroDone, onStage, startStage } from './stage';
export { registerScrub, scrollState, subscribeScroll, subscribeScrollWhileNear } from './scrollStore';
export { subscribeTick, tickerCount } from './ticker';

export { useFinePointer } from './useFinePointer';
export { useInView } from './useInView';
export { useIntro } from './useIntro';
export { useMagnet } from './useMagnet';
export { useMediaQuery } from './useMediaQuery';
export { useMaskReveal } from './useMaskReveal';
export { useRaf } from './useRaf';
export { useReducedMotion } from './useReducedMotion';
export { useReveal } from './useReveal';
export { useScrollState } from './useScrollState';
export { useScrub } from './useScrub';
export { useStageEvent } from './useStageEvent';
