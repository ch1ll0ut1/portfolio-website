/**
 * The web app manifest's icons. `app/icons/[name]/route.tsx` renders one PNG
 * per entry and `app/manifest.ts` lists them, both from this table.
 */

export interface ManifestIcon {
    /** File name under `/icons/`. */
    file: string;
    /** Edge length in pixels. */
    size: number;
    /** Full-bleed variant for launchers that crop icons to their own shape. */
    maskable: boolean;
}

export const manifestIcons: ManifestIcon[] = [
    { file: 'icon-192.png', size: 192, maskable: false },
    { file: 'icon-512.png', size: 512, maskable: false },
    { file: 'icon-maskable-192.png', size: 192, maskable: true },
    { file: 'icon-maskable-512.png', size: 512, maskable: true },
];

/** Public path of a manifest icon. */
export const manifestIconPath = (icon: ManifestIcon) => `/icons/${icon.file}`;
