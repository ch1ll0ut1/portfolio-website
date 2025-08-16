import { ogImageConfig, createOgImage, OgLayout } from '@/lib/opengraphUtils';
import { blogPosts } from '@/config/blog';

export const size = ogImageConfig.size;
export const contentType = ogImageConfig.contentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return createOgImage({
            children: (
                <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#FFFFFF' }}>Post Not Found</h1>
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
                        color: '#FFFFFF',
                        textShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
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
                        color: '#E5E7EB',
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
                                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                color: '#1F2937',
                                padding: '6px 14px',
                                borderRadius: '16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
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
                        color: '#F59E0B',
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
