/**
 * Picks the posts an article suggests reading next.
 */

/** The fields the choice reads. */
interface Candidate {
    slug: string;
    date: string;
    tags: string[];
}

/**
 * The `count` posts sharing the most tags with `post`, ties going to the
 * newer post, so a post with no tag in common still gets the latest ones.
 * Never the post itself, nor any slug in `exclude` (the pager's neighbours,
 * which are linked already).
 */
export const relatedPosts = <T extends Candidate>(post: Candidate, posts: T[], count: number, exclude: string[] = []): T[] => {
    const tags = new Set(post.tags.map(normalizeTag));
    const skip = new Set([post.slug, ...exclude]);
    const shared = (candidate: Candidate) => candidate.tags.filter(tag => tags.has(normalizeTag(tag))).length;

    return posts
        .filter(candidate => !skip.has(candidate.slug))
        .map(candidate => ({ candidate, score: shared(candidate) }))
        .sort((a, b) => b.score - a.score || b.candidate.date.localeCompare(a.candidate.date))
        .slice(0, count)
        .map(({ candidate }) => candidate);
};

function normalizeTag(tag: string) {
    return tag.trim().toLowerCase();
}
