/**
 * The career history, rendered as a `git log --graph`.
 *
 * Ordered newest first, the way `git log` prints. The list is one history with
 * two lanes: independent work since 2020 sits on the `indie` branch, which
 * forks off `main` at the commit flagged `isFork`. Everything below the fork is
 * the employed track on `main`, down to the commit flagged `isRoot`.
 *
 * The hashes are decorative, but they are fixed strings rather than generated
 * ones so the scramble animation always settles to the same value.
 */

export type CareerBranch = 'indie' | 'main';

export interface CommitRef {
    /** Text of the ref chip shown before the title, e.g. `HEAD → indie`. */
    label: string;
    /** HEAD refs are drawn in the caret color. */
    isHead: boolean;
}

export interface CareerCommit {
    /** Seven hex characters, like an abbreviated git hash. */
    hash: string;
    /** Year range of the role, e.g. `2013–2015`. */
    years: string;
    title: string;
    description: string;
    branch: CareerBranch;
    /** Ref chip rendered before the title. */
    ref?: CommitRef;
    /** The last commit on `indie`: where the branch leaves `main`. */
    isFork?: boolean;
    /** The oldest commit in the log. */
    isRoot?: boolean;
}

export const careerLog: CareerCommit[] = [
    {
        hash: 'f0c2a19',
        years: '2025–now',
        title: 'Sole engineer, Fokus-Nachhilfe.ch',
        description: 'New customer platform for a Swiss tutoring company. Next.js on Vercel, Supabase, HubSpot CRM, fully AI-augmented workflow.',
        branch: 'indie',
        ref: { label: 'HEAD → indie', isHead: true },
    },
    {
        hash: 'e7d1b04',
        years: '2023–2025',
        title: 'Lead architect, Edithing for the Parliament of Iceland',
        description: 'Open-source structured legal editor on Slate.js, designed with parliamentary stakeholders.',
        branch: 'indie',
    },
    {
        hash: 'c3a9f52',
        years: '2022–2023',
        title: 'Technical lead & product architect, Social-Bee',
        description: 'Built the tech and product department from zero: hiring, process, UX, and the AWS platform.',
        branch: 'indie',
    },
    {
        hash: '9d2c18e',
        years: '2021–2022',
        title: 'Lead developer, DirectMail',
        description: 'Rich text editor for structured email content, used by thousands of people.',
        branch: 'indie',
    },
    {
        hash: 'a4f07c3',
        years: '2021',
        title: 'Antler founder program & interim CTO',
        description: 'Selected for the founder program: prototypes, customer research, and investor pitches. Also interim CTO for an early-stage health-tech startup: led a team of eight and planned HIPAA compliance.',
        branch: 'indie',
    },
    {
        hash: '8e5b3a7',
        years: '2020–2021',
        title: 'Technical co-founder, BlueReceipt',
        description: 'SMS marketing platform for Shopify brands. Typed data layer, custom ORM, marketing automation pipeline, and a team of six.',
        branch: 'indie',
        isFork: true,
    },
    {
        hash: '7a1d940',
        years: '2018–2020',
        title: 'Senior full-stack engineer, Agoda',
        description: 'Flight search at one of Asia’s largest travel platforms. Led and mentored a team of four, improved frontend performance and monitoring, and ran a department-wide code quality initiative.',
        branch: 'main',
        ref: { label: 'main', isHead: false },
    },
    {
        hash: '6c0f2e1',
        years: '2017–2018',
        title: 'Lead full-stack developer, Slimwiki',
        description: 'Collaborative wiki with real-time editing, offline-first sync, and a custom editor. Automated AWS infrastructure.',
        branch: 'main',
    },
    {
        hash: '5b94d6a',
        years: '2015–2017',
        title: 'Senior full-stack developer, Eko',
        description: 'Doubled real-time messaging performance and built Elasticsearch search for the iOS and Android apps.',
        branch: 'main',
    },
    {
        hash: '4e28a1f',
        years: '2013–2015',
        title: 'Software consultant, Bangkok',
        description: 'Led Indycloud’s development with a team of two. Sole developer on a hotel walkthrough CMS, a doctor discovery platform, and a children’s mobile typing game; backend for an ML chatbot.',
        branch: 'main',
    },
    {
        hash: '3f7c0b2',
        years: '2011–2013',
        title: 'Tech lead & project manager, Break Media Solutions',
        description: 'Custom CMS and e-commerce platforms in Austria, with a distributed team of twelve.',
        branch: 'main',
    },
    {
        hash: '2a0e5d9',
        years: '2008–2011',
        title: 'Full-stack developer, Agentur neun.li',
        description: 'Wrote about half of a proprietary CMS in Liechtenstein, and dozens of client sites on it. Once shipped one in four hours.',
        branch: 'main',
        isRoot: true,
    },
];
