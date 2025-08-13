import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BlogPostPage from './BlogPostPage';
import RootLayout from '../layout';
import { blogPosts } from '@/config/blog';
import { readMarkdownFile } from '@/lib/markdownProcessor';

/**
 * Storybook configuration for the BlogPostPage component.
 * Showcases individual blog post pages with content and navigation.
 */
const meta = {
    title: 'Pages/BlogPostPage',
    component: BlogPostPage,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Individual blog post page component featuring post header, content, and navigation breadcrumbs.',
            },
        },
    },
    tags: [''],
    decorators: [
        (Story) => {
            return (
                <RootLayout>
                    <Story />
                </RootLayout>
            );
        },
    ],
} satisfies Meta<typeof BlogPostPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Helper function to get blog post data with content.
 */
function getBlogPostData(slug: string) {
    const postMetadata = blogPosts.find(p => p.slug === slug);
    if (!postMetadata) return null;

    const markdownContent = readMarkdownFile(slug);
    if (!markdownContent) return null;

    return {
        ...postMetadata,
        content: markdownContent,
    };
}

/**
 * Default blog post story showing a complete blog post.
 */
export const Default: Story = {
    args: {
        post: getBlogPostData('scalable-react-applications') ?? {
            id: '1',
            title: 'Building Scalable React Applications: Lessons from 15 Years of Development',
            excerpt: 'After leading dozens of React projects, I\'ve learned what separates maintainable applications from technical debt nightmares.',
            date: '2024-01-15',
            readTime: '8 min read',
            tags: ['React', 'Architecture', 'Best Practices'],
            slug: 'scalable-react-applications',
            content: '# Building Scalable React Applications\n\nThis is a sample blog post content for Storybook.',
        },
    },
};

/**
 * Blog post with mobile viewport for responsive testing.
 */
export const Mobile: Story = {
    args: {
        post: getBlogPostData('scalable-react-applications') ?? {
            id: '1',
            title: 'Building Scalable React Applications: Lessons from 15 Years of Development',
            excerpt: 'After leading dozens of React projects, I\'ve learned what separates maintainable applications from technical debt nightmares.',
            date: '2024-01-15',
            readTime: '8 min read',
            tags: ['React', 'Architecture', 'Best Practices'],
            slug: 'scalable-react-applications',
            content: '# Building Scalable React Applications\n\nThis is a sample blog post content for Storybook.',
        },
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};

/**
 * Blog post with tablet viewport for responsive testing.
 */
export const Tablet: Story = {
    args: {
        post: getBlogPostData('scalable-react-applications') ?? {
            id: '1',
            title: 'Building Scalable React Applications: Lessons from 15 Years of Development',
            excerpt: 'After leading dozens of React projects, I\'ve learned what separates maintainable applications from technical debt nightmares.',
            date: '2024-01-15',
            readTime: '8 min read',
            tags: ['React', 'Architecture', 'Best Practices'],
            slug: 'scalable-react-applications',
            content: '# Building Scalable React Applications\n\nThis is a sample blog post content for Storybook.',
        },
    },
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
};

/**
 * Blog post with desktop viewport for responsive testing.
 */
export const Desktop: Story = {
    args: {
        post: getBlogPostData('scalable-react-applications') ?? {
            id: '1',
            title: 'Building Scalable React Applications: Lessons from 15 Years of Development',
            excerpt: 'After leading dozens of React projects, I\'ve learned what separates maintainable applications from technical debt nightmares.',
            date: '2024-01-15',
            readTime: '8 min read',
            tags: ['React', 'Architecture', 'Best Practices'],
            slug: 'scalable-react-applications',
            content: '# Building Scalable React Applications\n\nThis is a sample blog post content for Storybook.',
        },
    },
    parameters: {
        viewport: {
            defaultViewport: 'desktop',
        },
    },
};

/**
 * Blog post with different content (AI implementation guide).
 */
export const AIImplementationGuide: Story = {
    args: {
        post: getBlogPostData('cto-guide-ai-implementation') ?? {
            id: '2',
            title: 'The CTO\'s Guide to AI Implementation: Beyond the Hype',
            excerpt: 'Most AI initiatives fail not because of technology limitations, but due to poor strategic planning.',
            date: '2024-01-08',
            readTime: '12 min read',
            tags: ['AI', 'Strategy', 'Leadership'],
            slug: 'cto-guide-ai-implementation',
            content: '# The CTO\'s Guide to AI Implementation\n\nThis is a sample blog post content for Storybook.',
        },
    },
};

/**
 * Blog post with leadership content (developer to tech lead).
 */
export const DeveloperToTechLead: Story = {
    args: {
        post: getBlogPostData('developer-to-tech-lead') ?? {
            id: '3',
            title: 'From Developer to Tech Lead: The Skills They Don\'t Teach You',
            excerpt: 'Technical expertise got you promoted, but leadership requires a completely different skill set.',
            date: '2024-01-01',
            readTime: '6 min read',
            tags: ['Leadership', 'Career', 'Management'],
            slug: 'developer-to-tech-lead',
            content: '# From Developer to Tech Lead\n\nThis is a sample blog post content for Storybook.',
        },
    },
};
