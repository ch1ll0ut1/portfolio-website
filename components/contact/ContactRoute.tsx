import { type ComponentProps, FC } from 'react';
// ContactPage before ReadingShell: the import order is the CSS order, and this
// one keeps the contact styles in their own chunk instead of merged into the
// stylesheet every reading page loads.
import { ContactPage } from './ContactPage';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { contactJsonLd } from './contactMetadata';

type Props = ComponentProps<typeof ContactPage>;

/**
 * Everything a contact route renders, in one language: the structured data
 * and the page in the reading shell. The route passes in its Server Actions;
 * its metadata comes from `contactMetadata`.
 */
export const ContactRoute: FC<Props> = (props) => {
    return (
        <>
            <JsonLd data={contactJsonLd(props.locale)} />
            <ReadingShell>
                <ContactPage {...props} />
            </ReadingShell>
        </>
    );
};
