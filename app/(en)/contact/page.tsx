import { FC } from 'react';
import type { Metadata } from 'next';
import { ContactRoute } from '@/components/contact/ContactRoute';
import { EnglishContactCopy } from '@/components/contact/EnglishContactCopy';
import { contactMetadata } from '@/components/contact/contactMetadata';
import { issueContactToken, sendContactMessage } from './actions';

export const metadata: Metadata = contactMetadata('en');

/**
 * Prerendered like every other page. Nothing in it is per request: the form
 * asks for its signed token when it mounts, and reads `?topic=` in the
 * browser. Both need JavaScript, which the form needs anyway (BotID).
 */
const Contact: FC = () => (
    <EnglishContactCopy>
        <ContactRoute locale="en" action={sendContactMessage} issueToken={issueContactToken} />
    </EnglishContactCopy>
);

export default Contact;
