/**
 * The pre-paint boot script the root layout inlines into `<head>`.
 *
 * It runs before first paint so the stored theme is applied without a flash,
 * and so the `.motion` switch gating every animated rule is set before anything
 * renders. With motion allowed and no deep link to jump to, it also arms the
 * page entrance (`is-pre`, released by `lib/motion/stage.ts`). It reads the same `sk-theme` key `components/chrome/themeStore.ts`
 * writes.
 *
 * It also marks a stored consent choice (`has-consent`), so the cookie banner,
 * which the server renders for every visitor, is hidden before first paint for
 * one who has already chosen. The test is the one `readStoredConsent` applies
 * — same key, same version, a boolean analytics flag — in a try of its own, so
 * unusable storage cannot cost the page its theme or motion classes.
 *
 * Kept in its own module, as the exact string the layout renders, so the CSP
 * module can hash these very bytes: any edit here changes the hash with it.
 */

import { CONSENT_KEY, CONSENT_VERSION } from './consentStorage';

export const BOOT_SCRIPT = [
    '(function(){var d=document.documentElement;',
    'try{var t=localStorage.getItem("sk-theme");if(t==="light"||t==="dark"){d.dataset.theme=t;}d.classList.add("js");if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion");if(!location.hash){d.classList.add("is-pre");}}}catch(e){}',
    `try{var c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}));if(c&&c.version===${JSON.stringify(CONSENT_VERSION)}&&c.consent&&typeof c.consent.analytics==="boolean"){d.classList.add("has-consent");}}catch(e){}`,
    '})();',
].join('');
