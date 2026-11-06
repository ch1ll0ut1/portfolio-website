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
 * Before all of that it settles the page's language (the first block). A
 * language stored under `sk-lang` always wins: on the other language's page it
 * forwards to the twin. With nothing stored, it forwards only an English page,
 * only for a visitor arriving from outside the site, and only when the first
 * `en` or `de` entry in the browser's languages is `de` — so a German page is
 * never left without a stored `en`, and a crawler (en-US, nothing stored) is
 * never moved. It cannot loop: the twin sees either the stored language it is
 * already in, or a same-site referrer. The twin is worked out as
 * `twinPath` in `lib/i18n/paths.ts` works it out, from the same `DE_SEGMENTS`
 * embedded here, and the page is hidden only once it is being replaced.
 *
 * Kept in its own module, as the exact string the layout renders, so the CSP
 * module can hash these very bytes: any edit here changes the hash with it.
 */

import { CONSENT_KEY, CONSENT_VERSION } from './consentStorage';
import { LANGUAGE_STORAGE_KEY } from './i18n/locale';
import { DE_SEGMENTS } from './i18n/paths';

const TO_ENGLISH = Object.fromEntries(Object.entries(DE_SEGMENTS).map(([en, de]) => [de, en]));

/*
 * S/E map a first segment to German/English; f maps a path's first segment.
 * The detection loop takes the first `en` or `de` entry, in any region.
 */
const LANGUAGE_BLOCK = [
    `try{var S=${JSON.stringify(DE_SEGMENTS)},E=${JSON.stringify(TO_ENGLISH)},p=location.pathname,cur=/^\\/de(\\/|$)/.test(p)?"de":"en",want=null,s=null;`,
    `try{s=localStorage.getItem(${JSON.stringify(LANGUAGE_STORAGE_KEY)});}catch(e){}`,
    'if(s==="en"||s==="de"){want=s;}',
    'else if(cur==="en"){var r=document.referrer;if(!r||(r+"/").indexOf(location.origin+"/")!==0){var n=navigator,l=n.languages&&n.languages.length?n.languages:[n.language];for(var i=0;i<l.length;i++){var m=/^(en|de)(-|$)/i.exec(l[i]||"");if(m){if(m[1].toLowerCase()==="de"){want="de";}break;}}}}',
    'if(want&&want!==cur){var h=Object.prototype.hasOwnProperty,f=function(x,M){return x.replace(/^\\/([^/]+)/,function(a,g){return "/"+(h.call(M,g)?M[g]:g);});},t;',
    'if(want==="de"){t=f(p,S);t="/de"+(t==="/"?"":t);}else{t=p.slice(3);t=t===""?"/":f(t,E);}',
    'd.style.visibility="hidden";location.replace(t+location.search+location.hash);}}catch(e){}',
].join('');

export const BOOT_SCRIPT = [
    '(function(){var d=document.documentElement;',
    LANGUAGE_BLOCK,
    'try{var t=localStorage.getItem("sk-theme");if(t==="light"||t==="dark"){d.dataset.theme=t;}d.classList.add("js");if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion");if(!location.hash){d.classList.add("is-pre");}}}catch(e){}',
    `try{var c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}));if(c&&c.version===${JSON.stringify(CONSENT_VERSION)}&&c.consent&&typeof c.consent.analytics==="boolean"){d.classList.add("has-consent");}}catch(e){}`,
    '})();',
].join('');
