/**
 * The shape of the legal notice (Impressum): the facts about who provides the
 * site, which are the same in both languages, and the words around them,
 * which each language fills.
 */

/** A name and a postal address, one line per entry. */
export interface PersonWithAddress {
    name: string;
    address: string[];
}

/**
 * Who provides the site, as § 5 DDG and § 18 MStV ask. Every value Stefan
 * still has to supply is a placeholder (see `./provider.ts`).
 */
export interface LegalProvider extends PersonWithAddress {
    /**
     * Where he is established: a street address that documents can be served
     * at. A P.O. box does not do.
     */
    address: string[];
    /** The address for fast electronic contact (§ 5 Abs. 1 Nr. 2 DDG). */
    email: string;
    /** A German VAT ID under § 27a UStG. `null` when he holds none, which hides the section. */
    vatId: string | null;
    /**
     * The person responsible for the journalistic-editorial content under
     * § 18 Abs. 2 MStV. Only someone whose permanent residence is in Germany
     * may be named. `null` hides the section.
     */
    editorialResponsible: PersonWithAddress | null;
}

export interface LegalNoticeCopy {
    meta: {
        title: string;
        description: string;
    };
    kicker: string;
    title: string;
    provider: {
        heading: string;
        /** What he does, under his name. */
        designation: string;
    };
    contact: {
        heading: string;
        /** `{email}` is the email address, linked. */
        email: string;
        /** `{link}` is the contact form's address, linked. */
        contactForm: string;
    };
    vatId: {
        heading: string;
        /** `{vatId}` is the number. */
        text: string;
    };
    editorialResponsible: {
        heading: string;
    };
}
