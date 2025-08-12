import React, { FC } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, User } from 'lucide-react';
import { BlogPost } from '@/config/blog';

interface Props {
    post: BlogPost;
    className?: string;
}

/**
 * Header component for individual blog post pages.
 * Displays post metadata, title, and tags.
 */
export const BlogPostHeader: FC<Props> = ({ post, className = '' }) => {
    return (
        <header className={`mb-12 ${className}`}>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
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

            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                        {tag}
                    </Badge>
                ))}
            </div>
        </header>
    );
};
