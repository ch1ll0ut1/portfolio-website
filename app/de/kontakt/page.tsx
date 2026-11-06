import { FC } from 'react';
import type { Metadata } from 'next';
import { issueContactToken, sendContactMessage } from '@/app/(en)/contact/actions';
import { ContactRoute } from '@/components/contact/ContactRoute';
import { contactMetadata } from '@/components/contact/contactMetadata';
import { GermanContactCopy } from '@/components/contact/GermanContactCopy';

export const metadata: Metadata = contactMetadata('de');

/**
 * The German contact page, the twin of `/contact`, prerendered the same way.
 * It shares the English page's Server Actions; React posts them to this
 * page's own path, `/de/kontakt`, which BotID protects too
 * (instrumentation-client.ts).
 */
const Kontakt: FC = () => (
    <GermanContactCopy>
        <ContactRoute locale="de" action={sendContactMessage} issueToken={issueContactToken} />
    </GermanContactCopy>
);

export default Kontakt;
