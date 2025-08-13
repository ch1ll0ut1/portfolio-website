import React, { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/zCard';
import { Badge } from '@/components/ui/zBadge';
import { Button } from '@/components/ui/zButton';
import { Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/config/blog';
import { formatDate } from '@/lib/date';

interface Props {
    post: BlogPost;
    className?: string;
}

/**
 * Card component for displaying a blog post preview in the blog index.
 * Shows post metadata, excerpt, tags, and read more button.
 */
export const BlogPostCard: FC<Props> = ({ post, className = '' }) => {
    return (
        <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
            <CardHeader>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.date)}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Stefan Knoch
                    </div>
                </div>
                <CardTitle className="text-2xl hover:text-action transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/blog/${post.slug}`}>Read Full Article</Link>
                </Button>
            </CardContent>
        </Card>
    );
};
