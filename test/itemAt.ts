/**
 * The element at `index`, failing the test with a readable message when the
 * list is shorter than expected.
 *
 * Under `noUncheckedIndexedAccess` every `list[0]` is `T | undefined`. A test
 * that indexes into a list is asserting the element exists, so this states the
 * assertion and narrows the type instead of silencing it with `!`.
 */
export const itemAt = <T>(list: ArrayLike<T>, index: number): T => {
    const item = list[index];

    if (item === undefined) {
        throw new Error(`expected an item at index ${index}, but the list has ${list.length}`);
    }

    return item;
};
