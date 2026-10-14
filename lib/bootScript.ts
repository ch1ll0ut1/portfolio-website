/**
 * The pre-paint boot script the root layout inlines into `<head>`.
 *
 * It runs before first paint so the stored theme is applied without a flash,
 * and so the `.motion` switch gating every animated rule is set before anything
 * renders. With motion allowed and no deep link to jump to, it also arms the
 * page entrance (`is-pre`, released by `lib/motion/stage.ts`). It reads the same `sk-theme` key `components/chrome/themeStore.ts`
 * writes.
 *
 * Kept in its own module, as the exact string the layout renders, so the CSP
 * module can hash these very bytes: any edit here changes the hash with it.
 */
export const BOOT_SCRIPT = '(function(){try{var d=document.documentElement;var t=localStorage.getItem("sk-theme");if(t==="light"||t==="dark"){d.dataset.theme=t;}d.classList.add("js");if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion");if(!location.hash){d.classList.add("is-pre");}}}catch(e){}})();';
