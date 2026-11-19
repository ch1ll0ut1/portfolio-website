/**
 * The site's dark palette as literals.
 *
 * The OG runtime renders outside the document, so it cannot read the custom
 * properties in `app/globals.css`. These are the same values as that file's
 * `:root` block and must be changed together with it.
 */
export const ogPalette = {
    /** basalt — page background */
    bg: '#0f171d',
    /** raised band */
    bg2: '#131e25',
    /** hairlines */
    line: '#243540',
    /** snow — primary text */
    fg: '#e4ecee',
    /** secondary text */
    fg2: '#a9b8bf',
    /** molten caret — the brand accent */
    caret: '#ff8b3d',
    /** editor selection blue */
    select: '#3d7bff',
};
