import { type ReactNode, cloneElement, isValidElement } from 'react';

/**
 * A dictionary sentence with `{name}` slots, filled with the page's nodes:
 * a link, a host name, a date. The words around a slot stay in the
 * dictionary, so each language can put the link where its grammar wants it.
 *
 * A space next to a slot becomes a node of its own, which is what JSX's
 * `text{' '}<a>` writes, so the rendered markup matches the hand-written one.
 * Only the keys the slotted elements need in a list differ.
 * A slot the template names but `slots` lacks is left as written.
 */
export const fillSlots = (template: string, slots: Partial<Record<string, ReactNode>>): ReactNode => {
    if (!template.includes('{')) {
        return template;
    }

    const nodes: ReactNode[] = [];

    template.split(/\{(\w+)\}/).forEach((part, index) => {
        if (index % 2 === 1) {
            nodes.push(part in slots ? slots[part] : `{${part}}`);

            return;
        }

        nodes.push(...splitEdgeSpaces(part));
    });

    // Only elements need a key in a list; text stays bare, as JSX writes it.
    return nodes.map((node, index) => (isValidElement(node) ? cloneElement(node, { key: index }) : node));
};

/** `' a b '` as `[' ', 'a b', ' ']`; empty parts dropped. */
function splitEdgeSpaces(text: string) {
    const match = /^( ?)(.*?)( ?)$/s.exec(text);
    const parts = match ? [match[1], match[2], match[3]] : [text];

    return parts.filter(part => part !== undefined && part !== '');
}
