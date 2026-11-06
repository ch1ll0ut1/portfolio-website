import { caseStudyCard, caseStudyCardAlt, caseStudyCardParams } from '@/lib/og/caseStudyCard';
import { ogContentType, ogImageSize } from '@/lib/og/createOgImage';

export const alt = caseStudyCardAlt('de');
export const size = ogImageSize;
export const contentType = ogContentType;

/** Only the cases generated at build time have a card; anything else is a 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
    return caseStudyCardParams();
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return caseStudyCard(slug, 'de');
}
