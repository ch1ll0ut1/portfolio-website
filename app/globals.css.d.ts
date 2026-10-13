// The global stylesheet is imported only for its side effect. TypeScript 6
// checks that side-effect imports resolve (`noUncheckedSideEffectImports` is on
// by default), and Next.js 15 declares `*.module.css` but not plain `*.css`.
export {};
