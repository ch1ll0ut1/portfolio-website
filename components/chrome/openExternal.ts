/**
 * Opens a URL in a new tab through a real anchor click.
 *
 * `window.open` from a deferred callback trips popup blockers; a synthetic
 * anchor click inherits the user gesture and does not.
 */
export const openExternal = (url: string) => {
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
};
