import { ogImageConfig, createOgImage, BrandComponent } from '@/lib/opengraphUtils';
import { blogPosts } from '@/config/blog';

export const size = ogImageConfig.size;
export const contentType = ogImageConfig.contentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return createOgImage({
            children: (
                <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>Post Not Found</h1>
            ),
        });
    }

    return createOgImage({
        children: (
            <>
                <BrandComponent size="small" />

                {/* Blog Post Title */}
                <h1
                    style={{
                        fontSize: '56px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        margin: '0 0 30px 0',
                        lineHeight: '1.2',
                        maxWidth: '1000px',
                        display: '-webkit-box',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {post.title}
                </h1>

                {/* Excerpt */}
                <p
                    style={{
                        fontSize: '24px',
                        textAlign: 'center',
                        margin: '0 0 40px 0',
                        color: '#D1D5DB',
                        maxWidth: '900px',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {post.excerpt}
                </p>

                {/* Tags */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginBottom: '30px',
                    }}
                >
                    {post.tags.slice(0, 4).map((tag, index) => (
                        <span
                            key={index}
                            style={{
                                background: '#2563EB',
                                color: '#ffffff',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '16px',
                                fontWeight: '600',
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Date */}
                <div
                    style={{
                        fontSize: '18px',
                        color: '#9CA3AF',
                        marginBottom: '20px',
                    }}
                >
                    {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </div>
            </>
        ),
    });
}
