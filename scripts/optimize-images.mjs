/**
 * Converts raster images to web-sized WebP next to their source.
 *
 * Blog art arrives as multi-megabyte PNG exports. Next's image optimizer
 * resizes on request, but the source still has to be read, decoded and kept
 * in the repository — so sources are stored at the largest size a reader can
 * ever be served, in a format that is already small.
 *
 * The source is left in place: delete it once nothing references it.
 *
 * Usage:
 *   node scripts/optimize-images.mjs [dir-or-file ...]   (default: public/images/blog)
 *                                    [--max-width 1600] [--quality 82]
 */

import { readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const SOURCE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
const DEFAULT_TARGET = 'public/images/blog';

const argOf = (name, fallback) => {
    const index = process.argv.indexOf(`--${name}`);

    return index >= 0 ? Number(process.argv[index + 1]) : fallback;
};

/** Twice the widest the article column renders, so 2× screens stay sharp. */
const MAX_WIDTH = argOf('max-width', 1600);
const QUALITY = argOf('quality', 82);

/** Positional arguments, skipping each `--flag value` pair. */
const targets = () => {
    const args = process.argv.slice(2);
    const paths = args.filter((arg, index) => !arg.startsWith('--') && !args[index - 1]?.startsWith('--'));

    return paths.length > 0 ? paths : [DEFAULT_TARGET];
};

const collect = async (target) => {
    const info = await stat(target);

    if (info.isFile()) {
        return [target];
    }

    const entries = await readdir(target);

    return entries.map(entry => join(target, entry));
};

const kb = bytes => `${(bytes / 1024).toFixed(0)} KB`;

const main = async () => {
    const files = (await Promise.all(targets().map(collect)))
        .flat()
        .filter(file => SOURCE_EXTENSIONS.has(extname(file).toLowerCase()));

    let before = 0;
    let after = 0;

    for (const file of files) {
        const output = `${file.slice(0, -extname(file).length)}.webp`;
        const { size } = await stat(file);
        const result = await sharp(file)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: QUALITY, effort: 6 })
            .toFile(output);

        before += size;
        after += result.size;
        console.log(`${file} (${kb(size)}) -> ${output} (${kb(result.size)}, ${result.width}×${result.height})`);
    }

    console.log(`\n${files.length} image(s): ${kb(before)} -> ${kb(after)}`);
};

await main();
