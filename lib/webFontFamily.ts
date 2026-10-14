/**
 * The web font's own family from a `next/font` result, without the fallback
 * face `next/font` appends after it.
 *
 * That generated fallback is `local(Arial)` with no `unicode-range`, so every
 * glyph the Google subset lacks is drawn from it, notably "→", which then
 * renders as Arial's long thin arrow, stretched by the fallback's size-adjust
 * (157% for Martian Mono). The design's stacks fall through to the system
 * fonts instead (SF on macOS for the display arrow, Menlo for the mono one).
 * `adjustFontFallback: false` would drop the face, but Turbopack ignores it,
 * so the stacks are built from the web family alone.
 */
export const webFontFamily = (font: { style: { fontFamily: string } }) => font.style.fontFamily.split(',')[0]?.trim() ?? '';
