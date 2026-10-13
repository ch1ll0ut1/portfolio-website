import { ogImageConfig, createOgImage, OgLayout, ogPalette } from '@/lib/opengraphUtils';
import { blogPosts } from '@/config/blog';

export const size = ogImageConfig.size;
export const contentType = ogImageConfig.contentType;

/** Matches the page: only the posts generated at build time exist. */
export const dynamicParams = false;

/**
 * Generates static params for all blog posts to enable static generation.
 */
export async function generateStaticParams() {
    return blogPosts.map(post => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return createOgImage({
            children: (
                <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: ogPalette.fg }}>Post Not Found</h1>
            ),
        });
    }

    return createOgImage({
        children: (
            <OgLayout brandSize="small">
                {/* Blog Post Title */}
                <h1
                    style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        margin: '0 0 20px 0',
                        lineHeight: '1.1',
                        maxWidth: '1000px',
                        color: ogPalette.fg,
                        textShadow: '0 2px 10px rgba(255, 139, 61, .28)',
                    }}
                >
                    {post.title}
                </h1>

                {/* Excerpt */}
                <p
                    style={{
                        fontSize: '20px',
                        textAlign: 'center',
                        margin: '0 0 30px 0',
                        color: ogPalette.fg2,
                        maxWidth: '900px',
                        lineHeight: '1.4',
                        fontWeight: '500',
                    }}
                >
                    {post.excerpt.length > 120 ? post.excerpt.substring(0, 120) + '...' : post.excerpt}
                </p>

                {/* Tags */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginBottom: '20px',
                    }}
                >
                    {post.tags.map((tag, index) => (
                        <span
                            key={index}
                            style={{
                                background: ogPalette.caret,
                                color: ogPalette.onAccent,
                                padding: '6px 14px',
                                borderRadius: '16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                boxShadow: '0 2px 10px rgba(255, 139, 61, .28)',
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Date */}
                <div
                    style={{
                        fontSize: '16px',
                        color: ogPalette.caret,
                        fontWeight: '600',
                    }}
                >
                    {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </div>
            </OgLayout>
        ),
    });
}
