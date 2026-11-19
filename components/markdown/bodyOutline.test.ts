import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { bodyOutline } from './bodyOutline';
import { parseMarkdown } from './parser/blockParser';

const ranksOf = (markdown: string) => bodyOutline(parseMarkdown(markdown))
    .flatMap(block => (block.type === 'heading' ? [`${block.rank}:${block.content}`] : []));

describe('bodyOutline', () => {
    it('drops a leading level-1 heading, since the page already renders the title', () => {
        const blocks = bodyOutline(parseMarkdown('# The Title\n\nIntro\n\n## First'));

        expect(blocks.map(block => block.type)).toEqual(['paragraph', 'heading']);
        expect(ranksOf('# The Title\n\nIntro\n\n## First')).toEqual(['2:First']);
    });

    it('keeps the body unchanged when it does not open with a title', () => {
        expect(bodyOutline(parseMarkdown('> A lead quote\n\n## First')).map(block => block.type))
            .toEqual(['quote', 'heading']);
    });

    it('ranks a level-1 heading inside the body as an h2', () => {
        expect(ranksOf('Intro\n\n# Part one\n\n### Detail')).toEqual(['2:Part one', '3:Detail']);
    });

    it('never skips a rank when the markdown skips a level', () => {
        expect(ranksOf('## A\n\n#### B\n\n###### C\n\n## D\n\n### E'))
            .toEqual(['2:A', '3:B', '4:C', '2:D', '3:E']);
    });

    it('starts the body at h2 even when its first heading is deeper', () => {
        expect(ranksOf('Intro\n\n### Deep')).toEqual(['2:Deep']);
    });

    it('gives every post a body outline that starts at h2 and never skips a rank', () => {
        const dir = path.join(process.cwd(), 'content', 'blog');
        const posts = fs.readdirSync(dir).filter(file => file.endsWith('.md'));
        expect(posts.length).toBeGreaterThan(0);

        for (const file of posts) {
            const blocks = bodyOutline(parseMarkdown(fs.readFileSync(path.join(dir, file), 'utf8').trim()));
            const ranks = blocks.flatMap(block => (block.type === 'heading' ? [block.rank] : []));

            let previous = 1;
            for (const rank of ranks) {
                expect(rank, file).toBeLessThanOrEqual(previous + 1);
                previous = rank;
            }
            expect(ranks[0], file).toBe(2);
        }
    });
});
