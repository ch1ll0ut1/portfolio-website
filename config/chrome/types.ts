/**
 * The shape of the site chrome's words: the nav, the command palette and its
 * commands, the shortcuts list, the theme switch and the toasts. The chrome
 * stays mounted across pages, so these are read on every page of a language.
 */

/** The homepage's sections, as `config/sections.ts` lists them. */
export type SectionId = 'top' | 'proof' | 'work' | 'services' | 'process' | 'experience' | 'writing' | 'contact';

/** The palette's commands other than the "Go to" ones, as `config/commands.ts` lists them. */
export type CommandId
    = | 'book-call'
      | 'switch-theme'
      | 'shortcuts'
      | 'single-key-shortcuts'
      | 'custom-cursor'
      | 'cookie-settings'
      | 'github'
      | 'linkedin'
      | 'services-page'
      | 'blog'
      | 'contact-form';

export type CommandGroupId = 'goTo' | 'actions' | 'elsewhere';

export interface CommandCopy {
    label: string;
    /** Secondary text, when it is words; keys, names and paths are data. */
    hint?: string;
}

export interface ChromeCopy {
    /** Each section's name in the nav, the palette and the shortcuts list. */
    sections: Record<SectionId, string>;
    nav: {
        skipLink: string;
        /** The accessible name of the section links. */
        sections: string;
        book: string;
        /** The visible label of the button that opens the mobile menu. */
        menu: string;
        /** The command palette button's accessible name. */
        openMenu: string;
        /** The mobile menu: its accessible name, its close button and its two actions. */
        mobileMenu: {
            label: string;
            close: string;
            book: string;
            write: string;
        };
        /** The brand link's name: to the top of the homepage, or to it from elsewhere. */
        brandTop: string;
        brandHome: string;
    };
    themeToggle: string;
    palette: {
        label: string;
        placeholder: string;
        /** The placeholder on a narrow screen. */
        placeholderNarrow: string;
        search: string;
        close: string;
        list: string;
        empty: string;
        /** Announced as the filter changes. */
        noResults: string;
        results: (count: number) => string;
        /** The footer's key legend. */
        move: string;
        run: string;
        shortcuts: string;
    };
    commands: {
        groups: Record<CommandGroupId, string>;
        items: Record<CommandId, CommandCopy>;
    };
    shortcuts: {
        title: string;
        close: string;
        palette: string;
        theme: string;
        /** The `l` row, in the page's language. */
        language: string;
        goTo: (section: string) => string;
        top: string;
        help: string;
        setting: string;
        settingHint: string;
    };
    /** Shown while a `g` chord waits for its second key. */
    chordHint: (keys: string) => string;
    toasts: {
        singleKeysOn: string;
        singleKeysOff: string;
        cursorOn: string;
        cursorOff: string;
    };
}
