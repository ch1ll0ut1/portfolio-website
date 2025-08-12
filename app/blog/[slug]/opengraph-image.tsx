import { ImageResponse } from 'next/og';
import { blogPosts } from '@/config/blog';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return new ImageResponse(
            (
                <div
                    style={{
                        background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px',
                        color: 'white',
                        fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                >
                    <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>Post Not Found</h1>
                </div>
            ),
            { ...size },
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px',
                    color: 'white',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                {/* Logo/Brand */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            width: '50px',
                            height: '50px',
                            background: '#2563EB',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '16px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                        }}
                    >
                        SK
                    </div>
                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#2563EB',
                        }}
                    >
                        Stefan Knoch
                    </div>
                </div>

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

                {/* Bottom accent */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '8px',
                        background: 'linear-gradient(90deg, #2563EB 0%, #1F2937 100%)',
                    }}
                />
            </div>
        ),
        {
            ...size,
        },
    );
}
