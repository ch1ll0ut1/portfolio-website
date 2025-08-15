import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BlogPostPage from './BlogPostPage';
import RootLayout from '../../app/layout';
import { blogPosts, type BlogPost } from '@/config/blog';

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
 * Loads markdown content for Storybook stories via fetch.
 * This works in the browser environment by accessing static files.
 */
async function loadMarkdownContent(slug: string): Promise<string> {
    const response = await fetch(`/content/blog/${slug}.md`);
    if (!response.ok) {
        throw new Error(`Failed to load markdown file: ${slug} = ${response.status}`);
    }

    const content = await response.text();
    return content.trim();
}

/**
 * Creates a story for a blog post by slug.
 */
function createBlogStory(slug: string, additionalParams?: Record<string, unknown>): Story {
    const postMetadata = blogPosts.find(p => p.slug === slug);
    if (!postMetadata) throw new Error(`Blog post with slug "${slug}" not found`);

    return {
        args: {
            post: {
                ...postMetadata,
                content: '', // Will be loaded by loader
            } as BlogPost & { content: string },
        },
        loaders: [
            async () => {
                const content = await loadMarkdownContent(slug);
                return {
                    post: {
                        ...postMetadata,
                        content,
                    },
                };
            },
        ],
        render: (_args, { loaded: { post } }) => {
            return <BlogPostPage post={post as BlogPost & { content: string }} />;
        },
        ...additionalParams,
    };
}

export const NodeJSvsPythonFrameworkMagic = createBlogStory('nodejs-vs-python-framework-magic');

export const HowToUseAITOBuildAppsAt10xSpeed = createBlogStory('how-to-use-ai-to-build-apps-10x-speed');
