import { type FC } from 'react';
import type { ServicesPageCopy } from '@/config/services/types';
import { FitSection } from './FitSection';
import { OfferChooser } from './OfferChooser';
import { OfferSection } from './OfferSection';
import { Outcomes } from './Outcomes';
import { ServicesCta } from './ServicesCta';
import { ServicesFaq } from './ServicesFaq';
import { ServicesHeader } from './ServicesHeader';
import { ServicesProcess } from './ServicesProcess';
import { TimeZones } from './TimeZones';

interface Props {
    copy: ServicesPageCopy;
}

/**
 * The services page body, in the language of `copy`.
 *
 * `/services` and `/de/leistungen` both render this with their own copy
 * object. The root element carries the copy's `lang`, since the document's
 * `<html lang>` comes from the shared layout and stays English.
 */
export const ServicesPage: FC<Props> = ({ copy }) => (
    <div className="wrap" lang={copy.lang}>
        <ServicesHeader copy={copy} />
        <OfferChooser copy={copy} />
        {copy.offers.map(offer => (
            <OfferSection key={offer.id} offer={offer} labels={copy.labels} />
        ))}
        <ServicesProcess copy={copy} />
        <TimeZones copy={copy} />
        <Outcomes copy={copy} />
        <FitSection copy={copy} />
        <ServicesFaq copy={copy} />
        <ServicesCta copy={copy} />
    </div>
);
