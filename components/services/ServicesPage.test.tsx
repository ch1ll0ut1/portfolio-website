/**
 * Tests for the services page body, rendered from both languages' copy.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { caseStudies, caseStudyPath } from '@/config/caseStudies';
import { links } from '@/config/links';
import { servicesDe } from '@/config/services/de';
import { servicesEn } from '@/config/services/en';
import { installMatchMedia } from '@/test/motionEnv';
import { ServicesPage } from './ServicesPage';

describe('ServicesPage', () => {
    // The masked heading's motion hooks read `matchMedia`, which jsdom lacks.
    let restoreMedia: () => void;

    beforeAll(() => {
        restoreMedia = installMatchMedia([]);
    });

    afterAll(() => {
        restoreMedia();
    });

    it('should have one h1, the page title', () => {
        render(<ServicesPage copy={servicesEn} />);

        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(servicesEn.hero.title);
    });

    // The German root layout's `<html lang="de">` says it for the whole page.
    it('should leave the page language to the document', () => {
        const { container } = render(<ServicesPage copy={servicesDe} />);

        expect(container.firstElementChild).not.toHaveAttribute('lang');
    });

    it('should link to the page in the other language, marked with its language', () => {
        render(<ServicesPage copy={servicesEn} />);

        const link = screen.getByRole('link', { name: 'Deutsch' });

        expect(link).toHaveAttribute('href', '/de/leistungen');
        expect(link).toHaveAttribute('hreflang', 'de');
        expect(link).toHaveAttribute('lang', 'de');
    });

    // A buyer's situation, not a client's words: no blockquote, and led in as the reader's thought.
    it('should lead in each offer\'s problem as the reader\'s thought, not a testimonial', () => {
        const { container } = render(<ServicesPage copy={servicesEn} />);

        expect(container.querySelector('blockquote')).toBeNull();
        expect(screen.getAllByText('You might be thinking:')).toHaveLength(servicesEn.offers.length);
    });

    it('should give every offer the contact form and booking a call', () => {
        render(<ServicesPage copy={servicesEn} />);

        servicesEn.offers.forEach((offer) => {
            const section = within(screen.getByRole('region', { name: offer.name }));

            expect(section.getByRole('link', { name: servicesEn.labels.offerCta })).toHaveAttribute('href', '/contact?topic=project');
            expect(section.getByRole('link', { name: servicesEn.labels.bookCta })).toHaveAttribute('href', links.calendly);
        });
    });

    it('should give the German offers the German contact page', () => {
        render(<ServicesPage copy={servicesDe} />);

        expect(screen.getAllByText('Vielleicht denken Sie gerade:')).toHaveLength(servicesDe.offers.length);
        expect(screen.getAllByRole('link', { name: servicesDe.labels.offerCta })[0]).toHaveAttribute('href', '/de/kontakt?topic=project');
    });

    it('should anchor a section per offer at the id the homepage cards link to', () => {
        const { container } = render(<ServicesPage copy={servicesEn} />);

        servicesEn.offers.forEach((offer) => {
            const section = container.querySelector(`section#${offer.id}`);

            expect(section).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 2, name: offer.name })).toBeInTheDocument();
            expect(section).toHaveTextContent(offer.range);
        });
    });

    it('should send every chooser row to its offer', () => {
        render(<ServicesPage copy={servicesEn} />);

        const chooser = screen.getByRole('region', { name: servicesEn.chooser.title });

        servicesEn.chooser.rows.forEach((row) => {
            expect(within(chooser).getByRole('link', { name: new RegExp(row.situation) })).toHaveAttribute('href', `#${row.offerId}`);
        });
    });

    it('should render every FAQ answer in the markup, closed', () => {
        const { container } = render(<ServicesPage copy={servicesEn} />);

        const details = container.querySelectorAll('details');

        expect(details).toHaveLength(servicesEn.faq.items.length);
        servicesEn.faq.items.forEach((item) => {
            expect(screen.getByText(item.answer)).toBeInTheDocument();
        });
        details.forEach((disclosure) => {
            expect(disclosure).not.toHaveAttribute('open');
        });
    });

    it('should offer the call and the contact form', () => {
        render(<ServicesPage copy={servicesEn} />);

        screen.getAllByRole('link', { name: servicesEn.hero.callLabel }).forEach((link) => {
            expect(link).toHaveAttribute('href', links.calendly);
        });
        screen.getAllByRole('link', { name: servicesEn.hero.writeLabel }).forEach((link) => {
            expect(link).toHaveAttribute('href', '/contact?topic=project');
        });
    });

    it('should send the German page\'s visitors to the German contact form', () => {
        render(<ServicesPage copy={servicesDe} />);

        screen.getAllByRole('link', { name: servicesDe.hero.writeLabel }).forEach((link) => {
            expect(link).toHaveAttribute('href', '/de/kontakt?topic=project');
        });
    });

    it('should name the case studies behind the outcomes', () => {
        render(<ServicesPage copy={servicesDe} />);

        expect(screen.getByRole('heading', { level: 3, name: 'Edithing' })).toBeInTheDocument();
    });

    it('should link each outcome to its case study page', () => {
        render(<ServicesPage copy={servicesEn} />);

        caseStudies
            .filter(study => servicesEn.outcomes.items.some(item => item.caseId === study.id))
            .forEach((study) => {
                expect(screen.getByRole('link', { name: `${servicesEn.outcomes.linkLabel}: ${study.title}` }))
                    .toHaveAttribute('href', caseStudyPath(study));
            });
    });

    it('should link each German outcome to the German case study page', () => {
        render(<ServicesPage copy={servicesDe} />);

        caseStudies
            .filter(study => servicesDe.outcomes.items.some(item => item.caseId === study.id))
            .forEach((study) => {
                expect(screen.getByRole('link', { name: `${servicesDe.outcomes.linkLabel}: ${study.title}` }))
                    .toHaveAttribute('href', `/de/referenzen/${study.slug}`);
            });
    });
});
