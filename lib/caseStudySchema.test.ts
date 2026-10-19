/**
 * Tests for a case study's structured data.
 */

import { describe, expect, it } from 'vitest';
import { caseStudies } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import { siteConfig } from '@/config/site';
import { itemAt } from '@/test/itemAt';
import { caseStudyBreadcrumbs, caseStudySchema } from './caseStudySchema';
import { PERSON_ID, breadcrumbSchema } from './structuredData';

describe('caseStudySchema', () => {
    it('should describe the case as a CreativeWork by the site owner', () => {
        // Arrange
        const study = itemAt(caseStudies, 0);
        const detail = caseStudyDetails[study.id];

        // Act
        const schema = caseStudySchema(study, detail);

        // Assert
        expect(schema).toMatchObject({
            '@type': 'CreativeWork',
            'name': detail.heading,
            'description': detail.description,
            'url': `${siteConfig.url}/work/${study.slug}`,
            'image': `${siteConfig.url}/work/${study.slug}/opengraph-image`,
            'author': { '@id': PERSON_ID },
            'dateCreated': '2023',
            'sameAs': study.link?.href,
        });
        expect(schema.keywords).toContain('Slate.js');
        expect(schema.about).toEqual(detail.topics.map(name => ({ '@type': 'Thing', name })));
    });

    it('should leave out sameAs for a case without a public link', () => {
        // Arrange
        const study = itemAt(caseStudies, 3);

        // Act
        const schema = caseStudySchema(study, caseStudyDetails[study.id]);

        // Assert
        expect(schema).not.toHaveProperty('sameAs');
        expect(schema.dateCreated).toBe('2015');
    });
});

describe('caseStudyBreadcrumbs', () => {
    it('should trail Home, the work section and the case', () => {
        // Arrange
        const study = itemAt(caseStudies, 2);

        // Act
        const trail = breadcrumbSchema(caseStudyBreadcrumbs(study));

        // Assert
        expect(trail.itemListElement).toEqual([
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': siteConfig.url },
            { '@type': 'ListItem', 'position': 2, 'name': 'Work', 'item': `${siteConfig.url}/#work` },
            { '@type': 'ListItem', 'position': 3, 'name': study.title, 'item': `${siteConfig.url}/work/${study.slug}` },
        ]);
    });
});
