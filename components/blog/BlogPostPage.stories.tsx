import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BlogPostPage from './BlogPostPage';
import RootLayout from '../../app/layout';
import { blogPosts, type BlogPost } from '@/config/blog';
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
        chromatic: {
            modes: {
                desktop: {
                    viewport: 'desktop',
                },
                mobile: {
                    viewport: 'mobile',
                },
                tablet: {
                    viewport: 'tablet',
                },
            },
        },
    },
    tags: [''],
    decorators: [
        Story => (
            <RootLayout>
                <Story />
            </RootLayout>
        ),
    ],
} satisfies Meta<typeof BlogPostPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Helper function to get blog post data with content.
 */
async function getBlogPostData(slug: string) {
    const postMetadata = blogPosts.find(p => p.slug === slug);
    if (!postMetadata) return null;

    // Try to fetch from static files in Storybook
    try {
        const response = await fetch(`/content/blog/${slug}.md`);
        if (response.ok) {
            const content = await response.text();
            return {
                ...postMetadata,
                content: content.trim(),
            };
        }
    }
    catch {
        // Ignore error
    }

    // Fallback to Node.js file reading (for Next.js)
    try {
        const markdownContent = readMarkdownFile(slug);
        if (markdownContent) {
            return {
                ...postMetadata,
                content: markdownContent,
            };
        }
    }
    catch {
        // Ignore error
    }

    return null;
}

/**
 * Creates a story for a blog post by slug.
 */
function createBlogStory(slug: string, additionalParams?: Record<string, unknown>): Story {
    const postMetadata = blogPosts.find(p => p.slug === slug);
    if (!postMetadata) throw new Error(`Blog post with slug "${slug}" not found`);

    return {
        args: {
            post: { ...postMetadata, content: '' },
        },
        loaders: [
            async () => ({
                post: await getBlogPostData(slug),
            }),
        ],
        render: (_args, { loaded: { post } }) => {
            if (!post) {
                throw new Error(`Failed to load content for ${slug}`);
            }

            return <BlogPostPage post={post as BlogPost & { content: string }} />;
        },
        ...additionalParams,
    };
}

export const ScalableReactApplications = createBlogStory('scalable-react-applications');

export const AIImplementationGuide = createBlogStory('cto-guide-ai-implementation');

export const DeveloperToTechLead = createBlogStory('developer-to-tech-lead');
